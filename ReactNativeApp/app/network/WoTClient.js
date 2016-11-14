const host = 'http://127.0.0.1:8000/microcontroller/';
const header = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
};

export default class WoTClient {

  constructor(controllerID) {
    this.controllerID = controllerID;
    this.url = host + controllerID;
  }

  _createURL(...params) {
    params.unshift(this.url);
    return params.join('/') + '/';
  }

  _toJSON(responseBody) {
    return responseBody.json();
  }

  createController() {
    fetch(this._createURL(), {
      method: 'POST',
      headers: header,
      body: JSON.stringify({
        id: this.controllerID
      })
    });
  }

  getPlants() {
    return fetch(this._createURL('plant'), {
      method: 'GET'
    })
    .then(this._toJSON);
  }

  createPlant(name, pin, position, threshold) {
    fetch(this._createURL('plant/'), {
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
    return fetch(this._createURL('plant', plantID), {
      method: 'GET',
      headers: header
    })
    .then(this._toJSON);
  }

  deletePlant(plantID) {
    fetch(this._createURL('plant', plantID), {
      method: 'DELETE'
    });
  }

  getMoistureValues(plantID) {
    return fetch(this._createURL('plant', plantID, 'moisture'), {
      method: 'GET',
      headers: header
    })
    .then(this._toJSON);
  }

  waterPlant(plantID, amount) {
    fetch(this._createURL('plant', plantID, 'water', amount), {
      method: 'POST'
    });
  }
}
