import React, { Component} from 'react';
import { AddControllerView, HomeView, PlantEditView, PlantView, WaterPlantView, TabNavigationLayout } from './routes';
import { colors } from './config/styles';
import { BackButton } from './components';
import { Microcontroller } from './database/db';

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
  provideController: () => AddControllerView,
  tabNavigationLayout: () => TabNavigationLayout,
}));

export function _handleTransition(routeWhereIsTransitionedTo) {
  routeWhereIsTransitionedTo.scene.route.getEventEmitter().emit('onFocus', '');
}

export const defaultRouteConfig = {
  navigationBar: {
    backgroundColor: colors.navbar,
    renderLeft: <BackButton/>,
    tintColor: colors.navText,
  }
};

export default class WateringProject extends Component {

  constructor(props) {
    super(props);
    this.state = {
      controllerID: this._getControllerID()
    };
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
            initialRoute={Router.getRoute('tabNavigationLayout', {controllerID: this.state.controllerID})}
            onTransitionStart={_handleTransition.bind(this)}
            defaultRouteConfig={defaultRouteConfig}
            />
      </NavigationProvider>

    );
  }

  _getControllerID() {
    const db = new Microcontroller();
    const controllers = db.get();
    if (controllers.length > 0) {
      return controllers[0].id;
    }
    return;
  }
}

WateringProject.propTypes = {
  navigator: React.PropTypes.object,
};
