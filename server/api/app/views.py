from rest_framework import status
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.response import Response
from rest_framework.views import APIView
from api.app.models import MicroController, Plant
from api.app.serializers import MicroControllerSerializer, PlantSerializer, MoistureValueSerializer
from api.app.mqtt import water_plant


def exists_microcontroller_id(controller_id):
    return MicroController.objects.filter(id=controller_id).count() == 1


def get_plant(controller_id, plant_id):
    try:
        return Plant.objects.get(id=plant_id, microController__id=controller_id)
    except ObjectDoesNotExist:
        return None


def exists_plant(controller_id, plant_id):
    return get_plant(controller_id, plant_id) is not None


class MicroControllerView(APIView):

    def post(self, request):
        serializer = MicroControllerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
        return Response(status=status.HTTP_201_CREATED)


class AllPlantsView(APIView):

    def get(self, request, controller_id):
        if not exists_microcontroller_id(controller_id):
            return Response(status=status.HTTP_400_BAD_REQUEST)

        plants = Plant.objects.filter(microController__id=controller_id)
        serializer = PlantSerializer(plants, many=True)
        return Response(serializer.data)

    def post(self, request, controller_id):
        serializer = PlantSerializer(data=request.data)
        if exists_microcontroller_id(controller_id) and serializer.is_valid():
            serializer.save(microController_id=controller_id)
            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class PlantView(APIView):

    def get(self, request, controller_id, plant_id):
        plant = get_plant(controller_id, plant_id)
        if plant is None:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(PlantSerializer(plant).data)

    def delete(self, request, controller_id, plant_id):
        plant = get_plant(controller_id, plant_id)
        if plant is None:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        else:
            plant.delete()
            return Response(status=status.HTTP_200_OK)


class WaterPlantView(APIView):

    def post(self, request, controller_id, plant_id, amount):
        plant = get_plant(controller_id, plant_id)

        if plant is None:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        water_plant(controller_id, plant, amount)
        return Response(status=status.HTTP_200_OK)


class MoistureView(APIView):

    def get(self, request, controller_id, plant_id):
        plant = get_plant(controller_id, plant_id)

        if plant is None:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        moisture_values = plant.moisturevalue_set.all()
        return Response(MoistureValueSerializer(moisture_values, many=True).data)



