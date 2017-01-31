import React, { Component, PropTypes } from 'react';
import { StyleSheet, PanResponder, Text, View, Dimensions } from 'react-native';
import Svg, { Path, Circle, Text as SVGText} from 'react-native-svg';
import autobind from 'autobind-decorator';
import Button from 'apsl-react-native-button';
import { commonStyles, I18n } from '../../config';
import { setPlantPosition } from '../../redux/actions';
import { connect } from 'react-redux';

@autobind
class PositionAssistant extends Component {

  static route = {
    navigationBar: {
      title: 'PositionAssistent',
    }
  }

  constructor(props) {
    super(props);
    const {height, width} = Dimensions.get('window');
    const positionX = width / 2 - 20;
    const positionY = height / 2.5;
    const radius = 0.3 * width;
    this.state = {
      positionX: positionX,
      positionY: positionY,
      radius: radius,
      x: positionX,
      y: positionY - radius,
      angle: 90,
      height: 0.5 * height,
      width: width,
    };
  }

  render() {
    const {height, width, positionX, positionY, radius, x, y} = this.state;
    return (
      <View style={styles.container}>
        <Text>Choose your plant position</Text>
        <Svg width={width} height={height} style={styles.svg}>
          <Path d={`M${positionX - radius} ${positionY} A${radius} ${radius} 0,0,1 ${positionX + radius} ${positionY}`} fill="none" stroke='black' strokeWidth={2.0}/>
          <Circle cx={x} cy={y} r={20} fill='green' {...this._panResponder.panHandlers} />
          <SVGText x={positionX} y={positionY} textAnchor='middle' fontSize='20'>{`${this.state.angle} \xB0`}</SVGText>
        </Svg>
        <Button
          style={commonStyles.defaultButton}
          textStyle={commonStyles.defaultButtonText}
          onPress={this._savePosition}>{I18n.t('save')}</Button>
      </View>
    );
  }

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: this._handlePanResponderMove,
    });
  }

  _handlePanResponderMove({nativeEvent: {pageX, pageY, locationX, locationY}}) {
    let { dx, dy, positionX, positionY, radius } = this.state;
    // Workaround, because positionX/Y are not changing on Android
    if (!dx) {
      this.setState({
        dx: dx = pageX - locationX,
        dy: dy = pageY - locationY,
      });
      // dx = pageX - locationX;
      // dy = pageY - locationY;
    }
    locationX = pageX - dx;
    locationY = pageY - dy;
    // End Workaround

    const deltaY = positionY - locationY;
    const deltaX = positionX - locationX;
    const hypotenuse = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const angle = Math.acos(deltaX / hypotenuse);
    let angleInDegree = Math.round(angle * (180 / Math.PI));
    let newY = positionY;
    let newX = positionX - radius * Math.cos(angle);
    if (locationY <= positionY) {
      newY = positionY - radius * Math.sin(angle);
    } else {
      const onTheRight = locationX >= positionX;
      newX = positionX + (onTheRight ? radius : -radius);
      angleInDegree = onTheRight ? 180 : 0;
    }

    this.setState({
      x: newX,
      y: newY,
      angle: angleInDegree,
    });
    return true;
  }

  _savePosition() {
    this.props.savePosition(this.state.angle);
    this.props.navigator.pop();
  }
}

PositionAssistant.propTypes = {
  navigator: PropTypes.object.isRequired,
  savePosition: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => {
  return {
    savePosition: (angle) => dispatch(setPlantPosition(angle)),
  };
};

export default connect(null, mapDispatchToProps)(PositionAssistant);

const styles = StyleSheet.create({
  container: {
    margin: 20
  },
  svg: {
    marginBottom: 20,
  },
});
