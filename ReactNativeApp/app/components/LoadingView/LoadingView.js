import React, { Component } from 'react';
import { View, Text } from 'react-native';

export default class LoadingView extends Component {

  render() {
    return (
      <View>
        <Text>
          Loading ...
        </Text>
      </View>
    );
  }
}

LoadingView.propTypes = {
  visible: React.PropTypes.bool,
};
