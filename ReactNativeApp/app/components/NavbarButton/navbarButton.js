import React, { Component, PropTypes } from 'react';
import { TouchableHighlight } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { withNavigation } from '@exponent/ex-navigation';
import { Router } from '../../router';
import { commonStyles } from '../../config';

@withNavigation
export default class NavbarButton extends Component {

  constructor(props) {
    super(props);
    this._onPress = this._onPress.bind(this);
  }

  render() {
    return(
      <TouchableHighlight
        underlayColor='transparent'
        onPress={this._onPress}
        style={commonStyles.navBarButton}>
        <Icon name={this.props.iconName} size={18} style={commonStyles.icon} />
      </TouchableHighlight>
    );
  }

  _onPress() {
    if (this.props.onPress) {
      this.props.onPress();
    } else if (this.props.route) {
      this.props.navigator.push(Router.getRoute(this.props.route, this.props.routeParams));
    }
  }
}

NavbarButton.propTypes = {
  route: PropTypes.string,
  navigator: PropTypes.object,
  routeParams: PropTypes.object,
  iconName: PropTypes.string,
  onPress: PropTypes.func
};
