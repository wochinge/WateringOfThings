import { CREATE_PLANT, EDIT_PLANT, DELETE_PLANT, UPDATE_PLANTS, SET_PLANT_POSITION } from './actionTypes';

function createPlant(plant) {
  return {
    type: CREATE_PLANT,
    plant: plant
  };
}

function editPlant(plant) {
  return {
    type: EDIT_PLANT,
    plant: plant
  };
}

function deletePlant(plant) {
  return {
    type: DELETE_PLANT,
    toDelete: plant.id,
  };
}

function updatePlants(plants) {
  return {
    type: UPDATE_PLANTS,
    plants: plants
  };
}

function setPlantPosition(angle) {
  return {
    type: SET_PLANT_POSITION,
    angle: angle,
  };
}

export {
  createPlant,
  editPlant,
  deletePlant,
  updatePlants,
  setPlantPosition,
};
