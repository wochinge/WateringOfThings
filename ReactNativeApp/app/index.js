import React, { Component} from 'react';
import {Navigator } from 'react-native';
import HomeView from './routes/Home/index';
import PlantView from './routes/PlantView/index';


export default class WateringProject extends Component {
  constructor(props) {
    super(props);
    this.navigatorRenderScene = this.navigatorRenderScene.bind(this);
  }
  render() {
    const routes = [
      {title: 'Home', index: 0},
      {title: 'Plant', index: 1},
    ];

    // var plants=[
    //   {title:'Sonnenblume', id:0},
    //   {title:'Basilikum', id:1},
    //   {title:'Gummibaum', id:2},
    // ]

    return (

        <Navigator
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
      return (<PlantView title={route.title} navigator={navigator}
        />);
    }
  }
}

WateringProject.propTypes = {
  navigator: React.PropTypes.object,
};
