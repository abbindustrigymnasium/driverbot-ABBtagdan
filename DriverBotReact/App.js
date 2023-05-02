import React, {Component} from 'react';
import Cookie from '.components/Cookie.js'
import {Text, View} from 'react-native';

class HelloWorldApp extends Component {
  render() {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Cookie />
      </View>
    );
  }
}

export default HelloWorldApp;