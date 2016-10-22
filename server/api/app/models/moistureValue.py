from django.db import models
from api.app.models.plant import Plant


class MoistureValue(models.Model):
    date = models.DateTimeField(auto_now_add=True)
    plant = models.ForeignKey(Plant, on_delete=models.CASCADE)
    value = models.FloatField()

    class Meta:
        db_table = 'MoistureValue'
        app_label = 'app'
