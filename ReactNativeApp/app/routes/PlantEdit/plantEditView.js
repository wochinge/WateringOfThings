
import React, { Component, PropTypes } from 'react';
import { StyleSheet, View, Text, Image, Slider, TouchableHighlight, ScrollView } from 'react-native';
import { images, colors, commonStyles } from '../../config';
import { InputFormRow } from '../../components';
import Button from 'apsl-react-native-button';
import ImagePicker from 'react-native-image-crop-picker';
import { WoTClient } from '../../network';
import { Plant as PlantDB } from '../../database';


export default class PlantEditView extends Component {

  static route = {
    navigationBar: {
      title(params) {
        return params.plant ? 'Edit plant' : 'Create plant';
      }
    }
  }

  constructor(props) {
    super(props);
    let plant = null;
    let plantEditMode = false;
    if (this.props.plant) {
      plant = this.props.plant;
      plantEditMode = true;
    }

    this.state = {
      name: plantEditMode ? plant.name : '',
      pin: plantEditMode? plant.pin : 0,
      position: plantEditMode ? plant.position : '',
      moistureThreshold: plantEditMode ? plant.moistureThreshold : 50,
      plantImage: this._getPlantImage(plantEditMode, plant),
      plantImageData: 0,
      plantEditMode: plantEditMode,
      validPin: plantEditMode ? true : false,
      validPosition: plantEditMode ? true : false
    };
    this._savePlant = this._savePlant.bind(this);
    this._selectPlantImage = this._selectPlantImage.bind(this);
    this._validateName = this._validateName.bind(this);
    this._validatePin = this._validatePin.bind(this);
    this._validatePosition = this._validatePosition.bind(this);
  }

  _getPlantImage(plantEditMode, plant) {
    let plantURL = null;
    if (plantEditMode) {
      const db = new PlantDB();
      plantURL = db.getPlantImagePath(plant.id);
    }

    if (!plantURL) {
      return images.defaultPlantImage;
    }
    return plantURL;
  }

  _selectPlantImage() {
    ImagePicker.openPicker({
      width: 150,
      height: 150,
      cropping: true
    })
    .then(image => this.setState({
      plantImage: {uri: image.path},
    }))
    .catch(e => console.log(e));
  }

  _savePlant() {
    const db = new PlantDB();
    const client = new WoTClient(this.props.controllerID);
    if (this.state.plantEditMode) {
      client.updatePlant(this.props.plant.id, this.state.name, this.state.pin, this.state.position, `${this.state.moistureThreshold}`)
      .then(() => db.save(this.props.plant.id, this.state.plantImage.uri))
      .catch((error) => {
        console.log('There has been a problem with the fetch operation: ' + error.message);
      });
      this.props.navigator.pop(2);
    } else {
      client.createPlant(this.state.name, this.state.pin, this.state.position, `${this.state.moistureThreshold}`)
      .then(created => db.save(created.id, this.state.plantImage.uri))
      .catch((error) => {
        console.log('There has been a problem with the fetch operation: ' + error.message);
      });
      this.props.navigation.performAction(({ tabs, stacks }) => {
        tabs('main').jumpToTab('home');
        stacks('home').popToTop();
      });
    }

  }
  _validateName(name) {
    const trimmed = name.trim();
    this.setState({
      name: trimmed,
    });
  }

  _validatePin(pin) {
    pin = parseInt(pin);
    let valid = !isNaN(pin);
    if (pin < 0 || pin > 8) {
      valid = false;
    }
    this.setState({
      pin: pin,
      validPin: valid
    });
  }

  _validatePosition(position) {
    position = parseInt(position);
    let valid = false;
    if (!isNaN(position)) {
      valid = true;
    }
    this.setState({
      position: position,
      validPosition: valid
    });
  }

  render() {
    return(
      <View
        style={styles.container}>
        <ScrollView>
          <TouchableHighlight
            onPress={this._selectPlantImage}
            underlayColor={colors.touchFeedback}
            style={styles.horizontalItem}>
            <Image
              source={this.state.plantImage}
              style={styles.plantImage}
            />
          </TouchableHighlight>
          <InputFormRow label='Name' defaultValue={this.state.plantEditMode ? this.props.plant.name : ''} placeholder='e.g. Basil' valid={this.state.name != ''} onChange={this._validateName}/>
          <InputFormRow label='Pin' defaultValue={this.state.plantEditMode ? `${this.props.plant.pin}` : ''}placeholder='e.g. 3' valid={this.state.validPin} onChange={this._validatePin}/>
          <InputFormRow label='Position' defaultValue={this.state.plantEditMode ? `${this.props.plant.position}` : ''} placeholder='e.g. 90' valid={this.state.validPosition} onChange={this._validatePosition}/>
          <View
            style={styles.item}>
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
            <Slider
              onSlidingComplete={(moistureThreshold) => this.setState({moistureThreshold: moistureThreshold})}
              minimumValue={0.0}
              maximumValue={100.0}
              value={this.state.plantEditMode ? this.props.plant.moistureThreshold : 50}/>
          </View>
          <View
            style={styles.horizontalItem}>
            <Button style={[commonStyles.defaultButton, styles.button]} textStyle={commonStyles.defaultButtonText}
              onPress={this._savePlant}
              isDisabled={!this.state.name || !this.state.validPin || !this.state.validPosition}>
              Save
            </Button>
          </View>
        </ScrollView>
      </View>
    );
  }
}


PlantEditView.propTypes = {
  controllerID: PropTypes.string,
  navigator: PropTypes.object,
  plant: React.PropTypes.object,
  navigation: PropTypes.object,
};

const styles = StyleSheet.create({
  container: {
    margin: 20,
    marginTop: 0,
    flex: 1
  },
  label: {
    minHeight: 30,
    flex: 1,
  },
  sliderImages: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 10
  },
  sliderIcon: {
    width: 50,
    height: 50
  },
  horizontalItem: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20
  },
  plantImage: {
    margin: 20,
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  button: {
    flex: 1,
    marginTop: 10
  }
});
