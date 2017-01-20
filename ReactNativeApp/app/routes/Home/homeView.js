import React, { Component } from 'react';
import { View, Text, TouchableHighlight , StyleSheet, ListView, ActivityIndicator, ScrollView, RefreshControl, Image } from 'react-native';
import { NavbarButton } from '../../components';
import {colors, fonts, images, I18n} from '../../config';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Router } from '../../router';
import { Plant } from '../../database';
import { connect } from 'react-redux';
import autobind from 'autobind-decorator';

@autobind
class HomeView extends Component {

  static route = {
    navigationBar: {
      renderTitle: () => { return (
        <View style= {styles.navContainer}>
          <Text style= {styles.headline}>
          {/*<Icon name="tint" style={styles.icon} size={35} />*/}

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

  componentWillMount() {
    this._subscription = this.props.route.getEventEmitter().addListener('onFocus', () => {
      if (this.props.client) {
        this._initialFetch();
      }
    });
  }

  componentDidMount() {
    this._initialFetch();
  }

  componentWillUnmount() {
    this._subscription.remove();
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
    .then(this._categorizePlants);
  }

  _categorizePlants(listOfPlants) {
    const ok = [];
    const toDry = [];

    for (let plant of listOfPlants) {
      if (!plant.lastMoistureValue || (plant.lastMoistureValue > plant.moistureThreshold))
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
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._userInitiatedFetch}
            />
          }
          style={styles.container}
        >
          <ActivityIndicator
             animating={!this.state.loaded}
             style={styles.activityIndicator}/>
          {(this.state.dry_plants._cachedRowCount===0 && this.state.healthy_plants._cachedRowCount===0) ?
            <View style={styles.noPlantsContainer}>
              <Text style={styles.noPlants}>
                {I18n.t('noPlants')}
              </Text>
            </View>
          : null}
          {this.state.dry_plants._cachedRowCount > 0 ?
            <View
              style={styles.sectionHeader}>
              <Icon name="exclamation-triangle" size={18}/>
            </View>
            : null}
          <ListView
            dataSource={this.state.dry_plants}
            renderRow={this.renderPlants}
            contentContainerStyle={styles.list}
            enableEmptySections={true}
            scrollEnabled={false}
          />
          {this.state.healthy_plants._cachedRowCount > 0 ?
            <View
              style={styles.sectionHeader}>
              <Icon name="check" size={18}/>
            </View>
            : null}
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

            {this._setImage(plant)}

          </View>
        </View>
      </TouchableHighlight>
    );
  }

  _setImage(plant) {
    const plantDB = new Plant();
    const plantImageURL = plantDB.getPlantImagePath(plant.id);
    let imageURL = images.defaultPlantImage;
    if (plantImageURL) {
      imageURL = plantImageURL;
    }
    return (
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={imageURL}>
          <View style={styles.textBackground}>
            <Text style={styles.textStyle}>{plant.name}</Text>
          </View>
        </Image>
    </View>
    );
  }

  onPlantPress(plant) {
    this.props.navigator.push(Router.getRoute('plant', {plant: plant}));
  }
}

HomeView.propTypes = {
  navigator: React.PropTypes.object,
  route: React.PropTypes.object,
  client: React.PropTypes.object.isRequired
};

const mapStateToProps = (state) => (
  {
    client: state.controller.client
  }
);

export default connect(mapStateToProps)(HomeView);

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.defaultBackground,
    flex: 1
  },
  sectionHeader: {
    flex: 1,
    padding: 10,
    alignSelf: 'stretch',
    alignItems: 'center',
    backgroundColor: colors.shadow,
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
    borderWidth: 1,
    borderColor: colors.separator,
    backgroundColor: colors.defaultBackground,
    alignSelf: 'center',
    width: 170,
    height: 130,
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
    color: colors.gridText,
    fontSize: fonts.listSize,
    fontFamily: fonts.defaultFamily,
    textAlign: 'center',
    width: 170,
  },
  textBackground: {
    backgroundColor: colors.gridTextBackground,
    justifyContent :'flex-end',
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
    borderBottomColor: colors.navBotton,
    borderStyle: 'solid',
    borderBottomWidth: 1,
    shadowColor: colors.shadow,
    shadowRadius: 1,
    shadowOpacity: 1,
    shadowOffset:{width: 0, height: 2},
  },
  icon: {
    paddingTop:30,
    paddingRight:20,
    marginRight:10,
    color: colors.navText,
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
