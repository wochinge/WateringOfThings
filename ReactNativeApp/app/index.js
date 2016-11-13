import React, { Component} from 'react';
import {View, Text, StyleSheet, Platform, AppRegistry, Navigator } from 'react-native';
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
      {title: 'Plant', index: 1},
    ];

    return (

        <Navigator
          initialRoute={routes[0]}
          initialRouteStack={routes}
          renderScene={(route, navigator) =>
            <HomeView navigator={navigator}/>
          }
      />
    );
  }
}
