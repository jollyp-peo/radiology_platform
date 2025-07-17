# cases/serializers.py
from rest_framework import serializers
from .models import Case, CaseImage

class CaseImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = CaseImage
        fields = ['id', 'image', 'instance_number']

class CaseSerializer(serializers.ModelSerializer):
    images = CaseImageSerializer(many=True, read_only=True)

    class Meta:
        model = Case
        fields = ['id', 'title', 'category', 'description', 'images', 'created_at']
