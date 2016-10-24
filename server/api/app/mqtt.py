from __future__ import absolute_import
import paho.mqtt.client as mqtt
from api.app.models import MicroController, Plant, MoistureValue
import logging
import json

INDEX_CONTROLLER_ID = 2
INDEX_ACTUAL_TOPIC = 3
INDEX_PIN = 4
logger = logging.getLogger(__name__)

MATCH_ANY = '+'
BASE_TOPIC = 'WateringOfPlants/microController/'
MOISTURE_VALUES_TOPIC = BASE_TOPIC + MATCH_ANY + '/measuredValues/' + MATCH_ANY


def water_topic(micro_controller_id):
    return BASE_TOPIC + micro_controller_id + '/water'


def on_connect(client, userdata, flags, rc):
    logger.info('Mqtt client connected')
    client.subscribe('WateringOfPlants/microController/' + MATCH_ANY + '/measuredValues/' + MATCH_ANY)


def on_moisture_values_measured(client, userdata, msg):
    split = msg.topic.split('/')
    logger.info(msg.topic)

    micro_controller_id = split[INDEX_CONTROLLER_ID]
    micro_controller_exists = MicroController.objects.filter(pk=micro_controller_id).count() == 1

    if not micro_controller_exists:
        return

    if split[INDEX_ACTUAL_TOPIC] == 'measuredValues':
        pin = split[INDEX_PIN]
        value = msg.payload
        plant = Plant.objects.get(microController_id=micro_controller_id, pin=pin)
        MoistureValue.objects.create(plant=plant, value=value)


def water_plant(micro_controller_id, plant, time):
    topic = water_topic(micro_controller_id)
    message = {'position': plant.position, 'time': time}
    client.publish(topic, json.dumps(message))


client = mqtt.Client()
client.on_connect = on_connect
client.message_callback_add(MOISTURE_VALUES_TOPIC, on_moisture_values_measured)
client.connect_async(host='test.mosca.io', port=1883, keepalive=60)
client.loop_start()

