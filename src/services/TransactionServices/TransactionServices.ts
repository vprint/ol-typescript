import { Feature } from 'ol';
import WFS from 'ol/format/WFS';
import { WriteTransactionOptions } from 'ol/format/WFS';
import { CONNECTION_PROPERTIES } from '../Api/enum';
import { TransactionMode } from './type';
import Notifier from '../Notifier/Notifier';


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
 * @returns
 */
function writeTransactionByMode(mode: TransactionMode, feature: Feature | undefined, options: WriteTransactionOptions): Node | undefined {
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
 * Note : à cause d'un problème temporaire de typage pour TransactionResponse, @ts-ignore est utilisé.
 * @param result Resultat au format xml
 * @param mode Mode de mise à jour
 */
function transactionNotify(result: Document | Element | Object | string | undefined, mode: TransactionMode): void {
  const transactionResult = new WFS().readTransactionResponse(result);
  if (transactionResult) {
    switch (mode) {
      case 'insert':
        // @ts-ignore
        if (transactionResult.transactionSummary.totalInserted === 1) {
          Notifier.push({
            mode: 'success',
            text: 'Entité inserée avec succès',
            title: 'Succès'
          })
        } else {
          Notifier.push({
            mode: 'error',
            text: 'Echec de l\'insertion',
            title: 'Echec'
          })
        }
        break;
      case 'update':
        // @ts-ignore
        if (transactionResult.transactionSummary.totalUpdated === 1) {
          Notifier.push({
            mode: 'success',
            text: 'Entité mise à jour avec succès',
            title: 'Succès'
          })
        } else {
          Notifier.push({
            mode: 'error',
            text: 'Echec de la mise à jour',
            title: 'Echec'
          })
        }
        break;
      case 'delete':
        // @ts-ignore
        if (transactionResult.transactionSummary.totalDeleted === 1) {
          Notifier.push({
            mode: 'success',
            text: 'Entité supprimée avec succès',
            title: 'Suppression'
          })
        } else {
          Notifier.push({
            mode: 'error',
            text: 'Echec de la suppression',
            title: 'Echec'
          })
        }
        break;
    }
  }
}


/**
 * Fonction de formatage des features. Prend en entrée une entité, la copie, puis effectue des modifications sur cette copie avant de la renvoyer.
 * @param feature Feature à formater
 * @returns Feature formatée
 */
function formatFeature(feature: Feature | undefined): Feature | undefined {
  const formattedFeature = feature?.clone();
  formattedFeature?.setId(feature?.getId())
  formattedFeature?.setGeometryName('geom');
  formattedFeature?.unset('id');
  return formattedFeature
}

const TransactionServices = {
  writeTransactionByMode,
  getTransactionOptions,
  transactionNotify,
  formatFeature
};

export default TransactionServices
