import React from 'react';
import {Text, View, Button} from 'react-native';

const Cookie = () => {
    let score = 0;
    return (
        <View>
            <Text>{score}</Text>
            <Button
            onPress={score += 1}
            title = "Click me"
            />

        </View>
    )
}

export default Cookie;