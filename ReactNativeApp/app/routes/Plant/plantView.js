import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import {colors, images, fonts, commonStyles, I18n } from '../../config';
import { NavbarButton } from '../../components';
import Button from 'apsl-react-native-button';
import { Plant as PlantDB } from '../../database';
import { Router } from '../../router';
import { Plant } from '../../models';

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
        <ScrollView>
          <Image style={styles.image} source={this.state.imageURL}/>
          <View style={styles.innerContainer}>
            {this.moistureValue()}
            <Button style={commonStyles.defaultButton} textStyle={commonStyles.defaultButtonText}
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

  moistureValue() {
    const plant = new Plant(this.props.plant);
    return <Text style={styles.moistureText}>{plant.healthStatusText()}</Text>;
  }
}

PlantView.propTypes = {
  plant: React.PropTypes.object,
  navigator: React.PropTypes.object,
  route: React.PropTypes.object,
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    borderRadius: 10,
    marginTop: 10,
    flex:1,
  },
  image:{
    width: 300,
    height: 200,
    borderColor: colors.separator,
    borderWidth: 2,
    alignSelf: 'center',
  },
  moistureText:{
    color: colors.defaultText,
    fontFamily: fonts.defaultFamily,
    fontSize: 20,
    textAlign: 'center',
    paddingTop: 10,
  },
});
