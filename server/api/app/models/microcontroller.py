from django.db import models


class MicroController(models.Model):
    id = models.CharField(primary_key=True, max_length=50)

    class Meta:
        db_table = 'MicroController'
        app_label = 'app'
