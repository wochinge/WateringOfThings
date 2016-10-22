from rest_framework import serializers
from api.app.serializers import MoistureValueSerializer
from api.app.models import Plant


class PlantSerializer(serializers.ModelSerializer):
    moistureValues = MoistureValueSerializer(many=True, read_only=True)

    class Meta:
        model = Plant
        fields = ('pin', 'moistureValues', 'moistureThreshold')