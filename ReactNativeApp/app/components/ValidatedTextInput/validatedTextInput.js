
import React, { Component, PropTypes } from 'react';

import Icon from 'react-native-vector-icons/FontAwesome';
import { View, TextInput , StyleSheet } from 'react-native';
import { commonStyles } from '../../config';

export default class ValidatedTextInput extends Component {

  render() {
    return(
      <View style={[styles.wrapper, this.props.style]}>
        <TextInput style={styles.input} placeholder={this.props.placeholder} onChangeText={this.props.onChange}/>
        <Icon
         name={this.props.valid ? 'check' : 'exclamation-triangle'}
         style={this.props.valid ? commonStyles.validIcon : commonStyles.invalidIcon} size={18}/>
      </View>
    );
  }
}

ValidatedTextInput.propTypes = {
  style: PropTypes.element,
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  valid: PropTypes.bool.isRequired
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    padding: 10,
    alignItems: 'center'
  },
  input: {
    flex: 10
  }
});
