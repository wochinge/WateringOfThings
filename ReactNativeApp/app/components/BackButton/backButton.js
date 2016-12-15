import { withNavigation } from '@exponent/ex-navigation';
import React, { Component, PropTypes } from 'react';
import { TouchableHighlight } from 'react-native';
import { commonStyles } from '../../config';
import Icon from 'react-native-vector-icons/FontAwesome';

@withNavigation
export default class BackButton extends Component {

  render() {
    return (
      <TouchableHighlight
        underlayColor='transparent'
        onPress={() => this.props.navigator.pop()}
        style={commonStyles.navBarButton}>
        <Icon name="chevron-left" size={18} style={commonStyles.icon} />
      </TouchableHighlight>
    );}
}

BackButton.propTypes = {
  navigator: PropTypes.object
};
