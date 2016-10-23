# Create your views here.
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from api.app.models import MicroController, Plant, MoistureValue
from api.app.serializers import MicroControllerSerializer, PlantSerializer, MoistureValueSerializer
from api.app.mqtt import water_plant


def exists_microcontroller_id(controller_id):
    return MicroController.objects.filter(id=controller_id).count() == 1


def exists_plant(controller_id, plant_id):
    return Plant.objects.filter(id=plant_id, microController__id=controller_id).count() == 1


class MicroControllerView(APIView):

    def post(self, request):
        serializer = MicroControllerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
        return Response(status=status.HTTP_201_CREATED)


class PlantView(APIView):

    def get(self, request, controller_id, format=None):
        if not exists_microcontroller_id(controller_id):
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        plants = Plant.objects.filter(microController__id=controller_id)
        serializer = PlantSerializer(plants, many=True)
        water_plant('1234', 100)
        return Response(serializer.data)

    def post(self, request, controller_id):
        if not exists_microcontroller_id(controller_id):
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        serializer = PlantSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(microController_id=controller_id)


class WaterPlantView(APIView):

    def post(self, request, controller_id, plant_id, amount, format=None):
        if not exists_plant(controller_id, plant_id):
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        plant = Plant.objects.get(id=plant_id)
        water_plant(controller_id, plant.pin, amount)
        return Response(status=status.HTTP_200_OK)




