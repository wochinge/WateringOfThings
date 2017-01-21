import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, Slider, ScrollView } from 'react-native';
import { images, commonStyles, I18n} from '../../config';
import Button from 'apsl-react-native-button';
import { connect } from 'react-redux';
import autobind from 'autobind-decorator';

@autobind
class WaterPlantView extends Component {

  static route = {
    navigationBar: {
      title: I18n.t('water')
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      amount: 50,
    };
    this.state = {
      imageURL: images.glass1
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <Image style={styles.image} source={this.state.imageURL}/>

          <View style={styles.innerContainer}>
              <View
                style={styles.sliderImages}>
                <Text>
                  less
                </Text>
                <Text>
                  {this.state.amount} ml
                </Text>
                <Text>
                  more
                </Text>
              </View>
              <Slider style={styles.slider}
                onValueChange={(amount) => {
                  let tempImage;
                  if(amount > 180){
                    tempImage = images.glass10;
                  }
                  else if(amount > 160){
                    tempImage = images.glass9;
                  }
                  else if(amount > 140){
                    tempImage = images.glass8;
                  }
                  else if(amount > 120){
                    tempImage = images.glass7;
                  }
                  else if(amount > 100){
                    tempImage = images.glass6;
                  }
                  else if(amount > 80){
                    tempImage = images.glass5;
                  }
                  else if(amount > 60){
                    tempImage = images.glass4;
                  }
                  else if(amount > 40){
                    tempImage = images.glass3;
                  }
                  else if(amount > 20){
                    tempImage = images.glass2;
                  }
                  else if(amount < 20){
                    tempImage = images.glass1;
                  }
                  return(this.setState({
                    amount: amount,
                    imageURL: tempImage
                  })
                  );
                }
              }
                minimumValue={1.0}
                maximumValue={200.0}
                step={1}
                value={100}/>

            <Button style={commonStyles.defaultButton} textStyle={commonStyles.defaultButtonText}
              onPress={() => this.onPressWatering(this.state.amount)}>
              {I18n.t('water')}
            </Button>
          </View>
        </ScrollView>
      </View>
    );
  }

  onPressWatering(amount) {
    this.props.client.waterPlant(this.props.plant.id, amount);
  }
}

WaterPlantView.propTypes = {
  plant: React.PropTypes.object,
  client: React.PropTypes.object.isRequired,
  navigator: React.PropTypes.object,
};

const mapStateToProps = (state) => (
  {
    client: state.controller.client
  }
);

export default connect(mapStateToProps)(WaterPlantView);

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image:{
    height: 167,
    width: 105,
    alignSelf: 'center',
  },
  innerContainer: {
    borderRadius: 10,
    margin: 60,
    flex:1,
  },
  sliderImages: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  slider: {
    width: 250,
  },
});
