import { CREATE_PLANT, EDIT_PLANT, DELETE_PLANT, UPDATE_PLANTS } from './actionTypes';

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

export {
  createPlant,
  editPlant,
  deletePlant,
  updatePlants,
};
