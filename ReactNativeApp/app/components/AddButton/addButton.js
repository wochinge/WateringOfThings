import React, { Component, PropTypes } from 'react';
import { TouchableHighlight, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { withNavigation } from '@exponent/ex-navigation';
import { Router } from '../../index';
import { colors } from '../../config';

@withNavigation
export default class AddButton extends Component {

  render() {
    return(
      <TouchableHighlight
        onPress={() => this.props.navigator.push(Router.getRoute(this.props.route))}>
        <Icon name="plus-square-o" size={20} style={styles.iconStyle} />
      </TouchableHighlight>
    );
  }
}

AddButton.propTypes = {
  route: PropTypes.string,
  navigator: PropTypes.object
};

const styles = StyleSheet.create({
  iconStyle: {
    color: colors.navText,
    padding: 10
  }
});
