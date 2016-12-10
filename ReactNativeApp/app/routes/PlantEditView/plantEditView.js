
import React, { Component, PropTypes } from 'react';
import { View, Text, TextInput, Image, Slider, TouchableHighlight } from 'react-native';
import { images, colors, commonStyles } from '../../config';

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

    console.log(plant);

    this.state = {
      name: plantEditMode ? plant.name : '',
      pin: plantEditMode? plant.pin : 0,
      position: plantEditMode ? plant.position : 0,
      moistureThreshold: plantEditMode ? plant.moistureThreshold : 0,
      plantImage: this._getPlantImage(plantEditMode, plant),
      plantImageData: 0,
      plantEditMode: plantEditMode
    };
    this._savePlant = this._savePlant.bind(this);
    this._selectPlantImage = this._selectPlantImage.bind(this);
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
      client.updatePlant(this.props.plant.id, this.state.name, this.state.pin, this.state.position, this.state.moistureThreshold)
      .then(() => db.save(this.props.plant.id, this.state.plantImage.uri));
      this.props.navigator.pop(2);
    } else {
      client.createPlant(this.state.name, this.state.pin, this.state.position, this.state.moistureThreshold)
      .then(created => db.save(created.id, this.state.plantImage.uri));
      this.props.navigator.pop();
    }

  }

  render() {
    return(
      <View
        style={styles.container}>
        <TouchableHighlight
          onPress={this._selectPlantImage}
          underlayColor={colors.touchFeedback}
          style={styles.horizontalItem}>
          <Image
            source={this.state.plantImage}
            style={styles.plantImage}
          />
        </TouchableHighlight>
        <View
          style={styles.item}>
          <Text
            style={styles.label}>
            Name
          </Text>
          <TextInput
            placeholder='e.g. Basil'
            defaultValue={this.state.plantEditMode ? this.props.plant.name : null}
            onChangeText={(name) => this.setState({name})}
            style={styles.input}/>
        </View>
        <View
          style={styles.item}>
          <Text
            style={styles.label}>
            Pin
          </Text>
          <TextInput
            placeholder='e.g. 3'
            defaultValue={this.state.plantEditMode ? `${this.props.plant.pin}` : null}
            keyboardType='numeric'
            onChangeText={(pin) => this.setState({pin})}
            style={styles.input}/>
        </View>
        <View
          style={styles.item}>
          <Text
            style={styles.label}>
            Position in degree
          </Text>
          <TextInput
            placeholder='e.g. 90'
            defaultValue={this.state.plantEditMode ? `${this.props.plant.position}` : null}
            keyboardType='numeric'
            onChangeText={(position) => this.setState({position})}
            style={styles.input}/>
        </View>
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
            onSlidingComplete={(moistureThreshold) => this.setState({moistureThreshold})}
            minimumValue={0.0}
            maximumValue={100.0}
            value={this.state.plantEditMode ? this.props.plant.moistureThreshold : 50}/>
        </View>
        <View
          style={styles.horizontalItem}>
          <Button style={[commonStyles.defaultButton, styles.button]} textStyle={commonStyles.defaultButtonText}
            onPress={this._savePlant}>
            Save
          </Button>
        </View>
      </View>
    );
  }
}

PlantEditView.propTypes = {
  controllerID: PropTypes.string,
  navigator: PropTypes.object,
  plant: React.PropTypes.object
};

const styles = {
  container: {
    margin: 20,
    marginTop: 0,
    flex: 1
  },
  item: {
    marginBottom: 20
  },
  label: {
    marginBottom: 10
  },
  input: {
    minHeight: 30
  },
  sliderImages: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  sliderIcon: {
    width: 50,
    height: 50
  },
  horizontalItem: {
    flexDirection: 'row',
    justifyContent: 'center'
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
};
