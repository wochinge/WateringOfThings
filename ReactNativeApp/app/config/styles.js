import { StyleSheet } from 'react-native';

const colors = {
  black: 'black',
  buttonText: 'white',
  defaultBackground: 'white',
  dimmedBackground: 'rgba(0, 0, 0, 0.5)',
  separator: 'lightgray',
  touchFeedback: 'lightgray',
  defaultText: 'dimgray',
  noPlantText: 'lightgray',
  gridText: 'white',
  navbar: 'white',
  navText: 'dimgray',
  button: '#303F9F',
  gridTextBackground: 'rgba(50, 50, 50, 0.5)',
  valid: 'green',
  invalid: 'red',
  shadow: 'lightgray',
  selected: 'teal'
};

const fonts = {
  listSize: 20,
  defaultFamily: 'Arial',
};

const commonStyles = StyleSheet.create({
  navBarButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems:'center',
    padding: 10
  },
  defaultButton: {
    backgroundColor: colors.button,
    borderColor: colors.button,
    marginTop: 30,
    marginBottom: 30,
    borderRadius: 1,
  },
  defaultButtonText: {
    fontSize: 18,
    color: colors.buttonText,
  },
  icon: {
    color: colors.navText
  },
  validIcon: {
    flex: 1,
    color: colors.valid
  },
  invalidIcon: {
    flex: 1,
    color: colors.invalid
  }
});

export { colors, fonts, commonStyles };
