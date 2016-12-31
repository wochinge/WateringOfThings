from __future__ import absolute_import

import os

from celery import Celery

# set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'watering_of_things.settings')

app = Celery('watering_of_things', broker='django://', include=['watering_of_things.api.tasks'])
app.conf.broker_url = 'redis://localhost:6379/0'