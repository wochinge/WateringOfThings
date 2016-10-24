#include <Adafruit_CC3000.h>
#include <ccspi.h>
#include <SPI.h>
#include <cc3000_PubSubClient.h>
#include <ArduinoJson.h>

// These are the interrupt and control pins
#define ADAFRUIT_CC3000_IRQ   3  // MUST be an interrupt pin!

// These can be any two pins
#define ADAFRUIT_CC3000_VBAT  5
#define ADAFRUIT_CC3000_CS    10

// Use hardware SPI for the remaining pins
// On an UNO, SCK = 13, MISO = 12, and MOSI = 11
Adafruit_CC3000 cc3000 = Adafruit_CC3000(ADAFRUIT_CC3000_CS, ADAFRUIT_CC3000_IRQ, ADAFRUIT_CC3000_VBAT, SPI_CLOCK_DIVIDER);

#define WLAN_SSID       "ToDo"
#define WLAN_PASS       "l(SA*8q!VbV3MD8gE4SX"

// Security can be WLAN_SEC_UNSEC, WLAN_SEC_WEP, WLAN_SEC_WPA or WLAN_SEC_WPA2
#define WLAN_SECURITY   WLAN_SEC_WPA2

#define ARDUINO_ID "123456789"
#define BASE_TOPIC "WateringOfPlants/microController/" ARDUINO_ID 
#define WATER_PLANTS BASE_TOPIC "/water"
#define MEASURE_MOISTURE BASE_TOPIC "/measure"
#define MOISTURE_VALUES BASE_TOPIC "/measuredValues/"

Adafruit_CC3000_Client client;
cc3000_PubSubClient mqttclient;
uint32_t ip;

void waterPlant(int position, int time) {
  Serial.println("Water plant");
  Serial.println(position);
  Serial.println(time);
  delay(time);
  Serial.println("Watering end");  
}

void getMoistureValues(JsonArray& pins, int nrOfPins) {
  char concatenated[sizeof(MOISTURE_VALUES) + 1];
  for (int i = 0; i < nrOfPins; ++i) {
    sprintf(concatenated,"%s%i", MOISTURE_VALUES, pins[i].as<int>());
    Serial.println(concatenated);
    mqttclient.publish(concatenated, "hallo");
  }
}

void callback (char* topic, byte* payload, unsigned int length) {
  StaticJsonBuffer<100> jsonBuffer;
  JsonObject& root = jsonBuffer.parseObject((char*) payload);
  String parsedTopic(topic);
  Serial.println(topic);
  //free(topic);
  if (parsedTopic == WATER_PLANTS) {
    waterPlant(root["position"], root["time"]);
  } else if (parsedTopic == MEASURE_MOISTURE) {
    getMoistureValues(root["pins"], root["nrOfPins"]);
  } else {
    Serial.print("Unknown topic: ");
    Serial.println(topic);
  }
}

void setup(void)
{
  Serial.begin(115200);
  
  Serial.println(F("\nInitialising the CC3000 ..."));
  if (!cc3000.begin()) {
    Serial.println(F("Unable to initialise the CC3000! Check your wiring?"));
    for(;;);
  }
  
  /* NOTE: Secure connections are not available in 'Tiny' mode! */
  if (!cc3000.connectToAP(WLAN_SSID, WLAN_PASS, WLAN_SECURITY)) {
    Serial.println(F("Failed!"));
    while(1);
  }
   
  Serial.println(F("Connected!"));
  
  /* Wait for DHCP to complete */
  Serial.println(F("Request DHCP"));
  while (!cc3000.checkDHCP()) {
    delay(100); // ToDo: Insert a DHCP timeout!
  }
  Serial.println("DHCP done");

  while (ip == 0) {
    if (! cc3000.getHostByName("test.mosca.io", &ip)) {
      Serial.println(F("Couldn't resolve!"));
    }
    delay(500);
  }
  Serial.println("get hostbyname done");
   // connect to the broker
   if (!client.connected()) {
     client = cc3000.connectTCP(ip, 1883);
   }
   mqttclient = cc3000_PubSubClient(ip, 1883, callback, client, cc3000);
   Serial.println("Connecting done");
   // did that last thing work? sweet, let's do something
   if(client.connected()) {
    if (mqttclient.connect("clientId-nr78ZXWMF5")) {
      mqttclient.subscribe(WATER_PLANTS);
      mqttclient.subscribe(MEASURE_MOISTURE);
    }
   } 
}

void loop(void) {
  mqttclient.loop();
}
