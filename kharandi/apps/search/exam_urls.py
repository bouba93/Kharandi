from django.urls import path
from .views import SearchExamResultsView, ExamStatsView

urlpatterns = [
    path("search/", SearchExamResultsView.as_view(), name="results-search"),
    path("search", SearchExamResultsView.as_view(), name="results-search-noslash"),
    path("stats/", ExamStatsView.as_view(), name="results-stats"),
]
