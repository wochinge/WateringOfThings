from __future__ import absolute_import
from datetime import timedelta
from celery.task import periodic_task
from .mqtt import request_moisture_values
from .models import MicroController, Plant


@periodic_task(run_every=timedelta(minutes=30))
def moisture_values():
    controllers = MicroController.objects.all()
    for c in controllers:
        pins = Plant.objects.filter(microController__id=c.id).values_list('pin', flat=True)
        request_moisture_values(c.id, list(pins))
