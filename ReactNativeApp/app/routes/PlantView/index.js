import React, { Component, PropTypes } from 'react';
import { View, Text, TouchableHighlight, StyleSheet } from 'react-native';

export default class PlantView extends Component {
  render() {
    return (
      <View style={styles.view}>
        <Text>{ this.props.title}</Text>
        <TouchableHighlight onPress={() =>
          this.props.navigator.pop()
        }>
          <Text>Tap me to go back</Text>

        </TouchableHighlight>
      </View>
    );
  }

}
PlantView.propTypes = {
  title: PropTypes.string.isRequired,
  navigator: React.PropTypes.object,
};

const styles = StyleSheet.create({
  view: {
    padding: 30,
  },
});
