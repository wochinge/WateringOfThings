import React, { Component} from 'react';
import RoutedView from './router';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import * as reducers from './redux/reducers';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const reducer = combineReducers(reducers);
const store = createStoreWithMiddleware(reducer);

export default class WateringProject extends Component {
  render() {
    return (
      <Provider store={store}>
        <RoutedView />
      </Provider>
    );
  }
}
