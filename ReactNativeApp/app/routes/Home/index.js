import React, { Component, PropTypes } from 'react';
import { View, Text, TouchableHighlight , StyleSheet, ListView } from 'react-native';
import WoTClient from '../../network/WoTClient';

export default class HomeView extends Component {

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([])
    };
    this.renderPlants = this.renderPlants.bind(this);
  }

  getInitialState() {
    return {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      loaded: false,
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData(){
    var wotClient = new WoTClient(3);
    wotClient.getPlants()
  .then((responseJson) => {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(responseJson),
      loaded: true,
    });
  })
  .done();
  }

  render() {
    if(!this.state.loaded){
      return this.renderLoadingView();
    }
    return (
      <View style={styles.container}>
      <ListView
      dataSource={this.state.dataSource}
      renderRow={this.renderPlants}
      style={styles.listView}
      />
      </View>
    );
  }

  renderPlants(plant) {
    return (
      <TouchableHighlight onPress={() =>
        this.onPlantPress(plant)
      }>
      <View style={styles.row}>
      <Text style={styles.text}>
      {plant.name}
      </Text>
      </View>
      </TouchableHighlight>
    );
  }

  renderLoadingView(){
    return (
    <View style={styles.container}>
    <Text>
    Loading movies...
    </Text>
    </View>
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
