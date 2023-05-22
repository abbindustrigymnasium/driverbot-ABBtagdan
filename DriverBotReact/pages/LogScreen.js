import React, { Component }from 'react';

import { FlatList, View, Text, StyleSheet } from'react-native';

import Global from '../Global.js';

class LogScreen extends Component {
    render(){
        return(
            <View style={styles.Page}>
                <FlatList data = {Global.logs.reverse()} renderItem = {({item}) => <Text style={styles.LogText}>{item.value}</Text>} /> 
            </View>

        )
    }
}

export default LogScreen;

const styles = StyleSheet.create({
    Page: {
        padding: 10,
        backgroundColor: '#000000',
        height: '100%',
    },
    LogText: {
        color: '#00cc22',
        fontSize: 20,
        margin:10,
    }
})