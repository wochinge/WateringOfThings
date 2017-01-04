import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, Slider, ScrollView } from 'react-native';
import {colors, images, fonts, commonStyles, I18n} from '../../config';
import Button from 'apsl-react-native-button';
import { WoTClient } from '../../network';
import { Plant } from '../../models';

export default class WaterPlantView extends Component {

  static route = {
    navigationBar: {
      title: I18n.t('water')
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      amount: 50,
      controller: new WoTClient(this.props.controllerID)
    };
    this.onPressWatering = this.onPressWatering.bind(this);
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.innerContainer}>
            {this.moistureValue()}
              <View
                style={styles.sliderImages}>
                <Image
                  source={images.cactus}
                  style={styles.sliderIcon}/>
                <Image
                  style={styles.sliderIcon}
                  source={images.lotus}/>
              </View>
              <Slider style={styles.slider}
                onSlidingComplete={(amount) => this.setState({amount})}
                minimumValue={1.0}
                maximumValue={200.0}
                value={100}/>

            <Button style={commonStyles.defaultButton} textStyle={commonStyles.defaultButtonText}
              onPress={() => this.onPressWatering(this.state.amount)}>
              {I18n.t('water')}
            </Button>
          </View>
        </ScrollView>
      </View>
    );
  }

  onPressWatering(amount) {
    this.state.controller.waterPlant(this.props.plant.id, amount);
  }

  moistureValue() {
    const plant = new Plant(this.props.plant);
    return <Text style={styles.moistureText}>{plant.healthStatusText()}</Text>;
  }

}

WaterPlantView.propTypes = {
  plant: React.PropTypes.object,
  controllerID: React.PropTypes.string,
  navigator: React.PropTypes.object,
};


const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    borderRadius: 10,
    margin: 60,
    flex:1,
  },
  moistureText:{
    color: colors.defaultText,
    fontFamily: fonts.defaultFamily,
    fontSize: 18,
    textAlign: 'left',
    padding: 20,
  },
  sliderImages: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  sliderIcon: {
    width: 50,
    height: 50
  },
  slider: {
    width: 250,
  },
});
