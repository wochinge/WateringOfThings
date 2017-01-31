import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, Slider, ScrollView } from 'react-native';
import { glassImage, commonStyles, I18n} from '../../config';
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
      amount: 100,
      imageURL: glassImage(Math.floor(100 / 20))
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
                  {I18n.t('less')}
                </Text>
                <Text>
                  {this.state.amount} {I18n.t('ml')}
                </Text>
                <Text>
                  {I18n.t('more')}
                </Text>
              </View>
              <Slider style={styles.slider}
                onValueChange={(amount) =>
                  this.setState({
                    amount: amount,
                    imageURL: glassImage(Math.floor(amount / 20))
                  })
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
