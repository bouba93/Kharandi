from rest_framework import serializers
from .models import Subject, Document, ReadingProgress


class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ["id", "name", "slug", "icon", "description"]


class DocumentListSerializer(serializers.ModelSerializer):
    subject = SubjectSerializer(read_only=True)

    class Meta:
        model = Document
        fields = [
            "id",
            "title",
            "description",
            "doc_type",
            "category",
            "subject",
            "level",
            "year",
            "country",
            "institution",
            "is_free",
            "downloads",
            "file_url",
            "external_url",
            "created_at",
            "updated_at",
        ]


class DocumentDetailSerializer(serializers.ModelSerializer):
    subject = SubjectSerializer(read_only=True)

    class Meta:
        model = Document
        fields = [
            "id",
            "title",
            "description",
            "doc_type",
            "category",
            "subject",
            "level",
            "year",
            "country",
            "institution",
            "is_free",
            "downloads",
            "file_url",
            "external_url",
            "content",
            "created_at",
            "updated_at",
        ]


class ReadingProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReadingProgress
        fields = ["document", "progress", "is_read", "last_accessed"]
