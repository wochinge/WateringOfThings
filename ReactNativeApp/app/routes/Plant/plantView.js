import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import {colors, images, fonts, commonStyles} from '../../config';
import { NavbarButton } from '../../components';
import Button from 'apsl-react-native-button';
import { Plant } from '../../database';
import { Router } from '../../index';

export default class PlantView extends Component {

  static route = {

    navigationBar: {
      title(params) {
        return `${params.plant.name}`;
      },
      renderRight: (params) => {
        return (<NavbarButton iconName='pencil' route='plantEdit' routeParams={{
          controllerID: params.params.controller.controllerID,
          plant: params.params.plant}}/>);
      }
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      imageURL: images.defaultPlantImage
    };
    this._setImage();
  }

  _setImage() {
    const plantDB = new Plant();
    const plantImageURL = plantDB.getPlantImagePath(this.props.plant.id);
    if (plantImageURL) {
      this.state = {
        imageURL: plantImageURL
      };
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.image} source={this.state.imageURL}/>
        <View style={styles.innerContainer}>
        <Text style={styles.statusText}>
          Health Status
        </Text>
          {this.moistureValue()}
          <Button style={commonStyles.defaultButton} textStyle={commonStyles.defaultButtonText}
            onPress={() => this.onPressWater(this.props.plant)}>
            water
          </Button>
        </View>
      </View>
    );
  }

  onPressWater(plant) {
    this.props.navigator.push(Router.getRoute('waterPlant', {plant: plant, controllerID: this.props.controllerID}));
    //client.waterPlant(this.props.plant.id, 10);
  }

  moistureValue(){
    if(this.props.plant.latestMoistureValue){
      if(this.props.plant.latestMoistureValue< this.props.plant.moistureThreshold){
        return (<Text style={styles.moistureText}> Plant is a little bit dry </Text>);
      }else{
        return (<Text style={styles.moistureText}> Perfect conditions </Text>);
      }
    }else{
      return (<Text style={styles.moistureText}> No values available </Text>);
    }
  }

}

PlantView.propTypes = {
  plant: React.PropTypes.object,
  controllerID: React.PropTypes.string,
  navigator: React.PropTypes.object,
  route: React.PropTypes.object,
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
    padding: 20,
    flex:1,
  },
  image:{
    width: 150,
    height: 150,
    borderRadius: 75,
    borderColor: colors.separator,
    borderWidth: 2,
    alignSelf: 'center',
  },
  moistureText:{
    color: colors.defaultText,
    fontFamily: fonts.defaultFamily,
    fontSize: 18,
    textAlign: 'left',
  },
  statusText:{
    fontSize: 24,
    fontWeight: 'bold',
    color : colors.defaultText,
    fontFamily: fonts.defaultFamily,
    textAlign: 'left',
  },
});
