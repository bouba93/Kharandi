from rest_framework import serializers
from .models import ExamResult


class ExamResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExamResult
        fields = [
            "id",
            "exam",
            "exam_title",
            "year",
            "dpe",
            "rang",
            "ex",
            "noms",
            "centre",
            "pv",
            "origine",
            "option",
            "mention",
        ]
