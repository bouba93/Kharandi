from django.db import models
from django.urls import path
from rest_framework.views import APIView
from rest_framework.response import Response


class SupportTicket(models.Model):
    user_id = models.CharField(max_length=120, blank=True)
    subject = models.CharField(max_length=200)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)


class SupportTicketView(APIView):
    def post(self, request):
        return Response({"status": "success", "message": "Ticket créé"})
