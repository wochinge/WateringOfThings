import React, { Component} from 'react';
import { Navigator, Text, StyleSheet, TouchableHighlight } from 'react-native';
import HomeView from './routes/Home/index';
import PlantView from './routes/PlantView/index';
import {colors, fonts} from './config';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class WateringProject extends Component {
  constructor(props) {
    super(props);
    this.navigatorRenderScene = this.navigatorRenderScene.bind(this);
  }
  render() {
    const routes = [
      {title: 'Home', index: 0},
      {plant: 'Plant', index: 1},
    ];

    // var plants=[
    //   {title:'Sonnenblume', id:0},
    //   {title:'Basilikum', id:1},
    //   {title:'Gummibaum', id:2},
    // ]

    return (

        <Navigator
          navigationBar={
            <Navigator.NavigationBar
               routeMapper={{
                 LeftButton: (route, navigator, index, navState) =>
                 {
                   if (route.index === 0) {
                     return null;
                   } else {
                     return (
                       <TouchableHighlight underlayColor='transparent' onPress={() => navigator.pop()}>
                         <Text style={styles.navText} >Back</Text>
                       </TouchableHighlight>
                     );
                   }
                 },
                 RightButton: (route, navigator, index, navState) =>
                 {
                   if (route.index === 0) {
                     return (
                       <TouchableHighlight underlayColor='transparent' onPress={() => navigator.pop()}>
                         <Text style={styles.navText} >Add</Text>
                       </TouchableHighlight>
                     );
                   } else {
                     return (
                       <TouchableHighlight underlayColor='transparent' onPress={() => navigator.pop()}>
                         <Text style={styles.navText} >Edit</Text>
                       </TouchableHighlight>
                     );
                   }
                 },
                 Title: (route, navigator, index, navState) =>
                 {
                   if (route.index === 0) {
                     return (
                       <Text style= {styles.headline}>
                         <Icon name="tint" style={styles.icon} size={35} />
                         Watering my Things
                       </Text>
                     );
                   } else {
                     return (
                       <TouchableHighlight underlayColor='transparent' onPress={() => navigator.pop()}>
                         <Text style={styles.navText} >{route.plant.name}</Text>
                       </TouchableHighlight>
                     );
                   }
                 },
               }}
              style={styles.navBar}
            />
          }
          initialRoute={routes[0]}
          initialRouteStack={routes}
          renderScene={this.navigatorRenderScene}
      />
    );
  }

  navigatorRenderScene(route, navigator) {
    switch (route.index) {
    case 0:
      return (<HomeView   navigator={navigator}/>);
    case 1:
      return (<PlantView plant={route.plant} navigator={navigator}
        />);
    }
  }
}

WateringProject.propTypes = {
  navigator: React.PropTypes.object,
};

const styles = StyleSheet.create({
  navBar: {
    backgroundColor: colors.navbar,
  },
  navText:{
    color: colors.navText,
    alignSelf: 'center',
  },
  headline:{
    fontSize: 25,
    fontFamily: fonts.defaultFamily,
    color: colors.navText,
    alignSelf: 'center',
  },
  icon: {
    paddingTop:30,
    paddingRight:20,
    marginRight:10,
    color: colors.navText,
  }
});
