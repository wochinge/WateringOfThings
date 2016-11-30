import React, { Component } from 'react';
import { View, Text, TouchableHighlight , StyleSheet, ListView, ActivityIndicator } from 'react-native';
import WoTClient from '../../network/WoTClient';
import { AddButton } from '../../components';
import MicrocontrollerView from '../MicrocontrollerView/Microcontroller';
import {colors, fonts} from '../../config';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Router } from '../../index';


export default class HomeView extends Component {

  static route = {
    navigationBar: {
      renderTitle: () => { return (
        <Text style= {styles.headline}>
          <Icon name="tint" style={styles.icon} size={35} />
          Watering my Things
        </Text>
      );},
      renderLeft: () => {},
      renderRight: (params) => {
        return (<AddButton route='plantEdit' routeParams={{controllerID: params.params.controllerID}}/>);
      }
    }
  }

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([]),
      loaded: true,
      constructorID: ''
    };
    this.renderPlants = this.renderPlants.bind(this);
    this.fetchData = this.fetchData.bind(this);
  }

  componentWillMount() {
    this._subscription = this.props.route.getEventEmitter().addListener('onFocus', () => {
      if (this.state.controllerID) {
        this.fetchData(this.state.controllerID);
      }
    });
  }

  componentWillUnmount() {
    this._subscription.remove();
  }

  fetchData(controllerID) {
    this.props.navigator.updateCurrentRouteParams({
      controllerID: controllerID
    });
    this.setState({loaded: false, controllerID: controllerID});
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

  renderPlants(plant) {
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
    this.props.navigator.push(Router.getRoute('plant', {plant: plant, controllerID: this.state.controllerID}));
  }
}

HomeView.propTypes = {
  navigator: React.PropTypes.object,
  route: React.PropTypes.object
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
  headline:{
    fontSize: 25,
    fontFamily: fonts.defaultFamily,
    color: colors.navText,
    alignSelf: 'center',
  },
  icon: {
    paddingTop:30,
    paddingRight:20,
    marginRight:10,
    color: colors.navText,
  }
});
