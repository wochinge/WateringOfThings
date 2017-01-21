import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Dimensions } from 'react-native';
import {colors, images, fonts, commonStyles, I18n } from '../../config';
import { NavbarButton, PlantStatus } from '../../components';
import Button from 'apsl-react-native-button';
import { Plant as PlantDB } from '../../database';
import { Router } from '../../router';

export default class PlantView extends Component {

  static route = {

    navigationBar: {
      title(params) {
        return `${params.plant.name}`;
      },
      renderRight: (params) => {
        return (<NavbarButton iconName='pencil' route='plantEdit' routeParams={{
          plant: params.params.plant}}/>);
      }
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      imageURL: images.defaultPlantImage
    };
    this._setImage();
  }

  _setImage() {
    const plantDB = new PlantDB();
    const plantImageURL = plantDB.getPlantImagePath(this.props.plant.id);
    if (plantImageURL) {
      this.state = {
        imageURL: plantImageURL
      };
    }
  }

  render() {
    return (
      <View style={styles.container}>
      <Image style={styles.image} source={this.state.imageURL}/>
        <ScrollView>

            <View style={styles.nameContainer}>
              <Text style={styles.plantName}>
                {this.props.plant.name}
              </Text>
              <PlantStatus plant={this.props.plant} style={styles.moistureText}/>
            </View>

          <View style={styles.innerContainer}>
            <View style={[styles.infos, styles.infosBottom]}>
              <View style={styles.infoView}>
                <Text style={styles.infoValue}>
                  {this.props.plant.latestMoistureValue}
                </Text>
                <Text style={styles.infoText}>
                  Moisture Value
                </Text>
              </View>

              <View style={styles.infoView}>
                <Text style={styles.infoValue}>
                  {this.props.plant.moistureThreshold}
                </Text>
                <Text style={[styles.infoText, styles.infoTextRight]}>
                  Threshold
                </Text>
              </View>

            </View>
            <View style={styles.infos}>
              <View style={styles.infoView}>
                <Text style={styles.infoValue}>
                  {this.props.plant.position}
                </Text>
                <Text style={styles.infoText}>
                Position
                </Text>
              </View>

              <View style={styles.infoView}>
                <Text style={styles.infoValue}>
                  {this.props.plant.pin}
                </Text>
                <Text style={[styles.infoText, styles.infoTextRight]}>
                  Pin
                </Text>
              </View>
            </View>

            <Button style={[commonStyles.defaultButton, styles.button]} textStyle={commonStyles.defaultButtonText}
              onPress={() => this.onPressWater(this.props.plant)}>
              {I18n.t('water')}
            </Button>

          </View>

        </ScrollView>
      </View>
    );
  }

  onPressWater(plant) {
    this.props.navigator.push(Router.getRoute('waterPlant', {plant: plant}));
  }
}

PlantView.propTypes = {
  plant: React.PropTypes.object,
  navigator: React.PropTypes.object,
  route: React.PropTypes.object,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    paddingTop: 30,
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameContainer: {
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: colors.separator,
    flex: 1,
    justifyContent: 'space-around',
    width: Dimensions.get('window').width,
  },
  image:{
    width: Dimensions.get('window').width,
    height: 200,
  },
  moistureText:{
    paddingTop: 10,
  },
  plantName: {
    fontWeight: 'bold',
    color: colors.defaultText,
    fontFamily: fonts.defaultFamily,
    fontSize: 24,
    textAlign: 'center',
  },
  button:{
    margin: 50,
  },
  infos: {
    flex: 1,
    flexWrap: 'wrap',
    alignItems: 'center',
    flexDirection:'row',
  },
  infosBottom: {
    borderBottomWidth: 1,
    borderBottomColor: colors.separator,
    margin: 5,
  },
  infoTextRight: {

  },
  infoText: {
    textAlign: 'center',
    paddingBottom: 20,
  },
  infoValue: {
    fontWeight: 'bold',
    marginRight: 60,
    marginLeft: 60,
  },

});
