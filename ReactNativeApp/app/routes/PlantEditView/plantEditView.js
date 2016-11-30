
import React, { Component, PropTypes } from 'react';
import { View, Text, TextInput, Image, Slider, TouchableHighlight } from 'react-native';
import { images, colors } from '../../config';
import { Button } from '../../components';
import ImagePicker from 'react-native-image-crop-picker';
import { WoTClient } from '../../network';
import { Plant as PlantDB } from '../../database';


export default class PlantEditView extends Component {

  static route = {
    navigationBar: {
      title: 'Create plant'
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      pin: 0,
      position: 0,
      moistureThreshold: 0,
      plantImage: images.defaultPlantImage,
      plantImageData: 0,
    };

    this._cancelEditing = this._cancelEditing.bind(this);
    this._savePlant = this._savePlant.bind(this);
    this._selectPlantImage = this._selectPlantImage.bind(this);
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

  _cancelEditing() {
    this.props.navigator.pop();
  }

  _savePlant() {
    const db = new PlantDB();
    const client = new WoTClient(this.props.controllerID);
    client.createPlant(this.state.name, this.state.pin, this.state.position, this.state.moistureThreshold)
    .then(created => db.save(created.id, this.state.plantImage.uri));

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
            value={50}/>
        </View>
        <View
          style={styles.horizontalItem}>
          <Button
            handlePress={this._cancelEditing}
            text='Cancel'
          />
          <Button
            handlePress={this._savePlant}
            text='Save'
            //style={styles.item}
          />
        </View>
      </View>
    );
  }
}

PlantEditView.propTypes = {
  controllerID: PropTypes.string,
  navigator: PropTypes.object
};

const styles = {
  container: {
    margin: 20,
    marginTop: 40,
    flex: 1
  },
  item: {
    marginBottom: 20
  },
  label: {
    marginBottom: 15
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
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  button: {
    borderRadius: 5,
    flex: 1,
    height: 35,
    alignSelf: 'stretch',
    justifyContent: 'center',
    overflow: 'hidden',
  }
};
