import React, { Component, PropTypes } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { colors } from '../../config';
import { StyleSheet } from 'react-native';

export default class TabIcon extends Component {

  render() {
    return (
      <Icon
        name={this.props.iconName}
        size={30}
        style={this.props.isSelected ? styles.selected : styles.notSelected} />
    )
  ;}
}

TabIcon.propTypes = {
  iconName: PropTypes.string.isRequired,
  isSelected: PropTypes.bool.isRequired
};

const styles = StyleSheet.create({
  selected: {
    color: colors.selected
  },
  notSelected: {
    color: colors.shadow
  }
});
