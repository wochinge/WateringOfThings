import React, { Component } from 'react';
import {
  TabNavigation,
  TabNavigationItem as TabItem,
  StackNavigation,
} from '@exponent/ex-navigation';
import { Router, defaultRouteConfig , _handleTransition } from '../../router';
import { connect } from 'react-redux';
import { TabIcon } from '../../components';

class TabNavigationLayout extends Component {

  static route = {
    navigationBar: {
      visible: false,
    }
  }

  render() {
    return (
      <TabNavigation
          id='main'
          navigatorUID='main'
          initialTab='home'
          >
        <TabItem
          id='home'
          renderIcon={(isSelected) => <TabIcon iconName='home' isSelected={isSelected}/>}
          onPress={(tabItemOnPress, event) => {
            this.props.navigation.performAction(({tabs, stacks}) => {
              tabs('main').jumpToTab('home');
              stacks('home').popToTop();
            });
            tabItemOnPress(event);
          }}
          >
          <StackNavigation
            id='home'
            navigatorUID='home'
            initialRoute={Router.getRoute('home')}
            defaultRouteConfig={defaultRouteConfig}
            onTransitionStart={_handleTransition.bind(this)}
            />
        </TabItem>
        <TabItem
          id='plantEdit'
          renderIcon={(isSelected) => <TabIcon iconName='plus' isSelected={isSelected}/>}>
          <StackNavigation
            id='plantEdit'
            initialRoute={Router.getRoute('plantEdit')}
            defaultRouteConfig={defaultRouteConfig}
            onTransitionStart={_handleTransition.bind(this)}
          />
        </TabItem>
        <TabItem
          id='provideController'
          renderIcon={(isSelected) => <TabIcon iconName='cog' isSelected={isSelected}/>}>
          <StackNavigation
            id='provideController'
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
  client: React.PropTypes.object.isRequired
};

const mapStateToProps = (state) => (
  {
    client: state.controller.client
  }
);

export default connect(mapStateToProps)(TabNavigationLayout);
