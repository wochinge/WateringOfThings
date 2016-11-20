import React, { Component} from 'react';
import {TouchableOpacity, Text, StyleSheet } from 'react-native';
import reactMixin from 'react-mixin';
import ButtonCommon from './button.common';

class Button extends Component {
  render() {
    const buttonStyle = [styles.button];
    if (this.state.pressed) buttonStyle.push(styles.buttonPress);

    return (
      <TouchableOpacity onPress={this.handlePress.bind(this)} style={buttonStyle}>
        <Text style={styles.text}>{this.props.text}</Text>
      </TouchableOpacity>
    )
  }
}

reactMixin.onClass(Button, ButtonCommon);
export default Button;

const styles = StyleSheet.create({
  button: {
    borderRadius: 20,
    backgroundColor: '#F44336',
  },
  buttonPress: {
    backgroundColor: '#C7C7C7'
  },
  text: {
    color: '#fff'
  }
});
