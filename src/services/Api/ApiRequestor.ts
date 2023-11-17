import wretch from 'wretch';
import { CONNECTION_PROPERTIES, USER_MESSAGE } from './enum';
import Notifier from '../Notifier/Notifier';
import { ISqlStyles, ILayersStyles, ITypologies } from './types';
import { Fill, Stroke, Style } from 'ol/style';
import { FeatureCollection } from 'geojson';
import GeoJSON from 'ol/format/GeoJSON';
import { Feature } from 'ol';


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
      });
      return undefined
    });
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
        })
      });
    });
    return styleArray;
  }
}


/**
 * Fonction de requêtage des typologies
 */
async function getTypologies(): Promise<ITypologies | undefined> {
  // Requête typologies
  const result = await getJSON<ITypologies>(
    `${CONNECTION_PROPERTIES.FeatureServer.Functions}carto.get_typology/items`,
    USER_MESSAGE.TYPOLOGY_ERROR,
  );
  return result
}


/**
 * Fonction de requêtage des bbox
 * @param ids Liste des ID des features
 * @returns
 */
async function getBBox(ids: (string | number | undefined)[]): Promise<FeatureCollection | undefined> {
  const idsAsString = ids.toString();
  const encodedIds = encodeURIComponent(idsAsString);
  const result = await getJSON<FeatureCollection>(
    `${CONNECTION_PROPERTIES.FeatureServer.Functions}carto.get_bbox/items?ids=${encodedIds}`,
    USER_MESSAGE.BBOX_ERROR,
  );
  return result;
}

/**
 * Fonction de requêtage d'entité par Id
 * @param id Id de l'entité
 * @returns Feature
 */
async function getFeatureById(id: string): Promise<Feature | undefined> {
  const result = await getJSON<FeatureCollection>(
    `${CONNECTION_PROPERTIES.FeatureServer.Collections}carto.td_features/items?id=${id}`,
    USER_MESSAGE.FEATURE_ERROR,
  );
  const feature = new GeoJSON().readFeature(result?.features[0], {
    dataProjection: 'EPSG:4326',
    featureProjection: 'EPSG:3857'
  });
  return feature;
}

const ApiRequestor = {
  getStyles,
  getTypologies,
  getBBox,
  getFeatureById
};

export default ApiRequestor;
