import React, { Component} from 'react';
import { AddControllerView, HomeView, PlantEditView, PositionAssistant, PlantView, WaterPlantView, TabNavigationLayout } from './routes';
import { colors } from './config/styles';
import { BackButton } from './components';
import { connect } from 'react-redux';

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
  positionAssistant: () => PositionAssistant
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

class RoutedView extends Component {
  render() {
    return (
      <NavigationProvider router={Router}>
        <StackNavigation
            initialRoute={this.props.controllerID
              ? Router.getRoute('tabNavigationLayout')
              : Router.getRoute('provideController', {firstAppStart: true})}
            onTransitionStart={_handleTransition.bind(this)}
            defaultRouteConfig={defaultRouteConfig}
            />
      </NavigationProvider>
    );
  }
}

RoutedView.propTypes = {
  navigator: React.PropTypes.object,
  controllerID: React.PropTypes.string
};

const mapStateToProps = (state) => {
  return {
    controllerID: state.controller.controllerID
  };
};

export default connect(mapStateToProps)(RoutedView);
