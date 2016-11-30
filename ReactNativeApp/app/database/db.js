import Realm from 'realm';

const MicrocontrollerSchema = {
  name: 'Microcontroller',
  properties: {
    id:     'string'
  }
};

const PlantSchema = {
  name: 'Plant',
  properties: {
    id:         'int',
    imagePath:  'string'
  }
};

let realm = new Realm({schema: [MicrocontrollerSchema, PlantSchema]});

class Microcontroller {

  get() {
    return realm.objects('Microcontroller');
  }

  save(controllerID) {
    realm.write(() => {
      realm.create('Microcontroller', {
        id: controllerID
      });
    });
  }
}

class Plant {

  getPlantImagePath(id) {
    const plants = realm.objects('Plant').filtered(`id == ${id}`);
    if (plants.length > 0) {
      return {uri: plants[0].imagePath};
    }
    return;
  }

  save(id, imagePath) {
    realm.write(() => {
      realm.create('Plant', {
        id: id,
        imagePath: imagePath
      });
    });
  }
}

export {
  Microcontroller,
  Plant
};
