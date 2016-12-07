import React, { Component} from 'react';
import HomeView from './routes/Home/index';
import PlantEditView from './routes/PlantEditView/plantEditView';
import PlantView from './routes/PlantView/index';
import WaterPlantView from './routes/PlantView/waterPlant';
import { colors } from './config/styles';
import { BackButton } from './components';

import {
  createRouter,
  NavigationProvider,
  StackNavigation,
} from '@exponent/ex-navigation';

export const Router = createRouter(() => ({
  home: () => HomeView,
  plant: () => PlantView,
  plantEdit: () => PlantEditView,
  waterPlant: () => WaterPlantView,
}));

export default class WateringProject extends Component {
  constructor(props) {
    super(props);
  }
  render() {

    // var plants=[
    //   {title:'Sonnenblume', id:0},
    //   {title:'Basilikum', id:1},
    //   {title:'Gummibaum', id:2},
    // ]

    return (
      <NavigationProvider router={Router}>
      <StackNavigation
        initialRoute={Router.getRoute('home')}
        onTransitionStart={this.handleTransition.bind(this)}
        defaultRouteConfig={{
          navigationBar: {
            backgroundColor: colors.navbar,
            renderLeft: () => <BackButton/>,
            tintColor: colors.navText,
          }
        }} />
      </NavigationProvider>
    );
  }

  handleTransition(routeWhereIsTransitionedTo) {
    routeWhereIsTransitionedTo.scene.route.getEventEmitter().emit('onFocus', '');
  }
}

WateringProject.propTypes = {
  navigator: React.PropTypes.object,
};
