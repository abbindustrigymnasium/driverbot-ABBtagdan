import React from 'react';
import {View, Button} from 'react-native';


export default function Home( {navigation} ) {
    return (
        <View>
            <Button onPress={() => navigation.navigate("Tilt")} title="TiltControl" />
            <Button onPress={() => navigation.navigate("Pad")} title="ButtonControl" />
            <Button onPress={() => navigation.navigate("Logs")} title="Logs" />
        </View>
        )
}