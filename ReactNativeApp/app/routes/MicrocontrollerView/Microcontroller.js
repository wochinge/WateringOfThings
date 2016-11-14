import React, { Component, PropTypes } from 'react';
import { Modal, View, Text, TextInput, TouchableHighlight , StyleSheet } from 'react-native';
import WoTClient from '../../network/WoTClient';
import Microcontroller from '../../database/db';

export default class MicrocontrollerView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      controllers: this.getMicrocontrollers(),
      microcontrollerInput: 'das'
    };
    this.addMicrocontroller.bind(this);
  }

  render() {
    if (this.state.controllers.length >= 0) {
      return(
        <Modal
          animationType={'fade'}
          transparent={true}
          visible={this.state.modalVisible}>
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
                To water your plants, you have to provide the id of a controller.{'\n\n'}
                Please enter a valid id:
              </Text>
              <TextInput
                editable = {true}
                maxLength = {40}
                placeholder = 'Microcontroller id'
                onChangeText={(text) => this.setState({microcontrollerInput: text})}
                style={styles.row}>
              </TextInput>
              <TouchableHighlight
                onPress={() => this.addMicrocontroller(this.state.microcontrollerInput)}
                style={[styles.row, styles.button]}>
                <Text
                  style={styles.buttonText}>
                  Ok</Text>
              </TouchableHighlight>
            </View>
          </View>

        </Modal>
      );
    } else {
      return;
    }
  }

  getMicrocontrollers() {
    const controller = new Microcontroller;
    return controller.get();
  }

  addMicrocontroller(controllerID) {
    controllerID = controllerID.trim();
    if (controllerID) {
      const client = new WoTClient(controllerID);
      client.createController();
      const controller = new Microcontroller();
      controller.save(controllerID);
      this.setState({modalVisible: false});
      client.getPlants()
        .then((plants) => this.props.plantsReceived(plants));
    }
  }
}

MicrocontrollerView.propTypes = {
  plantsReceived: PropTypes.isRequired
};

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  innerContainer: {
    borderRadius: 10,
    alignItems: 'center',
    margin: 60,
    padding: 20,
    backgroundColor: 'white'
  },
  row: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 10,
    minHeight: 40,
    flexWrap: 'wrap'
  },
  rowTitle: {
    fontWeight: 'bold',
  },
  description: {
    minHeight: 80
  },
  button: {
    borderRadius: 5,
    flex: 1,
    height: 35,
    alignSelf: 'stretch',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  buttonText: {
    fontSize: 18,
    margin: 5,
    textAlign: 'center',
  }
});
