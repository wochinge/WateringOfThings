import React, { Component, PropTypes } from 'react';
import { Image, View, Text, TextInput , StyleSheet } from 'react-native';
import WoTClient from '../../network/WoTClient';
import { Microcontroller } from '../../database/db';
import Button from 'apsl-react-native-button';
import { colors, images, commonStyles } from '../../config';
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
      inputMessage: 'To water your plants, you have to provide the id of a controller.'
    };
  }

  render() {
    return(
      <View
        style={styles.container}>

        <View
          style={styles.imageView}>
          <Image
            source={images.startIcon}
            resizeMode="contain"
            style={styles.image}
          />
        </View>

        <View
          style={styles.header}>
          <Text>
            Welcome to WateringOfPlants!
          </Text>
        </View>

        <View
          style={styles.content}>
          <Text
            style={styles.label}>
            {this.state.inputMessage}
          </Text>

          <TextInput
            editable = {true}
            maxLength = {40}
            placeholder = 'Microcontroller id'
            onChangeText={(text) => this.setState({microcontrollerInput: text})}
            style={styles.input}>
          </TextInput>
        </View>
      <View
        style={styles.horizontalItem}>
        <Button
          style={[commonStyles.defaultButton, styles.item]}
          textStyle={commonStyles.defaultButtonText}
          onPress={() => this.validateControllerID(this.state.microcontrollerInput)}>
          Save
        </Button>
      </View>
      </View>
    );
  }

  validateControllerID(controllerID) {
    controllerID = controllerID.trim();
    if (controllerID) {
      const client = new WoTClient(controllerID);
      client.existsController()
      .then(response => this.controllerValidationResult(response.exists, controllerID));
    }
  }

  controllerValidationResult(isValid, id) {
    if (isValid) {
      const db = new Microcontroller();
      db.save(id);
      this.props.navigator.replace(Router.getRoute('home', {controllerID: id}));
    } else {
      this.setState({inputMessage: 'The given id was not valid. Please provide an valid id!'});
    }
  }
}


AddControllerView.propTypes = {
  navigator: PropTypes.object
};

var styles = StyleSheet.create({
  container: {
    margin: 20,
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.defaultBackground,
  },
  imageView: {
    flex: 1,
    marginBottom: 10,
  },
  image: {
    alignSelf: 'center',
    height: 100
  },
  header: {
    flex: 1
  },
  content: {
    flex: 2
  },
  label: {
    marginBottom: 25,
    flexDirection: 'row'
  },
  input: {
    borderWidth: 0.5,
    minHeight: 30,
    padding: 5
  },
  horizontalItem: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  item: {
    flex: 1
  }
});
