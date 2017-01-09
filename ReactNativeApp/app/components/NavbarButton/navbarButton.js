import React, { Component, PropTypes } from 'react';
import { TouchableHighlight } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { withNavigation } from '@exponent/ex-navigation';
import { Router } from '../../router';
import { commonStyles } from '../../config';

@withNavigation
export default class NavbarButton extends Component {

  render() {
    return(
      <TouchableHighlight
        underlayColor='transparent'
        onPress={() => this.props.navigator.push(Router.getRoute(this.props.route, this.props.routeParams))}
        style={commonStyles.navBarButton}>
        <Icon name={this.props.iconName} size={18} style={commonStyles.icon} />
      </TouchableHighlight>
    );
  }
}

NavbarButton.propTypes = {
  route: PropTypes.string,
  navigator: PropTypes.object,
  routeParams: PropTypes.object,
  iconName: PropTypes.string
};
