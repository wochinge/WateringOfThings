
#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <Servo.h>

#include "WifiConfig.h" // provides WLAN_SSID and WLAN_PASS
#include "MqttConfig.h" // provides MQTT_SERVER, MQTT_PORT, MQTT_USERNAME, MQTT_PASSWORD
#include "ID.h" // provides CONTROLLER_ID

#define BASE_TOPIC "WateringOfPlants/microController/" CONTROLLER_ID 
#define WATER_PLANTS BASE_TOPIC "/water"
#define MEASURE_MOISTURE BASE_TOPIC "/measure"
#define MOISTURE_VALUES BASE_TOPIC "/measuredValues/"


#define ANALOG_PIN 0
#define D0 16
#define D1 5
#define D2 4
#define D3 0
#define D4 2
#define D5 14
#define D6 12
#define D7 13
#define D8 15
#define D9 3
#define D10 1

#define A D1
#define B D2
#define C D3
#define MOISTURE_START_PIN D8

#define SERVO_PIN D4
#define PUMP_PIN D7
#define TILL_SERVO_FINISHED 1000

WiFiClient client;
PubSubClient mqttclient(client);

Servo pumpMover;

void waterPlant(int position, int time) {
  pumpMover.attach(SERVO_PIN);
  movePumpTo(180 - position, true);
  digitalWrite(PUMP_PIN, HIGH);
  delay(time);
  digitalWrite(PUMP_PIN, LOW);
  delay(2000);
  movePumpTo(90, false);
  delay(1000);
  pumpMover.detach();
}

void movePumpTo(int position, boolean delayTillFinished) {
  pumpMover.write(position);
  if (delayTillFinished) {
      delay(TILL_SERVO_FINISHED);
  }
}

void getMoistureValues(JsonArray& pins) {
  digitalWrite(MOISTURE_START_PIN, LOW);
  delay(10);
  char payload [89];
  StaticJsonBuffer<120> jsonBuffer;
  JsonObject& root = jsonBuffer.createObject();
 
  for (auto &pin : pins) {
    int moistureValue = readMoistureValue(pin.as<byte>());
    root[pin.as<String>()] = moistureValue;
  }
  root.printTo(payload, sizeof(payload));
  mqttclient.publish(MOISTURE_VALUES, payload);
  digitalWrite(MOISTURE_START_PIN, HIGH); 
}

void callback (char* topic, byte* payload, unsigned int length) {
  StaticJsonBuffer<164> jsonBuffer;
  String parsedTopic(topic);
  Serial.println(topic);
  if (parsedTopic == WATER_PLANTS) {
    JsonObject& root = jsonBuffer.parseObject((char*) payload);
    waterPlant(root["position"], root["time"]);
  } else if (parsedTopic == MEASURE_MOISTURE) {
    JsonArray& pins = jsonBuffer.parseArray((char*) payload);
    getMoistureValues(pins);
  } else {
    Serial.print("Unknown topic: ");
    Serial.println(topic);
  }
}

int readMoistureValue(byte channel) {
   digitalWrite(A, bitRead(channel, 0));
   digitalWrite(B, bitRead(channel, 1));
   digitalWrite(C, bitRead(channel, 2));
   delay(1);
   return analogRead(ANALOG_PIN);
}

void setup(void) {
  Serial.begin(115200);
  delay(10);
  pumpMover.attach(SERVO_PIN);
  // Go to starting position
  movePumpTo(90, false);

  // We start by connecting to a WiFi network
  WiFi.begin(WLAN_SSID, WLAN_PASS);

  Serial.print("\nWait for WiFi... ");

  while(WiFi.status() != WL_CONNECTED) {
      Serial.print(".");
      delay(500);
  }

  Serial.println("\nWiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
  
  mqttclient.setServer(MQTT_SERVER, MQTT_PORT);
  mqttclient.setCallback(callback);

  pinMode(A, OUTPUT);
  pinMode(B, OUTPUT);
  pinMode(C, OUTPUT);
  pinMode(MOISTURE_START_PIN, OUTPUT);
  digitalWrite(MOISTURE_START_PIN, HIGH);
  pinMode(PUMP_PIN, OUTPUT);
  pumpMover.detach();
}

void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Attempt to connect
    if (mqttclient.connect(CONTROLLER_ID, MQTT_USERNAME, MQTT_PASSWORD)) {
      mqttclient.publish(BASE_TOPIC, "Connected");
      mqttclient.subscribe(WATER_PLANTS);
      mqttclient.subscribe(MEASURE_MOISTURE);
    } else {
      Serial.print("failed, rc=");
      Serial.print(mqttclient.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}

void loop(void) {
  if (!mqttclient.connected()) {
    reconnect();
  }
  mqttclient.loop();
}

