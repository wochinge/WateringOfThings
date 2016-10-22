from django.db import models
from api.app.models.microcontroller import MicroController


class Plant(models.Model):
    name = models.CharField(max_length=100)
    microController = models.ForeignKey(MicroController, on_delete=models.CASCADE)
    pin = models.IntegerField()
    moistureThreshold = models.FloatField()

    class Meta:
        db_table = 'Plant'
        app_label = 'app'
