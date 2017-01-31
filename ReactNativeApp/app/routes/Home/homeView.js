import React, { Component } from 'react';
import { View, Text, TouchableHighlight , StyleSheet, ListView, ActivityIndicator, ScrollView, RefreshControl, Image } from 'react-native';
import { NavbarButton } from '../../components';
import {colors, fonts, I18n} from '../../config';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Router } from '../../router';
import { connect } from 'react-redux';
import { updatePlants } from '../../redux/actions';

import autobind from 'autobind-decorator';

@autobind
class HomeView extends Component {

  static route = {
    navigationBar: {
      renderTitle: () => { return (
        <View style= {styles.navContainer}>
          <Text style= {styles.headline}>
            Watering my Things
          </Text>
        </View>
      );},
      renderLeft: () => {},
      renderRight:<NavbarButton iconName='plus-square-o' route='plantEdit'/>
    }
  }

  constructor(props) {
    super(props);
    const healthy = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    const dry = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    this.state = {
      healthy_plants: healthy.cloneWithRows([]),
      dry_plants: dry.cloneWithRows([]),
      loaded: true,
      refreshing: false
    };
  }

  componentWillReceiveProps(nextProps) {
    this._categorizePlants(nextProps.plants);
  }

  componentDidMount() {
    this._initialFetch();
  }

  _initialFetch() {
    this.setState({loaded: false});
    this._fetchData();
  }

  _userInitiatedFetch() {
    this.setState({refreshing: true});
    this._fetchData();
  }

  _fetchData() {
    this.props.client.getPlants()
    .then(this.props.updatePlants);
  }

  _categorizePlants(listOfPlants) {
    const ok = [];
    const toDry = [];

    for (let plant of listOfPlants) {
      if (!plant.latestMoistureValue || (plant.latestMoistureValue > plant.moistureThreshold))
        ok.push(plant);
      else {
        toDry.push(plant);
      }
    }
    this.setState({
      healthy_plants: this.state.healthy_plants.cloneWithRows(ok),
      dry_plants: this.state.dry_plants.cloneWithRows(toDry),
      loaded: true,
      refreshing: false
    });

  }

  render() {
    return (
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._userInitiatedFetch}
            />
          }
          style={styles.container}>
          <ActivityIndicator
             animating={!this.state.loaded}
             style={styles.activityIndicator}/>
         {(this.state.dry_plants._cachedRowCount === 0 && this.state.healthy_plants._cachedRowCount === 0) &&
            <View style={styles.noPlantsContainer}>
              <Text style={styles.noPlants}>
                {I18n.t('noPlants')}
              </Text>
            </View>
          }
          {this.state.dry_plants._cachedRowCount > 0 &&
            <View
              style={[styles.sectionHeader, styles.topSection]}>
              <Icon name="shower" size={18} style={styles.icon}/>
              <Text>
                {I18n.t('homeDryPlants')}
              </Text>

            </View>
          }
          <ListView
            dataSource={this.state.dry_plants}
            renderRow={this.renderPlants}
            contentContainerStyle={styles.list}
            enableEmptySections={true}
            scrollEnabled={false}
          />
          {this.state.healthy_plants._cachedRowCount > 0 &&
            <View
              style={styles.sectionHeader}>
              <Icon name="heart-o" size={18} style={styles.icon}/>
              <Text>
                {I18n.t('homeHealthyPlants')}
              </Text>
            </View>
          }
          <ListView
            dataSource={this.state.healthy_plants}
            renderRow={this.renderPlants}
            contentContainerStyle={styles.list}
            enableEmptySections={true}
            scrollEnabled={false}
          />
        </ScrollView>
    );
  }

  renderPlants(plant) {
    return (
      <TouchableHighlight underlayColor={colors.touchFeedback} onPress={() =>
        this.onPlantPress(plant)}>
        <View>
          <View style={styles.row}>
            <View style={styles.imageContainer}>
              <Image style={styles.image} key={plant.plantImage.uri} source={plant.plantImage}/>
              <View style={styles.textBackground}>
                <Text style={styles.textStyle}>{plant.name}</Text>
              </View>
          </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  }

  onPlantPress(plant) {
    this.props.navigator.push(Router.getRoute('plant', {plant: plant}));
  }
}

HomeView.propTypes = {
  navigator: React.PropTypes.object,
  route: React.PropTypes.object,
  client: React.PropTypes.object.isRequired,
  plants: React.PropTypes.array.isRequired,
  updatePlants: React.PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return ({
    client: state.controller.client,
    plants: state.plant.plants,
  });
};

const mapDispatchToProps = (dispatch) => {
  return {
    updatePlants: (plants) => dispatch(updatePlants(plants))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeView);

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.defaultBackground,
    flex: 1,
  },
  topSection: {
    marginTop: -20,
    borderStyle: 'solid',
    borderTopColor: colors.navBotton,
    borderTopWidth: 1,
    paddingTop: 10
  },
  sectionHeader: {
    flex: 1,
    padding: 10,
    paddingTop: 20,
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    flexDirection:'row',

  },
  icon: {
    paddingRight: 10,
    marginRight: 10,
  },
  list: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  row: {
    margin: 2,
    alignItems: 'center',
    backgroundColor: colors.defaultBackground,
    alignSelf: 'center',
    width: 170,
    height: 130,
    paddingBottom: 5,
  },
  imageContainer:{
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  image:{
    width: 170,
    height: 130,
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  textStyle: {
    color: colors.black,
    fontSize: fonts.listSize,
    fontFamily: fonts.defaultFamily,
    textAlign: 'center',
    width: 170,
  },
  activityIndicator: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headline:{
    fontSize: 25,
    fontFamily: fonts.defaultFamily,
    color: colors.navText,
    alignSelf: 'center',
    textAlign: 'center',
  },
  navContainer:{
    backgroundColor: colors.navbar,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowRadius: 1,
    shadowOpacity: 1,
    shadowOffset:{width: 0, height: 2},
  },
  noPlantsContainer :{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  noPlants:{
    marginTop: 100,
    alignSelf: 'center',
    textAlign:  'center',
    fontSize: 20,
    color: colors.noPlantText,
  }
});
