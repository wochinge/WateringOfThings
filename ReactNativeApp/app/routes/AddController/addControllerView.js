import React, { Component, PropTypes } from 'react';
import { Image, View, Text , StyleSheet } from 'react-native';
import WoTClient from '../../network/WoTClient';
import { Microcontroller } from '../../database/db';
import Button from 'apsl-react-native-button';
import { colors, images, commonStyles, I18n } from '../../config';
import { ValidatedTextInput } from '../../components';
import { Router } from '../../router';
import { connect } from 'react-redux';
import { changeControllerID } from '../../redux/actions';

class AddControllerView extends Component {

  static route = {
    navigationBar: {
      title: I18n.t('addControllerTitle'),
      renderLeft: () => {},
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      controllers: [],
      microcontrollerInput: this.props.controllerID,
      inputMessage: I18n.t('addController'),
      validating: false
    };
    this._validateControllerID = this._validateControllerID.bind(this);
    this._save = this._save.bind(this);
    this._controllerValidationResult = this._controllerValidationResult.bind(this);
  }

  render() {
    return(
      <View
        style={styles.container}>

        <View style={styles.top}>
          <Image
            source={images.startIcon}
            resizeMode='contain'
            style={styles.image}/>
          <Text style={styles.header}>
            {I18n.t('welcome')}
          </Text>
        </View>

        <View style={styles.middle}>
          <Text style={styles.label}>
            {this.state.inputMessage}
          </Text>
          <ValidatedTextInput
            value={this.state.microcontrollerInput}
            placeholder={I18n.t('controllerPlaceholder')}
            valid={this.state.microcontrollerInput != ''}
            onChange={(this._validateControllerID)}
            disableAutoCorrect={true}/>
        </View>

        <View style={styles.bottom}>
          <Button
            style={[commonStyles.defaultButton, styles.item]}
            textStyle={commonStyles.defaultButtonText}
            onPress={this._save}
            isLoading={this.state.validating}
            activityIndicatorColor={colors.buttonText}
            isDisabled={this.state.microcontrollerInput == ''}>
            {I18n.t('save')}
          </Button>
        </View>
      </View>
    );
  }

  _validateControllerID(controllerID) {
    this.setState({
      validating: false,
      microcontrollerInput: controllerID.trim()
    });
  }

  _save() {
    this.setState({validating: true});
    const client = new WoTClient(this.state.microcontrollerInput);
    client.existsController()
    .then(response => this._controllerValidationResult(response.exists));
  }

  _controllerValidationResult(isValid) {
    this.setState({validating: false});
    if (isValid) {
      const id = this.state.microcontrollerInput;
      this.props.onNewValidControllerID(id);
      const db = new Microcontroller();
      db.save(id);
      if (this.props.firstAppStart) {
        this.props.navigator.push(Router.getRoute('tabNavigationLayout'));
      } else {
        this.props.navigation.performAction(({ tabs, stacks }) => {
          tabs('main').jumpToTab('home');
          stacks('home').popToTop();
          stacks('home').replace(Router.getRoute('home'));
        });
      }

    } else {
      this.setState({
        inputMessage: I18n.t('invalidController'),
        microcontrollerInput: ''
      });
    }
  }
}

AddControllerView.propTypes = {
  navigation: PropTypes.object.isRequired,
  navigator: PropTypes.object,
  controllerID: PropTypes.string,
  firstAppStart: PropTypes.bool,
  onNewValidControllerID: PropTypes.func.isRequired
};

const mapStateToProps = (state) => (
  {
    controllerID: state.controller.controllerID
  }
);

const mapDispatchToProps = (dispatch) => {
  return {
    onNewValidControllerID: (id) => {
      dispatch(changeControllerID(id));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddControllerView);

const styles = StyleSheet.create({
  container: {
    margin: 20,
    flexDirection: 'column',
    flex: 1,
    backgroundColor: colors.defaultBackground,
    justifyContent: 'space-between'
  },
  top: {
    flex: 1,
  },
  middle: {
    flex: 1,
    justifyContent: 'center',
  },
  bottom: {
    flex: 1,
    justifyContent: 'center'
  },
  image: {
    alignSelf: 'center',
    height: 100,
    margin: 20
  },
  header: {
    textAlign: 'center',
  },
  label: {
    marginBottom: 20
  },
  item: {
    height: 40,
  }
});
