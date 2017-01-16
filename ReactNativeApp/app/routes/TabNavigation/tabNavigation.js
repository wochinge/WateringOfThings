import React, { Component } from 'react';
import {
  TabNavigation,
  TabNavigationItem as TabItem,
  StackNavigation,
} from '@exponent/ex-navigation';
import { Router, defaultRouteConfig , _handleTransition } from '../../router';
import { I18n } from '../../config';
import { connect } from 'react-redux';


class TabNavigationLayout extends Component {

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
          title={I18n.t('homeTab')}
          onPress={(tabItemOnPress, event) => {
            this.props.navigation.performAction(({tabs, stacks}) => {
              tabs('main').jumpToTab('home');
              stacks('home').popToTop();
            });
            tabItemOnPress(event);
          }}
          >
          <StackNavigation
            id="home"
            navigatorUID="home"
            initialRoute={Router.getRoute('home')}
            defaultRouteConfig={defaultRouteConfig}
            onTransitionStart={_handleTransition.bind(this)}
            />
        </TabItem>
        <TabItem
          id="plantEdit"
          title={I18n.t('addTab')}>
          <StackNavigation
            id="plantEdit"
            initialRoute={Router.getRoute('plantEdit')}
            defaultRouteConfig={defaultRouteConfig}
            onTransitionStart={_handleTransition.bind(this)}
          />
        </TabItem>
        <TabItem
          id="provideController"
          title={I18n.t('settingsTab')}>
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
  client: React.PropTypes.object.isRequired
};

const mapStateToProps = (state) => (
  {
    client: state.controller.client
  }
);

export default connect(mapStateToProps)(TabNavigationLayout);
