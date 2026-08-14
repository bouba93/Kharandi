import unicodedata
from django.db.models import Q
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import ExamResult
from .serializers import ExamResultSerializer


def normalize_search(text: str) -> str:
    if not text:
        return ""
    text = unicodedata.normalize("NFD", text)
    text = "".join(ch for ch in text if unicodedata.category(ch) != "Mn")
    return text.strip()


class SearchExamResultsView(APIView):
    """
    Vue de recherche ultra-rapide et unifiée pour tous les résultats d'examens nationaux (BAC, BEPC, CEE).
    """
    def get(self, request):
        query = request.query_params.get("q", "").strip()
        search_alt = request.query_params.get("search", "").strip()
        if not query and search_alt:
            query = search_alt

        exam_param = request.query_params.get("exam", "all").strip().lower()
        filter_mode = request.query_params.get("filter", "all").strip().lower()
        limit_param = request.query_params.get("limit", "100")
        output_format = request.query_params.get("format", "")

        try:
            limit = min(int(limit_param), 500)
        except ValueError:
            limit = 100

        qs = ExamResult.objects.all()

        # Filtrage par examen
        if exam_param == "bac":
            qs = qs.filter(exam="BAC")
        elif exam_param in ["bepc", "bepc_eg"]:
            qs = qs.filter(exam="BEPC")
        elif exam_param in ["bepc_fa", "bepcfa", "franco-arabe"]:
            qs = qs.filter(exam="BEPC_FA")
        elif exam_param in ["cee", "7eme", "7ème"]:
            qs = qs.filter(exam="CEE")

        # Filtrage par mot-clé
        if query:
            if filter_mode == "pv":
                qs = qs.filter(pv__icontains=query)
            elif filter_mode == "centre":
                qs = qs.filter(centre__icontains=query)
            elif filter_mode == "noms":
                qs = qs.filter(noms__icontains=query)
            elif filter_mode == "origine":
                qs = qs.filter(origine__icontains=query)
            elif filter_mode == "dpe":
                qs = qs.filter(dpe__icontains=query)
            else:
                qs = qs.filter(
                    Q(pv__icontains=query) |
                    Q(noms__icontains=query) |
                    Q(centre__icontains=query) |
                    Q(origine__icontains=query) |
                    Q(dpe__icontains=query)
                )

        total_count = qs.count()
        results_slice = qs[:limit]
        serializer = ExamResultSerializer(results_slice, many=True)

        response_data = serializer.data
        response = Response(
            {
                "status": "success",
                "total": total_count,
                "limit": limit,
                "exam": exam_param,
                "results": response_data,
                "data": response_data,
            } if output_format == "object" or request.query_params.get("detailed") == "true" else response_data
        )
        response["X-Total-Count"] = str(total_count)
        return response


class ExamStatsView(APIView):
    """Statistiques globales par session d'examen."""
    def get(self, request):
        year = request.query_params.get("year", 2026)
        stats = {
            "total_records": ExamResult.objects.filter(year=year).count(),
            "by_exam": {
                "BAC": ExamResult.objects.filter(exam="BAC", year=year).count(),
                "BEPC": ExamResult.objects.filter(exam="BEPC", year=year).count(),
                "BEPC_FA": ExamResult.objects.filter(exam="BEPC_FA", year=year).count(),
                "CEE": ExamResult.objects.filter(exam="CEE", year=year).count(),
            }
        }
        return Response({"status": "success", "data": stats})
