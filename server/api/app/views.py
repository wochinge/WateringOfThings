# Create your views here.
from rest_framework.response import Response
from rest_framework.views import APIView
from api.app.models import Plant, MoistureValue
from api.app.serializers import PlantSerializer, MoistureValueSerializer


class PlantView(APIView):

    def get(self, request, controllerID, format=None):
        plants = Plant.objects.all()
        serializer = PlantSerializer(plants, many=True)
        return Response(serializer.data)



# class UserViewSet(viewsets.ModelViewSet):
#     """
#     API endpoint that allows users to be viewed or edited.
#     """
#     queryset = User.objects.all().order_by('-date_joined')
#     serializer_class = UserSerializer


# class GroupViewSet(viewsets.ModelViewSet):
#     """
#     API endpoint that allows groups to be viewed or edited.
#     """
#     queryset = Group.objects.all()
#     serializer_class = GroupSerializer