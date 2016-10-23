from api.app.models import Plant, MoistureValue
from rest_framework import serializers


class MoistureValueSerializer(serializers.ModelSerializer):

    class Meta:
        model = MoistureValue
        fields = ('date', 'value')


class PlantSerializer(serializers.ModelSerializer):
    moistureValues = MoistureValueSerializer(many=True, read_only=True)

    class Meta:
        model = Plant
        fields = ('pin', 'moistureValues', 'moistureThreshold')
