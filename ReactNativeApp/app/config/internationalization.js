import I18n from 'react-native-i18n';

// Enable fallbacks if you want `en-US` and `en-GB` to fallback to `en`
I18n.fallbacks = true;

I18n.translations = {
  en: {
    homeTab: 'Home',
    addTab: 'Add',
    settingsTab: 'Settings',

    save: 'Save',

    'addControllerTitle': 'Add controller',
    'welcome': 'Welcome to WateringOfPlants!',
    'addController': 'To water your plants, you have to provide the id of a controller.',
    'invalidController': 'The given id was not valid. Please provide an valid id!',
    'controllerPlaceholder': '12dasfsdasd34645',

    edit_plant: 'Edit plant',
    create_plant: 'Create plant',
    name: 'Name',
    namePlaceholder: 'e.g. Basil',
    position: 'Position',
    positionPlaceholder: '0 - 180 degree',
    pin: 'Pin',
    pinPlaceHolder: '0 - 7',
    moistureThreshold: 'Moisture threshold'
  },
  de: {
    homeTab: 'Home',
    addTab: 'Hinzufügen',
    settingsTab: 'Einstellungen',

    save: 'Speichern',

    'addControllerTitle': 'Controller hinzufügen',
    'welcome': 'Willkommen zu WateringOfPlants!',
    'addController': 'Um deine Pflanzen zu gießen, musst du die ID deines Controllers angeben.',
    'invalidController': 'Die gegebene ID war nicht valide!',

    edit_plant: 'Ändere Pflanze',
    create_plant: 'Erstelle Pflanze',
    name: 'Name',
    namePlaceholder: 'z.B. Basilikum',
    position: 'Position',
    positionPlaceholder: '0 - 180 Grad',
    pin: 'Pin',
    moistureThreshold: 'Feuchtigkeitsgrenzwert'

  }
};

export default I18n;
