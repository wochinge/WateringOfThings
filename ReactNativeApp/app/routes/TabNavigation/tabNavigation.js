import React, { Component } from 'react';
import {
  TabNavigation,
  TabNavigationItem as TabItem,
  StackNavigation,
} from '@exponent/ex-navigation';
import { Router, defaultRouteConfig , _handleTransition } from '../../index';


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
          title="Home"
          onPress={() => {
            this.props.navigation.performAction(({tabs, stacks}) => {
              tabs('main').jumpToTab('home');
              stacks('home').popToTop();

            });
          }}
          >
          <StackNavigation
            id="home"
            navigatorUID="home"
            initialRoute={Router.getRoute('home', {controllerID: this.props.controllerID})}
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
  navigation: React.PropTypes.object,
  navigator: React.PropTypes.object,
  route: React.PropTypes.object,
  controllerID: React.PropTypes.string
};
