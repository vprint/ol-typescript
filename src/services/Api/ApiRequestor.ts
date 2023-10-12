import wretch from 'wretch'
import { CONNECTION_PROPERTIES, USER_MESSAGE } from './enum'
import Notifier from '../Notifier/Notifier'
import { SqlStyles, LayersStyles } from './types'
import { Fill, Stroke, Style } from 'ol/style';

/**
 * Gestionnaire de requêtes
 */
class ApiRequestor {

  /**
   * Fonction de requêtage des JSON.
   * @return {JSON} A JSON object.
   */
  public static async getJSON<T>(url: string, errorMsg: string): Promise<T | undefined> {
    const response = wretch(url)
      .get()
      .json<T>()
      .catch(error => {
        console.error(`${error.status}: ${error.message}`)
        Notifier.Push({
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
  * @return {LayersStyles} The array of olStyle.
  */
  static async getStyles(): Promise<LayersStyles> {
    // Requête style
    const result = await this.getJSON<SqlStyles[]>(
      `${CONNECTION_PROPERTIES.FeatureServer.Functions}carto.get_styles/items`,
      USER_MESSAGE.STYLE_ERROR,
    );

    const styleArray: LayersStyles = {}
    if (result) {
      for (const style of result) {
        // Pour chaque nom de style, un array est crée
        if (!styleArray[style.layer_name]) {
          styleArray[style.layer_name] = []
        }
        // Création du style pour chaque id_typology.
        styleArray[style.layer_name][style.id_typology] = new Style({
          stroke: new Stroke({
            color: style.stroke_color || 'transparent',
            width: style.stroke_width || 0,
            lineDash: style.line_dash || undefined,
          }),
          fill: new Fill({
            color: style.fill_color || 'transparent'
          }),
        })
      }
    }
    return styleArray;
  }
}

export default ApiRequestor;
