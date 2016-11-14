import Realm from 'realm';

const MicrocontrollerSchema = {
  name: 'Microcontroller',
  properties: {
    id:     'string'
  }
};

let realm = new Realm({schema: [MicrocontrollerSchema]});

export default class Microcontroller {

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
