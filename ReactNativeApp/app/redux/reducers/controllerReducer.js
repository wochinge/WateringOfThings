import { CHANGE_CONTROLLER_ID } from '../actions/actionTypes';
import { Microcontroller } from '../../database';
import WoTClient from '../../network/WoTClient';

function _getInitialControllerID() {
  const savedControllers = new Microcontroller().get();
  if (savedControllers.length > 0) {
    return savedControllers[0].id;
  } else {
    return '';
  }
}

const controllerID = _getInitialControllerID();

const initialState = {
  controllerID: controllerID,
  client: controllerID ? new WoTClient(controllerID) : null
};

export default function controller(state = initialState, action = {}) {
  console.log(action);
  switch (action.type) {
  case CHANGE_CONTROLLER_ID:
    return {
      ...state,
      controllerID: action.controllerID,
      client: new WoTClient(action.controllerID)
    };
  default:
    return state;
  }
}
