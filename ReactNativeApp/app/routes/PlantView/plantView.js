import React, { Component, PropTypes } from 'react';
import { View, Text, TouchableHighlight , StyleSheet } from 'react-native';

export default class PlantView extends Component {
  setNativeProps (nativeProps) {
  this._root.setNativeProps(nativeProps);
}
  render() {
    return (
      <View>
        <Text>Current Scene: { this.props.title }</Text>
        <TouchableHighlight onPress={this.props.onForward}>
          <Text>Tap me to load the next scene</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={this.props.onBack}>
          <Text>Tap me to go back</Text>
        </TouchableHighlight>
      </View>
    )
  }
}

PlantView.propTypes = {
  title: PropTypes.string.isRequired,
  onForward: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
};
