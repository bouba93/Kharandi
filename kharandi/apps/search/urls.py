from django.urls import path
from .views import SearchExamResultsView, ExamStatsView

urlpatterns = [
    path("", SearchExamResultsView.as_view(), name="search-unified"),
    path("exams/", SearchExamResultsView.as_view(), name="search-exams"),
    path("stats/", ExamStatsView.as_view(), name="search-stats"),
]
