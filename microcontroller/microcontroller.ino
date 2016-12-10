
#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <Servo.h>

#include "WifiConfig.h" //provides WLAN_SSID and WLAN_PASS

#define ARDUINO_ID "123456789"
#define BASE_TOPIC "WateringOfPlants/microController/" ARDUINO_ID 
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

#define A D5
#define B D6
#define C D7
#define MOISTURE_START_PIN D4

#define SERVO_PIN D2
#define PUMP_PIN D3
#define TILL_SERVO_FINISHED 3000

WiFiClient client;
PubSubClient mqttclient(client);

Servo pumpMover;

void waterPlant(int position, int time) {
  Serial.println("Water plant");
  Serial.println(position);
  movePumpTo(position);
  Serial.println(time);
  digitalWrite(PUMP_PIN, HIGH);
  delay(time);
  digitalWrite(PUMP_PIN, LOW);
  Serial.println("Watering end");  
}

void movePumpTo(int position) {
  pumpMover.write(position);
  delay(TILL_SERVO_FINISHED);
}

void getMoistureValues(JsonArray& pins, int nrOfPins) {
  digitalWrite(MOISTURE_START_PIN, HIGH);
  delay(10);
  char buf[4];
  char concatenated[sizeof(MOISTURE_VALUES) + 1];
  for (int i = 0; i < nrOfPins; ++i) {
    sprintf(concatenated,"%s%i", MOISTURE_VALUES, pins[i].as<int>());
    sprintf (buf, "%04d", readMoistureValue(pins[i]));
    mqttclient.publish(concatenated, buf);
  }
  digitalWrite(MOISTURE_START_PIN, LOW); 
}

void callback (char* topic, byte* payload, unsigned int length) {
  StaticJsonBuffer<100> jsonBuffer;
  JsonObject& root = jsonBuffer.parseObject((char*) payload);
  String parsedTopic(topic);
  Serial.println(topic);
  if (parsedTopic == WATER_PLANTS) {
    waterPlant(root["position"], root["time"]);
  } else if (parsedTopic == MEASURE_MOISTURE) {
    getMoistureValues(root["pins"], root["nrOfPins"]);
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
  
  mqttclient.setServer("test.mosca.io", 1883);
  mqttclient.setCallback(callback);
  
 // did that last thing work? sweet, let's do something
  if (mqttclient.connect("clientId-nr78ZXWMF5")) {
    Serial.println("Connected to mqtt broker");
    mqttclient.publish(BASE_TOPIC, "Initial");
    mqttclient.subscribe(WATER_PLANTS);
    mqttclient.subscribe(MEASURE_MOISTURE);
  }

  pinMode(A, OUTPUT);
  pinMode(B, OUTPUT);
  pinMode(C, OUTPUT);
  pinMode(MOISTURE_START_PIN, OUTPUT);
  pinMode(PUMP_PIN, OUTPUT);
  pumpMover.attach(SERVO_PIN);

}

void loop(void) {
  mqttclient.loop();
}

