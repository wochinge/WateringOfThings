import { withNavigation } from '@exponent/ex-navigation';
import React, { Component, PropTypes } from 'react';
import { TouchableHighlight , StyleSheet } from 'react-native';
import { colors } from '../../config';
import Icon from 'react-native-vector-icons/FontAwesome';

@withNavigation
export default class BackButton extends Component {

  render() {
    return (
      <TouchableHighlight underlayColor='transparent' onPress={() => this.props.navigator.pop()}>
        <Icon name="chevron-left" size={20} style={styles.icon} />
      </TouchableHighlight>
    );}
}

const styles = StyleSheet.create({
  icon: {
    color: colors.navText,
    justifyContent: 'center',
    padding: 10
  },
});

BackButton.propTypes = {
  navigator: PropTypes.object
};
