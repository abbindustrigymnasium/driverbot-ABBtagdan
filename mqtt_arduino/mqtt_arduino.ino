#include "EspMQTTClient.h"
#include <Servo.h>
#include <Wire.h>

Servo Servot;


void onConnectionEstablished();

EspMQTTClient client(
 "ABB_Indgym",
  "mittwifiarsabra",
  "10.22.5.228",
  "",
  "",
  "Bilen",
  1884
);

void setup() {

Wire.begin(D1,D3);
      
pinMode(D1, OUTPUT);
pinMode(D3, OUTPUT);
analogWrite(D1, 0);
Servot.attach(D5,544,2400);
onConnectionEstablished();

float v = 0;

Servot.write(v);

Serial.begin(115200);
}

void onConnectionEstablished()
{
  client.subscribe("f", [] (const String &forwardvalue)
  {
    if(forwardvalue.toFloat() < 0){
      digitalWrite(D3, LOW);
    }
    else{
      digitalWrite(D3, HIGH);
    }
    analogWrite(D1, map(forwardvalue.toFloat(), 0, 5, 0, 1023));
  });
  client.subscribe("dir", [] (const String &direction)
  {
    Servot.write(map(direction.toFloat(), -90, 90, 0, 180));
  });
  
  client.publish("joakim.flink@abbindustrigymnasium.se/lampa", "This is a message");

  client.executeDelayed(5 * 1000, []() {
    client.publish("joakim.flink@abbindustrigymnasium.se/lampa", "This is a message sent 5 seconds later");
  });
}


void loop() {
  // put your main code here, to run repeatedly:
client.loop();
}