import React, { Component, PropTypes } from 'react';
import { View, Text, TouchableHighlight , StyleSheet } from 'react-native';

export default class PlantScene extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    onForward: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired,
  }
  render() {
    return (
      <View>
      <TouchableHighlight onPress={this.props.onBack}>
        <Text style={styles.back} >back</Text>
      </TouchableHighlight>
        <Text style={styles.heading} >Plant: { this.props.title }</Text>
        <TouchableHighlight onPress={this.props.onForward}>
          <Text>Sonnenblume</Text>
        </TouchableHighlight>

      </View>
    )
  }
}

const styles = StyleSheet.create({
  heading: {
    paddingTop: 50,
    color: 'black',
    fontWeight: 'bold',
    fontSize: 20,
  },
  back: {
    paddingTop: 30,
    color: 'black',
    fontSize: 12,
  },
});
