
import React, { Component, PropTypes } from 'react';
import { StyleSheet, Alert, View, Text, Image, Slider, TouchableHighlight, ScrollView, Dimensions } from 'react-native';
import { images, colors, commonStyles, I18n } from '../../config';
import { InputFormRow } from '../../components';
import Button from 'apsl-react-native-button';
import ImagePicker from 'react-native-image-crop-picker';
import { connect } from 'react-redux';
import { NavbarButton } from '../../components';
import autobind from 'autobind-decorator';
import { editPlant, createPlant, deletePlant } from '../../redux/actions';
import { Router } from '../../router';

@autobind
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
    let plant = this.props.plant;

    this.state = {
      name: plant && plant.name,
      pin: plant && plant.pin,
      position: plant && plant.position,
      moistureThreshold: plant ? plant.moistureThreshold : 50,
      plantImage: plant ? plant.plantImage : images.defaultPlantImage,
      imageSelected: false,
      validPin: plant && true,
      validPosition: plant && true,
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.props.navigator.updateCurrentRouteParams({
        showPlantAlert: this._deletePlantAlert
      });
    }, 1000);
  }

  componentWillReceiveProps(nextProps) {
    const { positionFromAssistant } = nextProps;
    if (positionFromAssistant || positionFromAssistant === 0) {
      this._savePositionFromAssistant(positionFromAssistant);
    }
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
    const plant = {
      id: this.props.plant ? this.props.plant.id : null,
      name: this.state.name,
      pin: this.state.pin,
      position: this.state.position,
      moistureThreshold: this.state.moistureThreshold,
      latestMoistureValue: this.props.plant ? this.props.plant.latestMoistureValue : null,
      plantImage: this.state.plantImage.uri
    };

    if (this.props.plant) {
      client.updatePlant(plant)
      .catch((error) => {
        console.log('There has been a problem with the fetch operation: ' + error.message);
      });
      this.props.saveEditedPlant(plant);
      this.props.navigator.pop(2);
    } else {
      client.createPlant(plant)
      .then(plantWithID =>  {
        plantWithID.plantImage = plant.plantImage;
        this.props.saveCreatedPlant(plantWithID);
      })
      .catch((error) => {
        console.log('There has been a problem with the fetch operation: ' + error.message);
      });
      this._clear();
      this.props.navigation.performAction(({ tabs, stacks }) => {
        tabs('main').jumpToTab('home');
        stacks('home').popToTop();
      });
    }
  }

  _clear() {
    const empty = {text: ''};
    this.refs['nameForm'].setNativeProps(empty);
    this.refs['pinForm'].setNativeProps(empty);
    this.refs['positionForm'].setNativeProps(empty);
    this.setState({plantImage: images.defaultPlantImage});
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

  _savePositionFromAssistant(position) {
    this.refs['positionForm'].setNativeProps({text: `${position}`});
    this._validatePosition(position);
  }

  _validatePosition(position) {
    position = parseInt(position);
    let valid = false;
    if (!isNaN(position) && position >= 0 && position <= 180) {
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
    this.props.deletePlant(this.props.plant);
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
          <InputFormRow ref={'nameForm'}
            label={I18n.t('name')}
            defaultValue={this.props.plant && this.props.plant.name}
            placeholder={I18n.t('namePlaceholder')}
            valid={this.state.name != ''}
            onChange={this._validateName}/>
          <InputFormRow ref={'pinForm'}
            label={I18n.t('pin')}
            defaultValue={this.props.plant && `${this.props.plant.pin}`}
            placeholder={I18n.t('pinPlaceHolder')}
            valid={this.state.validPin}
            keyboardType='numeric'
            onChange={this._validatePin}/>
          <InputFormRow ref={'positionForm'}
            label={I18n.t('position')}
            defaultValue={this.props.plant && `${this.props.plant.position}`}
            placeholder={I18n.t('positionPlaceholder')}
            keyboardType='numeric'
            valid={this.state.validPosition}
            onChange={this._validatePosition}/>
          <Text
            style={styles.posAssi}
            onPress={() => this.props.navigator.push(Router.getRoute('positionAssistant'))}>
            Positionassistent
          </Text>
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
              step={1}
              value={this.props.plant ? this.props.plant.moistureThreshold : 500}/>
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
  saveCreatedPlant: PropTypes.func.isRequired,
  saveEditedPlant: PropTypes.func.isRequired,
  deletePlant: PropTypes.func.isRequired
};

const mapStateToProps = (state) => (
  {
    client: state.controller.client,
    positionFromAssistant: state.plant.positionAngle,
  }
);

const mapDispatchToProps = (dispatch) => {
  return {
    saveEditedPlant: (plant) => dispatch(editPlant(plant)),
    saveCreatedPlant: (plant) => dispatch(createPlant(plant)),
    deletePlant: (plant) => dispatch(deletePlant(plant))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PlantEditView);

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
  },
  posAssi: {
    color: colors.selected,
    paddingLeft: ((Dimensions.get('window').width)/3)-15,
    paddingBottom: 20,
  }
});
