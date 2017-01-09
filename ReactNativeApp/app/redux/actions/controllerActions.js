import { CHANGE_CONTROLLER_ID } from './actionTypes';

export default function changeControllerID(id) {
  return {
    type: CHANGE_CONTROLLER_ID,
    controllerID: id
  };
}
