import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, Slider, ScrollView } from 'react-native';
import { images, commonStyles, I18n} from '../../config';
import Button from 'apsl-react-native-button';
import { PlantStatus } from '../../components';
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
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.innerContainer}>
            <PlantStatus plant={this.props.plant} style={styles.moistureText}/>
              <View
                style={styles.sliderImages}>
                <Image
                  source={images.cactus}
                  style={styles.sliderIcon}/>
                <Text>
                  {this.state.amount} ml
                </Text>
                <Image
                  style={styles.sliderIcon}
                  source={images.lotus}/>
              </View>
              <Slider style={styles.slider}
                onValueChange={(amount) => this.setState({amount})}
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
  innerContainer: {
    borderRadius: 10,
    margin: 60,
    flex:1,
  },
  moistureText:{
    textAlign: 'left',
    padding: 20,
  },
  sliderImages: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  sliderIcon: {
    width: 50,
    height: 50
  },
  slider: {
    width: 250,
  },
});
