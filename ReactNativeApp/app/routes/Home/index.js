import React, { Component } from 'react';
import { View, Text, TouchableHighlight , StyleSheet, ListView } from 'react-native';
import WoTClient from '../../network/WoTClient';
import MicrocontrollerView from '../MicrocontrollerView/Microcontroller';
import { LoadingView } from '../../components';

export default class HomeView extends Component {

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([]),
      loaded: false
    };
    this.renderPlants = this.renderPlants.bind(this);
    this.fetchData = this.fetchData.bind(this);
  }

  fetchData(controllerID) {
    var wotClient = new WoTClient(controllerID);
    wotClient.getPlants()
    .then((responseJson) => {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(responseJson),
        loaded: true,
      });
    });
  }

  render() {
    return (
      <View style={styles.container}>
      { this.state.loaded?
          <ListView
            dataSource={this.state.dataSource}
            renderRow={this.renderPlants}
            style={styles.listView}
          />
         :
          <LoadingView
            visible={!this.state.loaded}
          />
      }
        <MicrocontrollerView
          controllerIDReceived={this.fetchData}
        />
      </View>
    );
  }

  renderPlants(plant) {
    return (
      <TouchableHighlight onPress={() =>
        this.onPlantPress(plant)}>
        <View
          style={styles.row}>
          <Text style={styles.text}>
            {plant.name}
          </Text>
        </View>
      </TouchableHighlight>
    );
  }

  onPlantPress(plant) {
    this.props.navigator.push({title: plant.name, index: 1});
  }
}

HomeView.propTypes = {
  navigator: React.PropTypes.object,
};

const styles = StyleSheet.create({
  listView:{
    padding: 30,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  text: {
    flex: 1,
    color: 'black',
  },
});
