import React, { Component, PropTypes } from 'react';
import { Modal, View, Text, TextInput , StyleSheet } from 'react-native';
import WoTClient from '../../network/WoTClient';
import Microcontroller from '../../database/db';
import { Button } from '../../components';

export default class MicrocontrollerView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      controllers: [],
      microcontrollerInput: 'das',
      modalVisible: false
    };
    this.addMicrocontroller.bind(this);
  }

  componentDidMount() {
    this.getMicrocontrollers();
  }

  render() {
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
            <Button
              handlePress={() => this.addMicrocontroller(this.state.microcontrollerInput)}
              text={'Ok'}
              style={[styles.row, styles.button]}
            />
          </View>
        </View>

      </Modal>
    );
  }

  getMicrocontrollers() {
    const db = new Microcontroller();
    const controllers = db.get();
    if (controllers.length > 0) {
      this.props.controllerIDReceived(controllers[0].id);
    } else {
      this.setState({modalVisible: true});
    }
  }

  addMicrocontroller(controllerID) {
    controllerID = controllerID.trim();
    if (controllerID) {
      const client = new WoTClient(controllerID);
      client.createController();

      const db = new Microcontroller();
      db.save(controllerID);

      this.setState({modalVisible: false});
      this.props.controllerIDReceived(controllerID);
    }
  }
}

MicrocontrollerView.propTypes = {
  controllerIDReceived: PropTypes.func
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
