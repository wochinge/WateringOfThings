import { I18n } from '../config';

export default class Plant {

  constructor(plant) {
    this.plant = plant;
  }

  healthStatusText() {
    if (this.plant.latestMoistureValue) {
      if (this.plant.latestMoistureValue < this.props.plant.moistureThreshold) {
        return I18n.t('tooDry');
      } else {
        return I18n.t('enoughWater');
      }
    } else {
      return I18n.t('noValues');
    }
  }
}
