import React, { Component, PropTypes } from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { commonStyles } from '../../config';

export default class InputFormRow extends Component {

  constructor() {
    super();
    this.state = {
      firstInput: true
    };
  }

  setNativeProps(nativeProps) {
    this._textInput.setNativeProps({text: nativeProps.text});
  }

  render() {
    return (
      <View
        style={[inputStyles.row, this.props.viewStyle]}>
        <View style={inputStyles.inputComponents}>
          <Text style={inputStyles.label}>
            {this.props.label}
          </Text>
          <TextInput
            ref={component => this._textInput = component}
            keyboardType={this.props.keyboardType ? this.props.keyboardType : 'default'}
            placeholder={this.props.placeholder}
            defaultValue={this.props.defaultValue}
            autoCorrect={!this.props.disableAutoCorrect}
            onChangeText={(text) => {
              this.setState({firstInput: false});
              this.props.onChange(text);
            }}
            style={inputStyles.input}/>
        </View>
        { this.state.firstInput ? null
          : <Icon
              name={this.props.valid ? 'check' : 'exclamation-triangle'}
              style={this.props.valid ? commonStyles.validIcon : commonStyles.invalidIcon} size={18}/>
        }

      </View>
    );
  }
}

InputFormRow.propTypes = {
  keyboardType: PropTypes.string,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  defaultValue: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  viewStyle: PropTypes.element,
  valid: PropTypes.bool,
  disableAutoCorrect: PropTypes.bool
};

const inputStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginBottom: 20,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  inputComponents: {
    flex: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  label: {
    flex: 1,
  },
  input: {
    flex: 2,
    minHeight: 20,
  }
});
