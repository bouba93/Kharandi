from django.urls import path
from .models import ReportCreateView

urlpatterns = [
    path("", ReportCreateView.as_view(), name="report-create"),
]
