from django.db import models


class Notification(models.Model):
    user_id = models.CharField(max_length=120, db_index=True)
    title = models.CharField(max_length=200)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
