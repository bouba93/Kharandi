from django.urls import path
from .views import NotificationListView, MarkReadView

urlpatterns = [
    path("", NotificationListView.as_view(), name="notification-list"),
    path("read/", MarkReadView.as_view(), name="notifications-mark-all-read"),
    path("<str:notif_id>/read/", MarkReadView.as_view(), name="notification-mark-one-read"),
]
