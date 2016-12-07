import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, Slider } from 'react-native';
import {colors, images, fonts, commonStyles} from '../../config';
import Button from 'apsl-react-native-button';



export default class WaterPlantView extends Component {

  static route = {
    navigationBar: {
      renderTitle: () => { return (
        <Text style= {styles.headline}>
          water your plant
        </Text>
      );},
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      amount: 0,
    };
    this.onPressWatering = this.onPressWatering.bind(this);
  }

  render() {
    return (
      <View style={styles.container}>
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
              minimumValue={0.0}
              maximumValue={100.0}
              value={50}/>

          <Button style={commonStyles.defaultButton} textStyle={commonStyles.defaultButtonText}
            onPress={() => this.onPressWatering(this.state.amount)}>
            water
          </Button>
        </View>
      </View>
    );
  }

  onPressWatering(amount) {
    this.props.controller.waterPlant(this.props.plant.id, amount);
    //client.waterPlant(this.props.plant.id, 10);
  }

  moistureValue(){
    if(this.props.plant.latestMoistureValue){
      if(this.props.plant.latestMoistureValue< this.props.plant.moistureThreshold){
        return (<Text style={styles.moistureText}> Plant is a little bit dry </Text>);
      }else{
        return (<Text style={styles.moistureText}> Plant lives in perfect conditions </Text>);
      }
    }else{
      return (<Text style={styles.moistureText}> No values available </Text>);
    }
  }

}

WaterPlantView.propTypes = {
  plant: React.PropTypes.object,
  controller: React.PropTypes.object,
  navigator: React.PropTypes.object,
};


const styles = StyleSheet.create({
  headline:{
    fontSize: 25,
    fontFamily: fonts.defaultFamily,
    color: colors.navText,
    alignSelf: 'center',
  },
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
