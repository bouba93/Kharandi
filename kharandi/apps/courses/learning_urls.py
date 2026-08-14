from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SubjectViewSet, DocumentViewSet, ReadingProgressView

router = DefaultRouter()
router.register(r"subjects", SubjectViewSet, basename="learning-subject")
router.register(r"documents", DocumentViewSet, basename="learning-document")

urlpatterns = [
    path("", include(router.urls)),
    path("reading-progress/<str:doc_id>/", ReadingProgressView.as_view(), name="learning-reading-progress"),
]
