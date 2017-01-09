import Realm from 'realm';
import RNFetchBlob from 'react-native-fetch-blob';


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
    const destinationPath = `${RNFetchBlob.fs.dirs.DocumentDir}/${id}.jpg`;
    this._moveFileFromTmpToDocuments(imagePath, destinationPath);
    realm.write(() => {
      realm.create('Plant', {
        id: id,
        imagePath: destinationPath
      }, true);
    });
  }

  _moveFileFromTmpToDocuments(source, destination) {
    RNFetchBlob.fs.exists(destination)
    .then((exist) => {
      if (exist) {
        RNFetchBlob.fs.unlink(destination).
        then(() => RNFetchBlob.fs.mv(source, destination));
      } else {
        RNFetchBlob.fs.mv(source, destination);
      }
    });
  }
}

export {
  Microcontroller,
  Plant
};
