import React, { Component } from 'react';
import {
  TabNavigation,
  TabNavigationItem as TabItem,
  StackNavigation,
} from '@exponent/ex-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Router, defaultRouteConfig , _handleTransition } from '../../index';
import { colors } from '../../config';


export default class TabNavigationLayout extends Component {

  static route = {
    navigationBar: {
      visible: false,
    }
  }

  render() {
    return (
      <TabNavigation
          id="main"
          navigatorUID="main"
          initialTab="home"
          >
        <TabItem
          id="home"
          title="Home">
          <StackNavigation
            id="home"
            navigatorUID="home"
            initialRoute={this.props.controllerID ? Router.getRoute('home', {controllerID: this.props.controllerID}) :        Router.getRoute('provideController')}
            defaultRouteConfig={defaultRouteConfig}
            onTransitionStart={_handleTransition.bind(this)}
            />
        </TabItem>
        <TabItem
          id="plantEdit"
          title="Add">
          <StackNavigation
            id="plantEdit"
            initialRoute={Router.getRoute('plantEdit', {controllerID: this.props.controllerID})}
            defaultRouteConfig={defaultRouteConfig}
            onTransitionStart={_handleTransition.bind(this)}
          />
        </TabItem>
        <TabItem
          id="provideController"
          title="Settings">
          <StackNavigation
            id="provideController"
            initialRoute={Router.getRoute('provideController')}
            defaultRouteConfig={defaultRouteConfig}
            onTransitionStart={_handleTransition.bind(this)}
          />
        </TabItem>
      </TabNavigation>
    );
  }
}

TabNavigationLayout.propTypes = {
  navigator: React.PropTypes.object,
  route: React.PropTypes.object,
  controllerID: React.PropTypes.string
};
