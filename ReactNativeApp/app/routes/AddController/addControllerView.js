import React, { Component, PropTypes } from 'react';
import { Image, View, Text , StyleSheet } from 'react-native';
import WoTClient from '../../network/WoTClient';
import { Microcontroller } from '../../database/db';
import Button from 'apsl-react-native-button';
import { colors, images, commonStyles } from '../../config';
import { ValidatedTextInput } from '../../components';

import { Router } from '../../index';

export default class AddControllerView extends Component {

  static route = {
    navigationBar: {
      title: 'Add Controller',
      renderLeft: () => {},
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      controllers: [],
      microcontrollerInput: '',
      inputMessage: 'To water your plants, you have to provide the id of a controller.',
      validating: false
    };
    this._validateControllerID = this._validateControllerID.bind(this);
    this._save = this._save.bind(this);
    this._controllerValidationResult = this._controllerValidationResult.bind(this);
  }

  render() {
    return(
      <View
        style={styles.container}>

        <View style={styles.top}>
          <Image
            source={images.startIcon}
            resizeMode='contain'
            style={styles.image}/>
          <Text style={styles.header}>
            Welcome to WateringOfPlants!
          </Text>
        </View>

        <View style={styles.middle}>
          <Text style={styles.label}>
            {this.state.inputMessage}
          </Text>
          <ValidatedTextInput
            placeholder='controller id'
            valid={this.state.microcontrollerInput != ''}
            onChange={(this._validateControllerID)}
            disableAutoCorrect={true}/>
        </View>

        <View style={styles.bottom}>
          <Button
            style={[commonStyles.defaultButton, styles.item]}
            textStyle={commonStyles.defaultButtonText}
            onPress={this._save}
            isLoading={this.state.validating}
            activityIndicatorColor={colors.buttonText}
            isDisabled={this.state.microcontrollerInput == ''}>
            Save
          </Button>
        </View>
      </View>
    );
  }

  _validateControllerID(controllerID) {
    this.setState({
      validating: false,
      microcontrollerInput: controllerID.trim()
    });
  }

  _save() {
    this.setState({validating: true});
    const client = new WoTClient(this.state.microcontrollerInput);
    client.existsController()
    .then(response => this._controllerValidationResult(response.exists));
  }

  _controllerValidationResult(isValid) {
    this.setState({validating: false});
    if (isValid) {
      const id = this.state.microcontrollerInput;
      const db = new Microcontroller();
      db.save(id);
      if (this.props.firstAppStart) {
        this.props.navigator.push(Router.getRoute('tabNavigationLayout', {controllerID: id}));
      } else {
        this.props.navigation.performAction(({ tabs, stacks }) => {
          tabs('main').jumpToTab('home');
          stacks('home').popToTop();
          stacks('home').replace(Router.getRoute('home', {controllerID: this.state.microcontrollerInput}));
        });
      }

    } else {
      this.setState({
        inputMessage: 'The given id was not valid. Please provide an valid id!',
        microcontrollerInput: ''
      });
    }
  }
}

AddControllerView.propTypes = {
  navigation: PropTypes.object.isRequired,
  navigator: PropTypes.object,
  firstAppStart: PropTypes.bool,
};

const styles = StyleSheet.create({
  container: {
    margin: 20,
    flexDirection: 'column',
    flex: 1,
    backgroundColor: colors.defaultBackground,
    justifyContent: 'space-between'
  },
  top: {
    flex: 1,
  },
  middle: {
    flex: 1,
    justifyContent: 'center',
  },
  bottom: {
    flex: 1,
    justifyContent: 'center'
  },
  image: {
    alignSelf: 'center',
    height: 100,
    margin: 20
  },
  header: {
    textAlign: 'center',
  },
  label: {
    marginBottom: 20
  },
  item: {
    height: 40,
  }
});
