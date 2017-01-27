from rest_framework import status
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from watering_of_things.api.models import MicroController, Plant
from watering_of_things.api.serializers import PlantSerializer, MoistureValueSerializer
from watering_of_things.api.mqtt import water_plant, request_moisture_values


def exists_microcontroller_id(controller_id):
    return MicroController.objects.filter(id=controller_id).count() == 1


def validate_controller(controller_id):
    get_object_or_404(MicroController, id=controller_id)


def get_plant(controller_id, plant_id):
    return get_object_or_404(Plant, id=plant_id, microController__id=controller_id)


class ControllerView(APIView):

    def get(self, request, controller_id):
        if exists_microcontroller_id(controller_id):
            response_data = {'exists': True}
        else:
            response_data = {'exists': False}
        return Response(status=status.HTTP_200_OK, data=response_data)


class AllPlantsView(APIView):

    def get(self, request, controller_id):
        validate_controller(controller_id)

        plants = Plant.objects.filter(microController__id=controller_id)
        serializer = PlantSerializer(plants, many=True)
        return Response(serializer.data)

    def post(self, request, controller_id):
        serializer = PlantSerializer(data=request.data)
        if exists_microcontroller_id(controller_id) and serializer.is_valid():
            created_plant = serializer.save(microController_id=controller_id)
            request_moisture_values(controller_id, [created_plant.pin])

            return Response(serializer.data)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class PlantView(APIView):

    def get(self, request, controller_id, plant_id):
        plant = get_plant(controller_id, plant_id)
        return Response(PlantSerializer(plant).data)

    def put(self, request, controller_id, plant_id):
        plant = get_plant(controller_id, plant_id)
        updated = PlantSerializer(data=request.data)
        if updated.is_valid():
            updated.update(plant, updated.validated_data)
            return Response(status=status.HTTP_200_OK, data=updated.validated_data)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, controller_id, plant_id):
        plant = get_plant(controller_id, plant_id)
        plant.delete()
        return Response(status=status.HTTP_200_OK)


class WaterPlantView(APIView):

    def post(self, request, controller_id, plant_id, amount):
        plant = get_plant(controller_id, plant_id)
        water_plant(controller_id, plant, amount)
        return Response(status=status.HTTP_200_OK)


class MoistureView(APIView):

    def get(self, request, controller_id, plant_id):
        plant = get_plant(controller_id, plant_id)
        moisture_values = plant.moisturevalue_set.all()
        return Response(MoistureValueSerializer(moisture_values, many=True).data)
