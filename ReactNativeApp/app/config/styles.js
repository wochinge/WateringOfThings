import { StyleSheet } from 'react-native';

const colors = {
  black: 'black',
  defaultBackground: 'white',
  dimmedBackground: 'rgba(0, 0, 0, 0.5)',
  separator: 'darkgray',
  touchFeedback: 'lightgray',
  defaultText: 'dimgray',
  navbar: 'green',
  navText: 'white',
};

const fonts = {
  listSize: 20,
  defaultFamily: 'Arial',
};

const styles = StyleSheet.create({
  navBarButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems:'center',
    padding: 10
  },
  icon: {
    color: colors.navText
  },
});

export { colors, fonts, styles };
