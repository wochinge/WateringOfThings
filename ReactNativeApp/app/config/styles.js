import { StyleSheet } from 'react-native';

const colors = {
  black: 'black',
  buttonText: 'white',
  defaultBackground: 'white',
  dimmedBackground: 'rgba(0, 0, 0, 0.5)',
  separator: 'lightgray',
  touchFeedback: 'lightgray',
  defaultText: 'dimgray',
  gridText: 'white',
  navbar: 'green',
  navText: 'white',
  button: 'blue',
  gridTextBackground: 'rgba(0, 0, 0, 0.5)',
  valid: 'green',
  invalid: 'red'
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
  },
  defaultButtonText: {
    fontSize: 18,
    color: colors.buttonText,
  },
  icon: {
    color: colors.navText
  },
});

export { colors, fonts, commonStyles };
