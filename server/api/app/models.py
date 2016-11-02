from django.db import models

# Create your models here.


class MicroController(models.Model):
    id = models.CharField(primary_key=True, max_length=50)


class Plant(models.Model):
    name = models.CharField(max_length=100)
    microController = models.ForeignKey(MicroController, on_delete=models.CASCADE)
    pin = models.IntegerField()
    position = models.IntegerField()
    moistureThreshold = models.FloatField()

    def get_latest(self):
        moisture_values = self.moisturevalue_set.all()
        if moisture_values.count() == 0:
            return None
        else:
            return moisture_values.latest('date').value


class MoistureValue(models.Model):
    date = models.DateTimeField(auto_now_add=True)
    plant = models.ForeignKey(Plant, on_delete=models.CASCADE)
    value = models.FloatField()
