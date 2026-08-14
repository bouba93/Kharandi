from django.db import models
from django.urls import path
from rest_framework.views import APIView
from rest_framework.response import Response


class Report(models.Model):
    user_id = models.CharField(max_length=120, blank=True)
    target_type = models.CharField(max_length=50)
    target_id = models.CharField(max_length=120)
    reason = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)


class ReportCreateView(APIView):
    def post(self, request):
        return Response({"status": "success", "message": "Signalement reçu"})
