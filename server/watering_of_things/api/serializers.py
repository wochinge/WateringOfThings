from watering_of_things.api.models import Plant, MoistureValue
from rest_framework import serializers


class MoistureValueSerializer(serializers.ModelSerializer):

    class Meta:
        model = MoistureValue()
        fields = ('date', 'value')


class PlantSerializer(serializers.ModelSerializer):
    latestMoistureValue = serializers.FloatField(source='get_latest', required=False, read_only=True)

    class Meta:
        model = Plant
        fields = ('id', 'name', 'pin', 'position', 'moistureThreshold', 'latestMoistureValue')


