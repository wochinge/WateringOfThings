from api.app.models import MicroController, Plant, MoistureValue
from rest_framework import serializers


class MicroControllerSerializer(serializers.ModelSerializer):

    class Meta:
        model = MicroController
        fields = ('id',)


class MoistureValueSerializer(serializers.ModelSerializer):

    class Meta:
        model = MoistureValue
        fields = ('date', 'value')


class PlantSerializer(serializers.ModelSerializer):
    moistureValues = MoistureValueSerializer(many=True, read_only=True)

    class Meta:
        model = Plant
        fields = ('id', 'name', 'pin', 'moistureValues', 'moistureThreshold')
