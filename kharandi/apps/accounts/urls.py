from django.urls import path
from .views import ProfileView, HealthView

urlpatterns = [
    path("profile/", ProfileView.as_view(), name="profile"),
    path("health/", HealthView.as_view(), name="health"),
]
