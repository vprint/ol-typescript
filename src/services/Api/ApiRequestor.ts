import wretch from 'wretch'
import { CONNECTION_PROPERTIES, USER_MESSAGE } from './enum'
import Notifier from '../Notifier/Notifier'
import { ISqlStyles, ILayersStyles, ITypologys } from './types'
import { Fill, Stroke, Style } from 'ol/style';


/**
 * Fonction de requêtage des JSON.
 * @return {JSON} A JSON object.
 */
async function getJSON<T>(url: string, errorMsg: string): Promise<T | undefined> {
  const response = wretch(url)
    .get()
    .json<T>()
    .catch(error => {
      console.error(`${error.status}: ${error.message}`)
      Notifier.push({
        mode: 'error',
        text: errorMsg,
        title: USER_MESSAGE.ERROR
      })
      return undefined
    })
  return response as Promise<T | undefined>
}


/**
* Requête des styles.
* @return {LayersStyles | undefined} Array of olStyle or undefined.
*/
async function getStyles(): Promise<ILayersStyles | undefined> {
  // Requête style
  const result = await getJSON<ISqlStyles[]>(
    `${CONNECTION_PROPERTIES.FeatureServer.Functions}carto.get_styles/items`,
    USER_MESSAGE.STYLE_ERROR,
  );

  const styleArray: ILayersStyles = {}

  if (result === undefined) {
    return undefined
  }
  else {
    result.forEach(style => {
      // Création d'un array pour chaque couche différente de la réponse
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!styleArray[style.layer_name]) {
        styleArray[style.layer_name] = []
      }

      // Création du style pour chaque id_typology.
      styleArray[style.layer_name][style.id_typology] = new Style({
        stroke: new Stroke({
          color: style.stroke_color || 'transparent',
          width: style.stroke_width || 0,
          lineDash: style.line_dash ?? undefined,
        }),
        fill: new Fill({
          color: style.fill_color ?? 'transparent'
        }),
      })
    })
    return styleArray;
  }
}

/**
 * Fonction de requêtage des typologies
 */
async function getTypologys(): Promise<ITypologys | undefined> {
  // Requête typologies
  const result = await getJSON<ITypologys>(
    `${CONNECTION_PROPERTIES.FeatureServer.Functions}carto.get_typology/items`,
    USER_MESSAGE.TYPOLOGY_ERROR,
  );
  return result !== undefined ? result : undefined
}

const ApiRequestor = {
  getStyles,
  getTypologys
};

export default ApiRequestor;
