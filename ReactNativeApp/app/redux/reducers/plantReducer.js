import { CREATE_PLANT, EDIT_PLANT, DELETE_PLANT, UPDATE_PLANTS, SET_PLANT_POSITION } from '../actions/actionTypes';
import { Plant } from '../../database';
import { images } from '../../config';

const initialState = {
  plants: [],
};

export default function plant(state = initialState, action = {}) {
  let plants = state.plants.slice();
  switch (action.type) {
  case CREATE_PLANT: {
    const plant = action.plant;
    _setImage(plant);
    plants.push(plant);
    break;
  }
  case EDIT_PLANT: {
    plants = plants.map((p) => _updatePlant(p, action.plant));
    break;
  }
  case DELETE_PLANT: {
    plants = state.plants.filter((p) => _delete(p, action.toDelete));
    break;
  }
  case UPDATE_PLANTS: {
    _initImages(action.plants);
    plants = action.plants;
    break;
  }
  case SET_PLANT_POSITION:
    return {
      ...state,
      positionAngle: action.angle
    };
  default:
    return state;
  }
  return {
    ...state,
    plants: plants
  };
}

function _setImage(plant, oldPlant) {
  if (plant.plantImage && (!oldPlant || plant.plantImage !== oldPlant.plantImage)) {
    plant.plantImage = new Plant().save(plant.id, plant.plantImage);
    plant.plantImage = {uri: plant.plantImage};
  } else if (!plant.plantImage) {
    plant.plantImage = images.defaultPlantImage;
  }
}

function _updatePlant(plant, updated) {
  if (plant.id === updated.id) {
    _setImage(updated, plant);
    updated.latestMoistureValue = plant.latestMoistureValue;
    return updated;
  }
  return plant;
}

function _delete(oldPlant, toDelete) {
  return oldPlant.id !== toDelete;
}

function _initImages(newPlants) {
  newPlants.forEach((plant) => {
    if (!plant.plantImage) {
      const savedImage = new Plant().getPlantImagePath(plant.id);
      plant.plantImage = savedImage ? savedImage : images.defaultPlantImage;
    }
  });
}
