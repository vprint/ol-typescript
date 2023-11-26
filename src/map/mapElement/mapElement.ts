import { Attribution } from 'ol/control'
import { ScaleLine } from 'ol/control.js';
import Link from 'ol/interaction/Link'
import { Map } from 'ol';


/**
 * Fonction d'ajout des interaction et des controles de carte
 * @param map Carte
 */
function addControllers(map: Map): void {

  map.addInteraction(
    new Link({
      params: ['x', 'y', 'z', 'r']
    })
  );

  map.addControl(
    new ScaleLine({
      units: 'metric',
      bar: false,
      text: true,
      minWidth: 140
    })
  );

  map.addControl(
    new Attribution({
      collapsible: false,
    })
  );
}

export default addControllers
