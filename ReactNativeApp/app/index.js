import React, { Component} from 'react';
import {View, Text, StyleSheet, Platform, AppRegistry, Navigator, TouchableHighlight } from 'react-native';
import Tabs from 'react-native-tabs';
import Button from './components/Button/button';
import HomeView from './routes/Home/index';

export default class WateringProject extends Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 'first'
    };
  }
  render() {
    const routes = [
      {title: 'Home', index: 0},
    ];

    return (

        <Navigator
          initialRoute={routes[0]}
          initialRouteStack={routes}
          renderScene={(route, navigator) =>
            <HomeView/>
          }
s      />
    );
  }
}
