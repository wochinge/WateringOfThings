from rest_framework import serializers
from api.app.models import MoistureValue


class MoistureValueSerializer(serializers.ModelSerializer):

    class Meta:
        model = MoistureValue
        fields = ('date', 'value')