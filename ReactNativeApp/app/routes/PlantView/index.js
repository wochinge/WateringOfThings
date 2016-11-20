import React, { Component, PropTypes } from 'react';
import { View, Text, TouchableHighlight, StyleSheet } from 'react-native';
import {colors} from '../../config';


export default class PlantView extends Component {
  render() {
    return (
      <View style={styles.view}>
        <Text>{ this.props.title}</Text>
        <TouchableHighlight underlayColor={colors.touchFeecback} onPress={() =>
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
