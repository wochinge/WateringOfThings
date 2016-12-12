import React, { Component } from 'react';
import { View, Text, TouchableHighlight , StyleSheet, ListView, ActivityIndicator, ScrollView } from 'react-native';
import WoTClient from '../../network/WoTClient';
import { NavbarButton } from '../../components';
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
        return (<NavbarButton iconName='plus-square-o' route='plantEdit' routeParams={{controllerID: params.params.controllerID}}/>);
      }
    }
  }

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([]),
      loaded: true,
      client: new WoTClient(this.props.controllerID),
    };
    this.renderPlants = this.renderPlants.bind(this);
    this.fetchData = this.fetchData.bind(this);
  }

  componentWillMount() {
    this._subscription = this.props.route.getEventEmitter().addListener('onFocus', () => {
      if (this.props.controllerID) {
        this.fetchData();
      }
    });
    this.fetchData();
  }

  componentWillUnmount() {
    this._subscription.remove();
  }

  fetchData() {
    this.setState({loaded: false});
    this.state.client.getPlants()
    .then((responseJson) => {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(responseJson),
        loaded: true
      });
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <ListView
            dataSource={this.state.dataSource}
            renderRow={this.renderPlants}
            enableEmptySections={true}
            style={styles.listView}
          />
          <ActivityIndicator
            animating={!this.state.loaded}
            style={styles.activityIndicator}
          />
        </ScrollView>
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
    this.props.navigator.push(Router.getRoute('plant', {plant: plant, controllerID: this.props.controllerID}));
  }
}

HomeView.propTypes = {
  navigator: React.PropTypes.object,
  route: React.PropTypes.object,
  controllerID: React.PropTypes.string
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
