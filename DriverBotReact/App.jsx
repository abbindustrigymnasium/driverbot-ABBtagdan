import React, { Component } from 'react' 
import { StyleSheet, Text, Button, View } from 'react-native' 

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

const client = new Paho.MQTT.Client('10.22.5.228', 8884, "myclientid_" + parseInt(Math.random() * 100, 10)) 

client.onConnectionLost = onConnectionLost 
client.connect({ onSuccess: onConnect, useSSL: false, userName: "TageDanielsson", password: "12345" }) 

class App extends Component { 
  constructor(props) { 
    super(props) 
    this.state = { 
      data: "Temp", 
      ForwardValue: 0,
      Direction: 0, 
    }
  }
  componentDidMount () { 
    client.onMessageArrived = (message) => this.onMessageArrived(message) 
  }

  onMessageArrived = (message) =>  
  {
    let x = "\nTopic : " + message.topic + "\nMessage : " + message.payloadString
    console.log(x) 
    this.setState({ data: x }) 
  }

  click = (dir, val) => 
  {
    if(dir == "l" || dir == "r"){
      direction += val
      this.setState({ Direction: direction })
      client.publish("dir",direction.toString());
    }
    else{
      speed += val
      this.setState({ ForwardValue: speed })
      client.publish("f",speed.toString());
    }

  }
  render () {
    return (
      <View style={styles.container}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>Speed: {this.state.ForwardValue}</Text>
          <Text>Direction: {this.state.Direction}</Text>
        </View>
        <View style={{flex: 1, justifyContent: 'flex-end', alignItems: 'center'}}>
          <View style={styles.Button}>
            <Button onPress={() => this.click("u", 1)} title="^" />
          </View>
        
        </View>
        <View style={styles.Bottom_Three}>
          <View style={styles.Button}>
            <Button onPress={() => this.click("l", -10)} title="<" />
          </View>
          <View style={styles.Button}>
            <Button onPress={() => this.click("d", -1)} title="v" />
          </View>
          <View style={styles.Button}>
            <Button onPress={() => this.click("r", 10)} title=">" />
          </View>
          
        </View>
      </View>

    )
  }
}


export default App 


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#666666',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%'
  },
  Button: {
    height: 40,
    width: 40,
    backgroundColor: '#ffffff',
  },
  Bottom_Three: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
  }
})