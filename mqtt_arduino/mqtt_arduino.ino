#include "EspMQTTClient.h"
#include <Servo.h>
#include <Wire.h>

Servo Servot;


void onConnectionEstablished();

EspMQTTClient client(
  "ABB_Gym_IOT",
  "Welcome2abb",
  "10.22.5.228",
  "TageDanielsson",
  "12345",
  "Bilen",
  1884
);

int f = 1;
int dir = 1;

// f: forward (0: bakåt, 1: stilla, 3: framåt)
// dir: direction (0: vänster, 1: rakt, 2: höger)
// f och dir är för logs

void setup() {
Wire.begin(D1,D3);
      
pinMode(D1, OUTPUT);
pinMode(D3, OUTPUT);
analogWrite(D1, 0);
Servot.attach(D5,544,2400);
Serial.begin(115200);
}

void onConnectionEstablished()
{
  client.publish("logs", "ESP Connected to broker! ");
  client.subscribe("f", [] (const String &forwardvalue)
  {
    if(forwardvalue.toFloat() < -1.25){
      if(f != 0){
        client.publish("logs", "Driving Backwards");
        digitalWrite(D3, LOW);
        f = 0;
      }
    }
    else if(forwardvalue.toFloat() > 1.25){
      if(f != 2){
        client.publish("logs", "Driving Forwards");
        f = 2;
        digitalWrite(D3, HIGH);
      }
    }
    else{
      if(f != 1){
      f = 1;
      analogWrite(D1, 0);
      client.publish("logs", "Standing Still");
      }
    }

    if(f != 1){
      analogWrite(D1, map(abs(forwardvalue.toFloat()), 0, 10, 0, 1023));
    }
  });

  client.subscribe("dir", [] (const String &direction)
  {
    Servot.write(map(direction.toFloat(), -50, 50, 0, 150));
    if(direction.toFloat() < -5) {
      if(dir != 0) {
        client.publish("logs", "Turned Left");
        dir = 0;
      }
    }
    else if(direction.toFloat() > 5){
      if(dir != 2) {
        client.publish("logs", "Turned Right");
        dir = 2;
      }
    }
    else{
      if(dir != 1) {
        client.publish("logs", "Pointing Straight");
        dir = 1;
      }
    }
    
  });;
  
}


void loop() {
  // put your main code here, to run repeatedly:
client.loop();
}