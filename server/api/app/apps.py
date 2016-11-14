from django.apps import AppConfig


class AppConfig(AppConfig):
    name = 'api.app'

    def ready(self):
        from api.app.models import MicroController, Plant, MoistureValue
        controller, _ = MicroController.objects.get_or_create(id='3')

        raspberry, _ = Plant.objects.get_or_create(name="Himbeere", pin=1, position=0, moistureThreshold=22.0, microController=controller)
        MoistureValue.objects.get_or_create(plant=raspberry, value=50)
        MoistureValue.objects.get_or_create(plant=raspberry, value=100)

        cactus, _ = Plant.objects.get_or_create(name="Kaktus", pin=2, position=45, moistureThreshold=5.0, microController=controller)
        MoistureValue.objects.get_or_create(plant=cactus, value=10)

        rose, _ = Plant.objects.get_or_create(name="Rose", pin=4, position=100, moistureThreshold=50.0, microController=controller)
        MoistureValue.objects.get_or_create(plant=rose, value=0)

