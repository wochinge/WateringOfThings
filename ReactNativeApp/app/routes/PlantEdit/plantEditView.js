
import React, { Component, PropTypes } from 'react';
import { StyleSheet, Alert, View, Text, Image, Slider, TouchableHighlight, ScrollView } from 'react-native';
import { images, colors, commonStyles, I18n } from '../../config';
import { InputFormRow } from '../../components';
import Button from 'apsl-react-native-button';
import ImagePicker from 'react-native-image-crop-picker';
import { Plant as PlantDB } from '../../database';
import { connect } from 'react-redux';
import { NavbarButton } from '../../components';


class PlantEditView extends Component {

  static route = {
    navigationBar: {
      title(params) {
        return params.plant ? I18n.t('edit_plant') : I18n.t('create_plant');
      },
      renderRight: (params) => {
        if (params.params.plant) {
          return (
            <NavbarButton iconName='trash' onPress={params.params.showPlantAlert}/>
          );
        }
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
      imageSelected: false,
      plantEditMode: plantEditMode,
      validPin: plantEditMode ? true : false,
      validPosition: plantEditMode ? true : false
    };

    this._savePlant = this._savePlant.bind(this);
    this._saveImage = this._saveImage.bind(this);
    this._selectPlantImage = this._selectPlantImage.bind(this);
    this._validateName = this._validateName.bind(this);
    this._validatePin = this._validatePin.bind(this);
    this._validatePosition = this._validatePosition.bind(this);
    this._deletePlantAlert = this._deletePlantAlert.bind(this);
    this._deletePlant = this._deletePlant.bind(this);
  }

  componentDidMount() {
    setTimeout(() => {
      this.props.navigator.updateCurrentRouteParams({
        showPlantAlert: this._deletePlantAlert
      });
    }, 1000);
  }

  _getPlantImage(plantEditMode, plant) {
    let plantURL = null;
    if (plantEditMode) {
      const db = new PlantDB();
      plantURL = db.getPlantImagePath(plant.id);
    }

    if (!plantURL) {
      console.log(images.defaultPlantImage);
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
      imageSelected: true
    }))
    .catch(e => console.log(e));
  }

  _savePlant() {
    const client = this.props.client;
    if (this.state.plantEditMode) {
      client.updatePlant(this.props.plant.id, this.state.name, this.state.pin, this.state.position, `${this.state.moistureThreshold}`)
      .then(() => this._saveImage(this.props.plant.id))
      .catch((error) => {
        console.log('There has been a problem with the fetch operation: ' + error.message);
      });
      this.props.navigator.pop(2);
    } else {
      client.createPlant(this.state.name, this.state.pin, this.state.position, `${this.state.moistureThreshold}`)
      .then(created => this._saveImage(created.id))
      .catch((error) => {
        console.log('There has been a problem with the fetch operation: ' + error.message);
      });
      this.props.navigation.performAction(({ tabs, stacks }) => {
        tabs('main').jumpToTab('home');
        stacks('home').popToTop();
      });
    }
  }

  _saveImage(id) {
    if (this.state.imageSelected) {
      const db = new PlantDB();
      db.save(id, this.state.plantImage.uri);
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
    if (pin < 0 || pin > 7) {
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

  _deletePlantAlert() {
    Alert.alert(I18n.t('deletePlantAlert'),
      I18n.t('deletePlantAlertMessage'),
      [
        {text: I18n.t('delete'), onPress: this._deletePlant},
        {text: I18n.t('cancel'), style: 'cancel'}
      ]);
  }
  _deletePlant() {
    this.props.client.deletePlant(this.props.plant.id);
    this.props.navigator.pop(2);
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
          <InputFormRow label={I18n.t('name')}
            defaultValue={this.state.plantEditMode ? this.props.plant.name : ''}
            placeholder={I18n.t('namePlaceholder')}
            valid={this.state.name != ''}
            onChange={this._validateName}/>
          <InputFormRow label={I18n.t('pin')}
            defaultValue={this.state.plantEditMode ? `${this.props.plant.pin}` : ''}
            placeholder={I18n.t('pinPlaceHolder')}
            valid={this.state.validPin}
            keyboardType='numeric'
            onChange={this._validatePin}/>
          <InputFormRow label={I18n.t('position')}
            defaultValue={this.state.plantEditMode ? `${this.props.plant.position}` : ''}
            placeholder={I18n.t('positionPlaceholder')}
            keyboardType='numeric'
            valid={this.state.validPosition}
            onChange={this._validatePosition}/>
          <View
            style={styles.item}>
            <Text
              style={styles.label}>
              {I18n.t('moistureThreshold')}
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
              minimumValue={100}
              maximumValue={900}
              value={this.state.plantEditMode ? this.props.plant.moistureThreshold : 500}/>
          </View>
          <View
            style={styles.horizontalItem}>
            <Button style={[commonStyles.defaultButton, styles.button]} textStyle={commonStyles.defaultButtonText}
              onPress={this._savePlant}
              isDisabled={!this.state.name || !this.state.validPin || !this.state.validPosition}>
              {I18n.t('save')}
            </Button>
          </View>
        </ScrollView>
      </View>
    );
  }
}

PlantEditView.propTypes = {
  client: PropTypes.object.isRequired,
  navigator: PropTypes.object,
  plant: React.PropTypes.object,
  navigation: PropTypes.object,
};

const mapStateToProps = (state) => (
  {
    client: state.controller.client
  }
);

export default connect(mapStateToProps)(PlantEditView);

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
