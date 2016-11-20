import React, { Component } from 'react';
import { View, Text, TouchableHighlight , StyleSheet, ListView } from 'react-native';
import WoTClient from '../../network/WoTClient';
import MicrocontrollerView from '../MicrocontrollerView/Microcontroller';
import { LoadingView } from '../../components';
import {colors, fonts} from '../../config';
import Icon from 'react-native-vector-icons/FontAwesome';

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
        <Icon name="rocket" size={30} color="#900" />
        <Text style= {styles.headline}>
          Watering my Things
        </Text>
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
      <TouchableHighlight underlayColor={colors.touchFeecback} onPress={() =>
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
  container:{
    flex: 1,
    backgroundColor: colors.defaultBackground,
  },
  listView:{
    paddingTop:10,
    flex:1,
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
  headline:{
    paddingTop: 30,
    fontSize: 30,
    fontFamily: fonts.defaultFamily,
    color: colors.black,
    alignSelf: 'center',
  },
  text: {
    flex: 1,
    color: colors.defaultText,
    alignSelf: 'center',
    fontSize: fonts.listSize,
    fontFamily: fonts.defaultFamily,
    paddingLeft: 60,
  },
  signInWithFacebookIcon: {
    width: 28,
    height: 28,
    marginLeft: 5
  }
});
