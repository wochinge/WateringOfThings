import React, { Component} from 'react';
import HomeView from './routes/Home/index';
import PlantEditView from './routes/PlantEditView/plantEditView';
import PlantView from './routes/PlantView/index';
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
  plantEdit: () => PlantEditView
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
        defaultRouteConfig={{
          navigationBar: {
            backgroundColor: colors.navbar,
            tintColor: '#fff',
            renderLeft: () => <BackButton/>
          }
        }} />
      </NavigationProvider>
    );
  }
}

WateringProject.propTypes = {
  navigator: React.PropTypes.object,
};
