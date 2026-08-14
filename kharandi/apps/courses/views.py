from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Q, F
from .models import Subject, Document, ReadingProgress
from .serializers import (
    SubjectSerializer,
    DocumentListSerializer,
    DocumentDetailSerializer,
    ReadingProgressSerializer
)


class SubjectViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Subject.objects.all().order_by("name")
    serializer_class = SubjectSerializer
    pagination_class = None

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response({"status": "success", "data": serializer.data})


class DocumentViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Document.objects.select_related("subject").all()
    
    def get_serializer_class(self):
        if self.action == "retrieve":
            return DocumentDetailSerializer
        return DocumentListSerializer

    def get_queryset(self):
        qs = Document.objects.select_related("subject").all()

        level = self.request.query_params.get("level")
        if level and level.upper() != "TOUS" and level.upper() != "ALL":
            qs = qs.filter(level__icontains=level)

        doc_type = self.request.query_params.get("doc_type")
        if doc_type and doc_type.upper() != "TOUS":
            qs = qs.filter(doc_type=doc_type)

        category = self.request.query_params.get("category")
        if category and category.upper() != "TOUS":
            qs = qs.filter(category=category)

        subject_id = self.request.query_params.get("subject")
        if subject_id:
            if str(subject_id).isdigit():
                qs = qs.filter(subject_id=int(subject_id))
            else:
                qs = qs.filter(subject__name__icontains=subject_id)

        year = self.request.query_params.get("year")
        if year:
            qs = qs.filter(year=year)

        search = self.request.query_params.get("search") or self.request.query_params.get("q")
        if search:
            search = search.strip()
            qs = qs.filter(
                Q(title__icontains=search) |
                Q(description__icontains=search) |
                Q(level__icontains=search) |
                Q(year__icontains=search) |
                Q(institution__icontains=search) |
                Q(content__icontains=search)
            )

        return qs

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        
        page_size = int(request.query_params.get("page_size", 100))
        page = int(request.query_params.get("page", 1))
        
        total = queryset.count()
        start = (page - 1) * page_size
        end = start + page_size
        
        serializer = self.get_serializer(queryset[start:end], many=True)
        return Response({
            "status": "success",
            "total": total,
            "page": page,
            "page_size": page_size,
            "data": serializer.data,
            "results": serializer.data
        })

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        # Incrémenter les téléchargements / consultations de manière atomique
        Document.objects.filter(pk=instance.pk).update(downloads=F("downloads") + 1)
        instance.refresh_from_db()
        serializer = self.get_serializer(instance)
        return Response({"status": "success", "data": serializer.data})


class ReadingProgressView(APIView):
    def get(self, request, doc_id):
        user_id = request.user.id if request.user.is_authenticated else request.query_params.get("user_id", "guest")
        try:
            progress = ReadingProgress.objects.get(user_id=user_id, document_id=doc_id)
            return Response({"status": "success", "data": ReadingProgressSerializer(progress).data})
        except ReadingProgress.DoesNotExist:
            return Response({"status": "success", "data": {"progress": 0, "is_read": False}})

    def post(self, request, doc_id):
        user_id = request.user.id if request.user.is_authenticated else request.data.get("user_id", "guest")
        progress_val = int(request.data.get("progress", 0))
        is_read = bool(request.data.get("is_read", False))

        progress, _ = ReadingProgress.objects.update_or_create(
            user_id=user_id,
            document_id=doc_id,
            defaults={"progress": progress_val, "is_read": is_read}
        )
        return Response({"status": "success", "data": ReadingProgressSerializer(progress).data})
