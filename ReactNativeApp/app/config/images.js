const images = {
  basil: require('../images/Basil.jpg'),
  cactus: require('../images/cactus.png'),
  lotus: require('../images/lotus.png'),
  defaultPlantImage: require('../images/default_plant.jpg'),
  startIcon: require('../images/raindrop.png'),
  glass1: require('../images/Glass1.png'),
  glass2: require('../images/Glass2.png'),
  glass3: require('../images/Glass3.png'),
  glass4: require('../images/Glass4.png'),
  glass5: require('../images/Glass5.png'),
  glass6: require('../images/Glass6.png'),
  glass7: require('../images/Glass7.png'),
  glass8: require('../images/Glass8.png'),
  glass9: require('../images/Glass9.png'),
  glass10: require('../images/Glass10.png'),
};

const glassImages = [
  require('../images/Glass1.png'),
  require('../images/Glass2.png'),
  require('../images/Glass3.png'),
  require('../images/Glass4.png'),
  require('../images/Glass5.png'),
  require('../images/Glass6.png'),
  require('../images/Glass7.png'),
  require('../images/Glass8.png'),
  require('../images/Glass9.png'),
  require('../images/Glass10.png'),
];

function glassImage(number) {
  if (number < 0) {
    number = 0;
  } else if (number >= glassImages.length) {
    number = glassImages.length - 1;
  }
  return glassImages[number];
}

export { images, glassImage };
