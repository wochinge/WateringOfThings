import React, { Component, PropTypes } from 'react';
import { Text, StyleSheet } from 'react-native';
import { I18n, colors, fonts } from '../../config';
import autobind from 'autobind-decorator';

@autobind
export default class PlantStatus extends Component {

  render() {
    return (
      <Text style={[styles.moistureText, this.props.styles]}>{this.statusText()}</Text>
    )
  ;}

  statusText() {
    const latest = this.props.plant.latestMoistureValue;
    if (latest) {
      if (latest < this.props.plant.moistureThreshold) {
        return I18n.t('tooDry');
      } else {
        return I18n.t('enoughWater');
      }
    } else {
      return I18n.t('noValues');
    }
  }
}
PlantStatus.propTypes = {
  plant: PropTypes.object.isRequired,
  styles: PropTypes.element,
};

const styles = StyleSheet.create({
  moistureText:{
    color: colors.defaultText,
    fontFamily: fonts.defaultFamily,
    fontSize: 18,
    textAlign: 'center',
  },
});
