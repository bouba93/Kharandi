from django.db import models


class Transaction(models.Model):
    user_id = models.CharField(max_length=120)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    provider = models.CharField(max_length=50, default="ORANGE_MONEY")
    status = models.CharField(max_length=20, default="PENDING")
    reference = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
