import React, { Component, PropTypes } from 'react';
import { TouchableHighlight } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { withNavigation } from '@exponent/ex-navigation';
import { Router } from '../../index';
import { commonStyles } from '../../config';

@withNavigation
export default class EditButton extends Component {

  render() {
    return(
      <TouchableHighlight
        onPress={() => this.props.navigator.push(Router.getRoute(this.props.route, this.props.routeParams))}
        style={commonStyles.navBarButton}>
        <Icon name="pencil" size={18} style={commonStyles.icon} />
      </TouchableHighlight>
    );
  }
}

EditButton.propTypes = {
  route: PropTypes.string,
  navigator: PropTypes.object,
  routeParams: PropTypes.object,
};
