from django.urls import path
from rest_framework.views import APIView
from rest_framework.response import Response


class AIAssistantAskView(APIView):
    def post(self, request):
        question = request.data.get("message") or request.data.get("question", "")
        # Prof Karamo AI Logic handler on Django
        return Response({
            "status": "success",
            "reply": f"Professeur Karamo a bien reçu votre demande sur le programme guinéen.",
            "answer": f"Professeur Karamo a bien reçu votre demande sur le programme guinéen."
        })


urlpatterns = [
    path("ask/", AIAssistantAskView.as_view(), name="ai-ask"),
    path("ask/stream/", AIAssistantAskView.as_view(), name="ai-ask-stream"),
]
