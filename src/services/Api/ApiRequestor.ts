import wretch from 'wretch';
import { CONNECTION_PROPERTIES, USER_MESSAGE } from './enum';
import Notifier from '../Notifier/Notifier';
import { ISQLStyles, ILayersStyles, ITypologies, IWFSResult } from './types';
import { Fill, Stroke, Style } from 'ol/style';
import { FeatureCollection } from 'geojson';
import GeoJSON from 'ol/format/GeoJSON';
import { Feature } from 'ol';
import { ITransactionMode } from '../TransactionServices/type';
import TransactionServices from '../TransactionServices/TransactionServices';
import RenderFeature from 'ol/render/Feature';
import { FeatureLike } from 'ol/Feature';




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
  return response
}




/**
 * Fonction de postage des JSON.
 * @return {JSON} A JSON object.
 */
async function postData<T>(url: string, errorMsg: string, data: string): Promise<T | undefined> {
  const response = wretch(url)
    .post(data)
    .text<T>()
    .catch(error => {
      console.error(`${error.status}: ${error.message}`)
      Notifier.push({
        mode: 'error',
        text: errorMsg,
        title: USER_MESSAGE.ERROR
      });
      return undefined
    });
  return response
}




/**
* Requête des styles.
* @return {LayersStyles | undefined} Array of olStyle or undefined.
*/
async function getStyles(): Promise<ILayersStyles | undefined> {
  // Requête style
  const result = await getJSON<ISQLStyles[]>(
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
async function getFeatureById(id: string): Promise<FeatureLike | RenderFeature[] | undefined> {
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




/**
 * Fonction de transaction WFS.
 * Mode possibles : update, delete, insert
 * @param feature Entité de transaction
 * @param mode Mode de transaction
 */
async function wfsTransaction(feature: Feature | undefined, mode: ITransactionMode): Promise<IWFSResult> {
  let transactionResult: IWFSResult

  // Requêtage des paramètres WFS
  const options = TransactionServices.getTransactionOptions()

  // Formatage de la feature et écriture de la transaction
  const wfsFeature = TransactionServices.formatFeature(feature, mode)
  const rawTransaction = TransactionServices.writeTransactionByMode(mode, wfsFeature, options)

  // Formatage en string, envoi de la requête et notification des resultats
  if (rawTransaction) {
    const xmlSerializer = new XMLSerializer();
    const stringTransaction = xmlSerializer.serializeToString(rawTransaction)

    // Envoi de la requête et analyse des résultats (true si transaction réussie, false sinon)
    const wfsRequest = await postData<Document | Element | Object | string>(`${CONNECTION_PROPERTIES.GEOSERVER.URL}/wfs?`, CONNECTION_PROPERTIES.GEOSERVER.ERROR, stringTransaction)
    const resultAnalysis = TransactionServices.transactionNotify(wfsRequest, mode)

    // Gestion de l'insertion
    if (resultAnalysis && mode === 'insert') {
      const insertedId = TransactionServices.getInsertedId(wfsRequest)
      transactionResult = {
        result: resultAnalysis,
        id: insertedId
      }
      return transactionResult
    }

    // Gestion delete et update
    else {
      transactionResult = {
        result: resultAnalysis
      }
      return transactionResult
    }
  }

  // Gestion des erreurs serveurs
  else {
    transactionResult = {
      result: false
    }
    return transactionResult
  }
}

const ApiRequestor = {
  getStyles,
  getTypologies,
  getBBox,
  getFeatureById,
  wfsTransaction
};

export default ApiRequestor;
