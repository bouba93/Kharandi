from rest_framework.views import APIView
from rest_framework.response import Response


class PaymentInitView(APIView):
    def post(self, request):
        return Response({"status": "success", "message": "Payment initialised"})
