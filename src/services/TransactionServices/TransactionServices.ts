import { Feature } from 'ol';
import WFS from 'ol/format/WFS';
import { WriteTransactionOptions } from 'ol/format/WFS';
import { CONNECTION_PROPERTIES } from '../Api/enum';
import { ITransactionMode } from './type';
import Notifier from '../Notifier/Notifier';
import { Circle } from 'ol/geom';
import { fromCircle } from 'ol/geom/Polygon';


/**
 * Retourne les paramètres de transaction
 * @returns options de transaction
 */
function getTransactionOptions(): WriteTransactionOptions {
  const options: WriteTransactionOptions = {
    featureNS: CONNECTION_PROPERTIES.GEOSERVER.FEATURES.SERVICE_PREFIX,
    srsName: 'EPSG:3857',
    featurePrefix: CONNECTION_PROPERTIES.GEOSERVER.FEATURES.SERVICE_PREFIX,
    featureType: CONNECTION_PROPERTIES.GEOSERVER.FEATURES.NAME,
    nativeElements: []
  }
  return options
}




/**
 * Ecrit la transaction selon un mode défini.
 * @param mode Mode de transaction (insert / update / delete)
 * @param feature Entité de transaction
 * @param options Options de transaction
 * @returns Transaction
 */
function writeTransactionByMode(mode: ITransactionMode, feature: Feature | undefined, options: WriteTransactionOptions): Node | undefined {
  const wfsSerializer = new WFS();

  if (feature) {
    switch (mode) {
      case 'insert':
        return wfsSerializer.writeTransaction(
          [feature],
          [],
          [],
          options
        );
      case 'update':
        return wfsSerializer.writeTransaction(
          [],
          [feature],
          [],
          options
        );
      case 'delete':
        return wfsSerializer.writeTransaction(
          [],
          [],
          [feature],
          options
        );
    }
  } else {
    return undefined
  }
}




/**
 * Fonction de notification des résultats de transaction.
 * @param result Resultat au format xml
 * @param mode Mode de mise à jour
 * @returns Resultat de l'insertion / suppression / mise à jour (forme booléenne)
 */
function transactionNotify(result: Document | Element | Object | string | undefined, mode: ITransactionMode): boolean {
  const transactionResult = new WFS().readTransactionResponse(result);
  if (transactionResult) {
    switch (mode) {
      case 'insert':
        if (transactionResult.transactionSummary.totalInserted === 1) {
          Notifier.push({
            mode: 'success',
            text: 'Entité inserée avec succès',
            title: 'Succès'
          })
          return true
        } else {
          Notifier.push({
            mode: 'error',
            text: 'Echec de l\'insertion',
            title: 'Echec'
          })
          return false
        }
      case 'update':
        if (transactionResult.transactionSummary.totalUpdated === 1) {
          Notifier.push({
            mode: 'success',
            text: 'Entité mise à jour avec succès',
            title: 'Succès'
          })
          return true
        } else {
          Notifier.push({
            mode: 'error',
            text: 'Echec de la mise à jour',
            title: 'Echec'
          })
          return false
        }
      case 'delete':
        if (transactionResult.transactionSummary.totalDeleted === 1) {
          Notifier.push({
            mode: 'success',
            text: 'Entité supprimée avec succès',
            title: 'Suppression'
          })
          return true
        } else {
          Notifier.push({
            mode: 'error',
            text: 'Echec de la suppression',
            title: 'Echec'
          })
          return false
        }
    }
  } else {
    return false
  }
}




/**
 * Fonction de récupération de l'ID
 * @param result Résultat de transaction
 * @returns Id de la nouvelle feature
 */
function getInsertedId(result: Document | Element | Object | string | undefined): string {
  const transactionResult = new WFS().readTransactionResponse(result);
  const RawId = transactionResult?.insertIds[0]
  const parts = RawId?.split('.')!;
  const formattedId = parts[1];
  return formattedId
}




/**
 * Fonction de formatage des features. Prend en entrée une entité, la copie, puis effectue des modifications sur cette copie avant de la renvoyer.
 * @param feature Feature à formater
 * @returns Feature formatée
 */
function formatFeature(feature: Feature | undefined, mode: ITransactionMode): Feature | undefined {
  const formattedFeature = feature?.clone();
  const geom = formattedFeature?.getGeometry()

  // gestion particulière des cercles
  if (geom instanceof Circle) {
    const polygonGeom = fromCircle(geom, 64)
    formattedFeature?.setGeometry(polygonGeom)
  }

  // Création de l'id
  if (mode === 'insert') {
    formattedFeature?.set('geom', formattedFeature.getGeometry())
  } else {
    formattedFeature?.setId(feature?.getId())
    formattedFeature?.setGeometryName('geom');
    formattedFeature?.unset('id');
  }

  return formattedFeature
}




const TransactionServices = {
  writeTransactionByMode,
  getTransactionOptions,
  transactionNotify,
  formatFeature,
  getInsertedId
};

export default TransactionServices
