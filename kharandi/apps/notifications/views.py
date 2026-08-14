from rest_framework.views import APIView
from rest_framework.response import Response


class NotificationListView(APIView):
    def get(self, request):
        return Response({"status": "success", "data": []})


class MarkReadView(APIView):
    def post(self, request, notif_id=None):
        return Response({"status": "success", "message": "Marked as read"})
