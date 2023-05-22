import TiltControl from "./pages/TiltControl.js";
import ButtonControl from "./pages/ButtonControl.js";
import Home from "./pages/Home.js";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react"
import LogScreen from "./pages/LogScreen.js";
import { View, Text, Button } from "react-native";

import Global from "./Global.js";
import init from 'react_native_mqtt' 
import AsyncStorage from '@react-native-async-storage/async-storage' 

id = 0

init({
  size: 10000,
  storageBackend: AsyncStorage,
  defaultExpires: 1000 * 3600 * 24,
  enableCache: true,
  reconnect: true,
  sync: {}
})

function onConnect () { 
  console.log("Connected")
  client.subscribe("logs") 
}

function onConnectionLost (responseObject) { 
  if (responseObject.errorCode !== 0) { 
    console.log("Error_Message:" + responseObject.errorMessage) 
    client.connect({ onSuccess: onConnect, useSSL: false, userName: "TageDanielsson", password: "12345" }) 
  }
}

onMessageArrived = (message) =>  
  {
    console.log(message.payloadString)
    Global.logs = [...Global.logs, {key: message.payloadString + new Date().toLocaleTimeString() + id.toString(), value: message.payloadString + "\n" + new Date().toLocaleTimeString()}]
    id++
    console.log(Global.logs)
  }

//const client = new Paho.MQTT.Client('10.0.0.2', 8884, "myclientid_" + parseInt(Math.random() * 100, 10)) 
//för nätverket hemma
const client = new Paho.MQTT.Client('10.22.5.228', 8884, "myclientid_" + parseInt(Math.random() * 100, 10)) 

client.onConnectionLost = onConnectionLost 
client.connect({ onSuccess: onConnect, useSSL: false, userName: "TageDanielsson", password: "12345" }) 




export default function App() {
const Stack = createNativeStackNavigator();

  client.onMessageArrived = (message) => onMessageArrived(message) 

  return(
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Tilt" component={TiltControl} options={{title: "Tiltcontrol"}} />
        <Stack.Screen name="Home" component={Home} options={{title: "Driverbot"}} />
        <Stack.Screen name="Pad" component={ButtonControl} options={{title: "ButtonControl"}} />
        <Stack.Screen name="Logs" component={LogScreen} options={{title: "Logs"}} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

