import React, { Component } from 'react' 
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native' 


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


// const client = new Paho.MQTT.Client('10.0.0.2', 8884, "myclientid_" + parseInt(Math.random() * 100, 10))
//för nätverket hemma 
const client = new Paho.MQTT.Client('10.22.5.228', 8884, "myclientid_" + parseInt(Math.random() * 100, 10)) 

client.onConnectionLost = onConnectionLost 
client.connect({ onSuccess: onConnect, useSSL: false, userName: "TageDanielsson", password: "12345" }) 

class ButtonControl extends Component { 
  constructor(props) { 
    super(props) 
    this.state = {  
      ForwardValue: 0,
      Direction: 0, 
    }
  }

  publish = () => { 
    client.publish("f", speed.toString())
    client.publish("dir", direction.toString())
  }

  
  render () {
    return (
      <View style={styles.container}>
         <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>Speed: {this.state.ForwardValue}</Text>
          <Text>Direction: {this.state.Direction}</Text>
        </View>
        <View style={styles.Three_in_row}>
          <TouchableOpacity style={styles.Button} onPressIn={() => {speed = 5; direction = -50; this.setState({ForwardValue: speed, Direction: direction}); this.publish()}} onPressOut={() => {speed = 0; direction = 0; this.setState({ForwardValue: speed, Direction: direction}); this.publish()}}></TouchableOpacity>
          <TouchableOpacity style={styles.Button} onPressIn={() => {speed = 5; direction = 0; this.setState({ForwardValue: speed, Direction: direction}); this.publish()}} onPressOut={() => {speed = 0; direction = 0; this.setState({ForwardValue: speed, Direction: direction}); this.publish()}}></TouchableOpacity>
          <TouchableOpacity style={styles.Button} onPressIn={() => {speed = 5; direction = 50; this.setState({ForwardValue: speed, Direction: direction}); this.publish()}} onPressOut={() => {speed = 0; direction = 0; this.setState({ForwardValue: speed, Direction: direction}); this.publish()}}></TouchableOpacity>
        </View>
        <View style={styles.Three_in_row}>
          <TouchableOpacity style={styles.Button} onPressIn={() => {speed = 0; direction = -50; this.setState({ForwardValue: speed, Direction: direction}); this.publish()}} onPressOut={() => {speed = 0; direction = 0; this.setState({ForwardValue: speed, Direction: direction}); this.publish()}}></TouchableOpacity>
          <TouchableOpacity style={{height: 40, width: 40, margin:10}} onPressIn={() => {speed = 0; direction = 0; this.setState({ForwardValue: speed, Direction: direction}); this.publish()}} onPressOut={() => {speed = 0; direction = 0; this.setState({ForwardValue: speed, Direction: direction}); this.publish()}}></TouchableOpacity>
          <TouchableOpacity style={styles.Button} onPressIn={() => {speed = 0; direction = 50; this.setState({ForwardValue: speed, Direction: direction}); this.publish()}} onPressOut={() => {speed = 0; direction = 0; this.setState({ForwardValue: speed, Direction: direction}); this.publish()}}></TouchableOpacity>
        </View>
        <View style={styles.Three_in_row}>
          <TouchableOpacity style={styles.Button} onPressIn={() => {speed = -5; direction = -50; this.setState({ForwardValue: speed, Direction: direction}); this.publish()}} onPressOut={() => {speed = 0; direction = 0; this.setState({ForwardValue: speed, Direction: direction}); this.publish()}}></TouchableOpacity>
          <TouchableOpacity style={styles.Button} onPressIn={() => {speed = -5; direction = 0; this.setState({ForwardValue: speed, Direction: direction}); this.publish()}} onPressOut={() => {speed = 0; direction = 0; this.setState({ForwardValue: speed, Direction: direction}); this.publish()}}></TouchableOpacity>
          <TouchableOpacity style={styles.Button} onPressIn={() => {speed = -5; direction = 50; this.setState({ForwardValue: speed, Direction: direction}); this.publish()}} onPressOut={() => {speed = 0; direction = 0; this.setState({ForwardValue: speed, Direction: direction}); this.publish()}}></TouchableOpacity>
        </View>
      </View>

    )
  }
}


export default ButtonControl;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    margin: 70
  },
  Button: {
    height: 40,
    width: 40,
    margin: 10,
    backgroundColor: '#000000',
    borderRadius: 10
  },
  Three_in_row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
  }
})