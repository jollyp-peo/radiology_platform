from rest_framework import serializers
from .models import AtlasSeries, AtlasImage

class AtlasImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = AtlasImage
        fields = ['id', 'image', 'instance_number']

class AtlasSeriesSerializer(serializers.ModelSerializer):
    images = AtlasImageSerializer(many=True, read_only=True)

    class Meta:
        model = AtlasSeries
        fields = ['id', 'name', 'modality', 'description', 'legend_image', 'images']
