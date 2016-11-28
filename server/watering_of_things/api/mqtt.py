from __future__ import absolute_import
import paho.mqtt.client as mqtt
from paho.mqtt.publish import single
from watering_of_things.api.models import MicroController, Plant, MoistureValue
import logging
import json


logger = logging.getLogger(__name__)

# mqtt server
HOSTNAME = 'test.mosca.io'
PORT = 1883
MATCH_ANY = '+'

# Topics for mqtt
BASE_TOPIC = 'WateringOfPlants/microController/'
MOISTURE_VALUES_TOPIC = BASE_TOPIC + MATCH_ANY + '/measuredValues/' + MATCH_ANY

# Position of variables in topics list which has been splitted at every '/'
INDEX_CONTROLLER_ID = 2
INDEX_ACTUAL_TOPIC = 3
INDEX_PIN = 4


def _water_topic(micro_controller_id):
    return BASE_TOPIC + micro_controller_id + '/water'


def _on_connect(client, userdata, flags, rc):
    logger.info('Mqtt client connected')
    client.subscribe('WateringOfPlants/microController/' + MATCH_ANY + '/measuredValues/' + MATCH_ANY)


def _on_moisture_values_measured(client, userdata, msg):
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
    topic = _water_topic(micro_controller_id)
    message = {'position': plant.position, 'time': time}
    client.publish(topic, json.dumps(message))


def request_moisture_values(controller_id, pins):
    message = {'nrOfPins': len(pins), 'pins': pins}
    single(topic=_water_topic(controller_id), payload=json.dumps(message), hostname=HOSTNAME, port=PORT)


client = mqtt.Client()
client.on_connect = _on_connect
client.message_callback_add(MOISTURE_VALUES_TOPIC, _on_moisture_values_measured)
client.connect_async(host=HOSTNAME, port=PORT, keepalive=60)
client.loop_start()

