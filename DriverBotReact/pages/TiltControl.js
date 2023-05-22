import React, { Component } from 'react' 
import { StyleSheet, Text, Button, View } from 'react-native' 
import {DeviceMotion} from 'expo-sensors'

import init from 'react_native_mqtt' 
import AsyncStorage from '@react-native-async-storage/async-storage' 

init({
  size: 10000,
  storageBackend: AsyncStorage,
  defaultExpires: 1000 * 3600 * 24,
  enableCache: true,
  reconnect: true,
  sync: {}
})

var speed = 0
var direction = 0

function onConnect () { 
  console.log("Connected") 
}

function onConnectionLost (responseObject) { 
  if (responseObject.errorCode !== 0) { 
    console.log("Error_Message:" + responseObject.errorMessage) 
    client.connect({ onSuccess: onConnect, useSSL: false, userName: "TageDanielsson", password: "12345" }) 
  }
}


//const client = new Paho.MQTT.Client('10.0.0.2', 8884, "myclientid_" + parseInt(Math.random() * 100, 10)) 
const client = new Paho.MQTT.Client('10.22.5.228', 8884, "myclientid_" + parseInt(Math.random() * 100, 10)) 

client.onConnectionLost = onConnectionLost 
client.connect({ onSuccess: onConnect, useSSL: false, userName: "TageDanielsson", password: "12345" }) 

class TiltControl extends Component { 
  constructor(props) { 
    super(props) 
    this.state = { 
      ForwardValue: 0,
      Direction: 0, 
    }
  }

   componentWillUnmount(){
    DeviceMotion.removeAllListeners();
  }

  componentDidMount () { 
    client.onMessageArrived = (message) => this.onMessageArrived(message) 
    DeviceMotion.addListener((deviceMotionData) => {
      direction = deviceMotionData.rotation.beta * 200 / 3.14
      speed = deviceMotionData.rotation.gamma * 20 / 3.14
      if (direction > 50) {
        direction = 50
      }
      if (direction < -50) {
        direction = -50
      }
      if (speed > 5) {
        speed = 5
      }
      if (speed < -5) {
        speed = -5
      }
      this.setState({ ForwardValue: speed, Direction: direction })
      client.publish("dir",direction.toString());
      client.publish("f",speed.toString());
    })

    DeviceMotion.setUpdateInterval(100)

  }
  
  render () {
    return (
      <View style={styles.container}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>Speed: {this.state.ForwardValue}</Text>
          <Text>Direction: {this.state.Direction}</Text>
        </View>
      </View>

    )
  }
}


export default TiltControl;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%'
  },
})