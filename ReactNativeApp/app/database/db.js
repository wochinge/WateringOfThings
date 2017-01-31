import Realm from 'realm';

const MicrocontrollerSchema = {
  name: 'Microcontroller',
  properties: {
    id:     'string'
  }
};

const PlantSchema = {
  name: 'Plant',
  primaryKey: 'id',
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
    let allControllers = realm.objects('Microcontroller');
    realm.write(() => {
      realm.delete(allControllers); // at the moment only one controller is supported
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
      }, true);
    });
    return imagePath;
  }
}

export {
  Microcontroller,
  Plant
};
