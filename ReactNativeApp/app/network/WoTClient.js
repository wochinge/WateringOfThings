const host = 'http://127.0.0.1:8000/microcontroller';
const header = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
};

export default class WoTClient {

  constructor(controllerID) {
    this.controllerID = controllerID;
    this.url = host + controllerID + '/';
  }

  createURL(...params) {
    params.unshift(this.url);
    return params.join('/') + '/';
  }

  createController() {
    fetch(this.createURL(), {
      method: 'POST',
      headers: header,
      body: JSON.stringify({
        id: this.controllerID
      })
    });
  }

  getPlants() {
    return fetch(this.createURL('plant'), {
      method: 'GET'
    })
    .then((response) => response.json());
  }

  createPlant(name, pin, position, threshold) {
    fetch(this.createURL('plant/'), {
      method: 'POST',
      headers: header,
      body: JSON.stringify({
        name: name,
        pin: pin,
        position: position,
        moistureThreshold: threshold
      })
    });
  }

  getPlant(plantID) {
    return fetch(this.createURL('plant', plantID), {
      method: 'GET',
      headers: header
    })
    .then((response) => response.json());
  }

  deletePlant(plantID) {
    fetch(this.createURL('plant', plantID), {
      method: 'DELETE'
    });
  }

  getMoistureValues(plantID) {
    return fetch(this.createURL('plant', plantID, 'moisture'), {
      method: 'GET',
      headers: header
    })
    .then((response) => response.json());
  }

  waterPlant(plantID, amount) {
    fetch(this.createURL('plant', plantID, 'water', amount), {
      method: 'POST'
    });
  }
}
