import React, { Component } from 'react';
import { View, Text, TouchableHighlight , StyleSheet, ListView, ActivityIndicator } from 'react-native';
import WoTClient from '../../network/WoTClient';
import MicrocontrollerView from '../MicrocontrollerView/Microcontroller';
import {colors, fonts} from '../../config';

export default class HomeView extends Component {

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([]),
      loaded: true
    };
    this.renderPlants = this.renderPlants.bind(this);
    this.fetchData = this.fetchData.bind(this);
  }

  fetchData(controllerID) {
    this.setState({loaded: false});
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
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderPlants}
          enableEmptySections={true}
          style={styles.listView}
        />
        <MicrocontrollerView
          controllerIDReceived={this.fetchData}
        />
        <ActivityIndicator
          animating={!this.state.loaded}
          style={styles.activityIndicator}
        />
      </View>
    );
  }

  renderPlants(plant, sectionID, rowID, highlightRow) {
    return (
      <TouchableHighlight underlayColor={colors.touchFeedback} onPress={() =>
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
    this.props.navigator.push({plant: plant, index: 1});
  }
}

HomeView.propTypes = {
  navigator: React.PropTypes.object,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.defaultBackground,
    paddingTop:50,
  },
  listView: {
    flex:1,
    paddingTop:10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: colors.defaultBackground,
    borderBottomColor : colors.separator,
    borderTopColor: colors.defaultBackground,
    borderRightColor: colors.defaultBackground,
    borderLeftColor: colors.defaultBackground,
    borderStyle: 'solid',
    borderWidth: 1,
    height: 40,
  },
  text: {
    flex: 1,
    color: colors.defaultText,
    alignSelf: 'center',
    fontSize: fonts.listSize,
    fontFamily: fonts.defaultFamily,
    paddingLeft: 60,
  },
  activityIndicator: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
});
