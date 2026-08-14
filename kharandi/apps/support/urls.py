from django.urls import path
from .models import SupportTicketView

urlpatterns = [
    path("tickets/", SupportTicketView.as_view(), name="support-ticket"),
]
