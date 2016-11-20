import Realm from 'realm';
import { decode } from 'base64-arraybuffer';

const MicrocontrollerSchema = {
  name: 'Microcontroller',
  properties: {
    id:     'string'
  }
};

const PlantSchema = {
  name: 'Plant',
  properties: {
    id:     'int',
    image:  'data'
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

  get(id) {
    return realm.objects('Plant').filtered('id = "${id}"');
  }

  save(id, imageData) {
    realm.write(() => {
      realm.create('Plant', {
        id: id,
        image: decode(imageData)
      });
    });
  }
}

export {
  Microcontroller,
  Plant
};
