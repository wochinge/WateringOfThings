import React, { Component, PropTypes } from 'react';
import { View, Text, TouchableHighlight , StyleSheet, ListView } from 'react-native';

export default class HomeView extends Component {

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows(['Sonnenblume','Basilikum','Gummibaum'])
    };
    this.renderPlants = this.renderPlants.bind(this);
  }

  // _pressData: ({}: {[key: number]: boolean})

  render() {
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
      {plant}
      </Text>
      </View>
      </TouchableHighlight>
    );
  }

  onPlantPress(plant) {
    this.props.navigator.push({title: 'Plant', index: 1});
    // this._pressData[rowID] = !this._pressData[rowID];
  }


}
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#F6F6F6',
  },
  thumb: {
    width: 64,
    height: 64,
  },
  text: {
    flex: 1,
    color: 'black',
  },
});
