from __future__ import absolute_import
import paho.mqtt.client as mqtt
from api.app.models import MicroController
import logging

INDEX_CONTROLLER_ID = 2
INDEX_ACTUAL_TOPIC = 3
INDEX_PIN = 4
logger = logging.getLogger(__name__)


def water_topic(micro_controller_id):
    return 'WateringOfPlants/microController/' + micro_controller_id + '/water'


def on_connect(client, userdata, flags, rc):
    logger.info('Mqtt client connected')
    client.subscribe('WateringOfPlants/microController/+/measuredValues/+')


def on_message(client, userdata, msg):
    split = msg.topic.split('/')

    if len(split) < 5:
        return

    micro_controller_id = split[INDEX_CONTROLLER_ID]
    micro_controller_exists = MicroController.objects.filter(pk=micro_controller_id).count() == 1

    if not micro_controller_exists:
        return

    if split[INDEX_ACTUAL_TOPIC] == 'measuredValues':
        pin = split[INDEX_PIN]
        value = msg.payload


def water_plant(micro_controller_id, pin, time):
    topic = water_topic(micro_controller_id)
    logger.error(topic)
    client.publish(topic, time)

client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message
client.connect_async('test.mosca.io', 1883, 60)
client.loop_start()

