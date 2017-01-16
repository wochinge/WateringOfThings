import React, { Component } from 'react';
import { View, Text, TouchableHighlight , StyleSheet, ListView, ActivityIndicator, ScrollView, Image } from 'react-native';
import { NavbarButton } from '../../components';
import {colors, fonts, images, I18n} from '../../config';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Router } from '../../router';
import { Plant } from '../../database';
import { connect } from 'react-redux';


class HomeView extends Component {

  static route = {
    navigationBar: {
      renderTitle: () => { return (
        <Text style= {styles.headline}>
          <Icon name="tint" style={styles.icon} size={35} />
          Watering my Things
        </Text>
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
      loaded: true
    };
    this.renderPlants = this.renderPlants.bind(this);
    this._fetchData = this._fetchData.bind(this);
    this._categorizePlants = this._categorizePlants.bind(this);
  }

  componentWillMount() {
    this._subscription = this.props.route.getEventEmitter().addListener('onFocus', () => {
      if (this.props.client) {
        this._fetchData();
      }
    });
  }

  componentDidMount() {
    this._fetchData();
  }

  componentWillUnmount() {
    this._subscription.remove();
  }

  _fetchData() {
    this.setState({loaded: false});
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
      loaded: true
    });

  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          {(this.state.dry_plants._cachedRowCount===0 && this.state.healthy_plants._cachedRowCount===0) ?
            <Text>
              {I18n.t('noPlants')}
            </Text>
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
  },
  sectionHeader: {
    flex: 1,
    padding: 10,
    alignSelf: 'stretch',
    alignItems: 'center'
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
  },
  icon: {
    paddingTop:30,
    paddingRight:20,
    marginRight:10,
    color: colors.navText,
  }
});
