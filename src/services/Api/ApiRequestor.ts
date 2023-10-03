import wretch from 'wretch'
import { CONNECTION_PROPERTIES, USER_MESSAGE } from './enum'
import Notifier from '../Notifier/Notifier'
import { sqlStyles } from './types'
import { Fill, Stroke, Style } from 'ol/style';

/**
 * Gestionnaire de requêtes
 */
class ApiRequestor {

  /**
   * Fonction de requêtage des JSON.
   * @return {JSON} A JSON object.
   */
  public static async getJSON<T>(url: string, errorMsg: string): Promise<T> {
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
      })
    return response as Promise<T>
  }


  /**
  * Requête des styles.
  * @return {Style} The array of olStyle.
  */
  static async getStyles(): Promise<Style[]> {
    // Requête style
    const result = await this.getJSON<sqlStyles[]>(
      `${CONNECTION_PROPERTIES.FeatureServer.Functions}carto.get_styles/items`,
      USER_MESSAGE.STYLE_ERROR,
    );
    // Traitement des styles retournés sous forme brute
    const styleArray: Style[] = []
    for (const style of result) {
      styleArray[style.id_typology] = new Style({
        stroke: new Stroke({
          color: style.stroke_color || 'transparent',
          width: style.stroke_width || 0,
          lineDash: style.line_dash || undefined,
        }),
        fill: new Fill({
          color: style.fill_color,
        }),
      })
    }
    return styleArray;
  }
}

export default ApiRequestor;
