import React, { Component, PropTypes } from 'react';
import { TouchableHighlight } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { withNavigation } from '@exponent/ex-navigation';
import { Router } from '../../index';
import { styles } from '../../config';

@withNavigation
export default class AddButton extends Component {

  render() {
    return(
      <TouchableHighlight
        onPress={() => this.props.navigator.push(Router.getRoute(this.props.route, this.props.routeParams))}
        style={styles.navBarButton}>
        <Icon name="plus-square-o" size={18} style={styles.icon} />
      </TouchableHighlight>
    );
  }
}

AddButton.propTypes = {
  route: PropTypes.string,
  navigator: PropTypes.object
};
