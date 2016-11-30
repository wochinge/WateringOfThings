import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, Slider, Modal } from 'react-native';
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

            <Text
              style={styles.label}>
              Moisture threshold
            </Text>
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
              onSlidingComplete={(moistureThreshold) => this.setState({moistureThreshold})}
              minimumValue={0.0}
              maximumValue={100.0}
              value={50}/>

        <Button
          handlePress={() => this.onPressWater(this.props.plant)}
          text={'Water Plant'}
          style={[styles.row, styles.button]}
        />
        </View>
      </View>
    );
  }

  onPressWater() {
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

  renderWateringModal() {
    return(
      <Modal
        animationType={'fade'}
        transparent={true}
        visible={this.state.modalVisible}
        onRequestClose={() => console.log('Modal closed')}>
        <View
          style={styles.container}>
          <View
            style={styles.innerContainer}>
            <Text
              style={[styles.rowTitle, styles.row]}>
              Number of your microcontroller
            </Text>
            <Text
              style={[styles.row, styles.description]}>
              {this.state.inputMessage}
            </Text>
            <TextInput
              editable = {true}
              maxLength = {40}
              placeholder = 'Microcontroller id'
              onChangeText={(text) => this.setState({microcontrollerInput: text})}
              style={styles.row}>
            </TextInput>
            <Button
              handlePress={() => this.validateControllerID(this.state.microcontrollerInput)}
              text={'Ok'}
              style={[styles.row, styles.button]}
            />
          </View>
        </View>

      </Modal>
    );
  }


}

PlantView.propTypes = {
  plant: React.PropTypes.object,
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
    width: 200,
    margin: 20,
  }
});
