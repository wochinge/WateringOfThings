import React, { Component, PropTypes } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import {colors, images, fonts} from '../../config';
import { Button } from '../../components';
import { Plant } from '../../database';

export default class PlantView extends Component {

  static route = {
    navigationBar: {
      title(params) {
        return `${params.plant.name}`;
      }
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      imageURL: images.basil
    };
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
          {this.moistureValue()}
        <Button
          handlePress={() => this.onPressWater(this.props.plant)}
          text={'Water Plant'}
          style={[styles.row, styles.button]}
        />
        </View>
      </View>
    );
  }

  onPressWater(plant) {

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
   //plant: React.PropTypes.object,
  // plant: PropTypes.string.isRequired,

  navigator: React.PropTypes.object,
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 80,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    borderRadius: 10,
    alignItems: 'center',
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
  button: {
    borderRadius: 5,
    flex: 1,
    minHeight: 100,
    minWidth:100,
    justifyContent: 'center',
    overflow: 'hidden',
    padding:20,
  },
  row: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 10,
    minHeight: 40,
  },
  moistureText:{
    color: colors.defaultText,
    fontFamily: fonts.defaultFamily,
    fontSize: 18,
    padding: 30,
  }
});
