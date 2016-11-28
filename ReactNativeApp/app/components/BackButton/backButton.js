import { withNavigation } from '@exponent/ex-navigation';
import React, { Component } from 'react';
import { Text, TouchableHighlight , StyleSheet } from 'react-native';
import { colors } from '../../config';

@withNavigation
export default class BackButton extends Component {

  render() {
    return (
      <TouchableHighlight underlayColor='transparent' onPress={() => this.props.navigator.pop()}>
        <Text style={styles.navText}>
          Back
        </Text>
      </TouchableHighlight>
    );}
}

const styles = StyleSheet.create({
  navText:{
    color: colors.navText,
    alignSelf: 'center',
  },
});
