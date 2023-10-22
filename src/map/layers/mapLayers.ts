import { Map } from 'ol';
import TileLayer from 'ol/layer/Tile'
import XYZ from 'ol/source/XYZ';
import { BACKGROUND_LAYERS_SETTINGS, VECTOR_LAYERS_SETTINGS, VECTOR_TILE_LAYERS_SETTINGS, DEFAULT_STYLE } from './enum'
import VectorLayer from 'ol/layer/Vector.js';
import VectorSource from 'ol/source/Vector';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile.js';
import MVT from 'ol/format/MVT';
import ApiRequestor from 'src/services/Api/ApiRequestor';
import { Style, Fill, Stroke } from 'ol/style';

/**
 * Gestionnaire de couches
 */
class MapLayers {
  private map;

  constructor(map: Map) {
    this.map = map;

    this.addBackgroundLayers();
    this.addVectorLayers();
    this.addVectorTileLayers();
  }

  /**
   * ajout des fonds de plan
   */
  private addBackgroundLayers(): void {
    for (const layer in BACKGROUND_LAYERS_SETTINGS) {
      const bl = BACKGROUND_LAYERS_SETTINGS[layer]
      this.map.addLayer(
        new TileLayer({
          source: new XYZ({
            url: bl.TOKEN ?
              `${bl.URL}access-token=${bl.TOKEN}` :
              `${bl.URL}`,
            tilePixelRatio: 2,
            attributions: bl.ATTRIBUTION,
          }),
          zIndex: bl.ZINDEX,
          properties: {
            'name': bl.NAME
          },
          visible: bl.VISIBLE
        })
      )
    }
  }

  /**
   * ajout des couches vectorielles
   */
  private addVectorLayers(): void {
    for (const layer in VECTOR_LAYERS_SETTINGS) {
      const vl = VECTOR_LAYERS_SETTINGS[layer]
      this.map.addLayer(
        new VectorLayer({
          source: new VectorSource(),
          zIndex: vl.ZINDEX,
          visible: vl.VISIBLE,
          properties: {
            'name': vl.NAME
          },

        })
      )
    }
  }

  /**
   * ajout des couche tuiles vectorielles
   */
  async addVectorTileLayers(): Promise<void> {

    // Requêtage des styles
    const ArrayStyles = await ApiRequestor.getStyles();

    // Style par défaut
    const defaultStyle: Style = new Style({
      fill: new Fill({
        color: DEFAULT_STYLE.background_color
      }),
      stroke: new Stroke({
        color: DEFAULT_STYLE.stroke_color,
        width: DEFAULT_STYLE.stroke_width
      })
    });

    // Itération sur les couches vectorielles tuilées
    for (const layer in VECTOR_TILE_LAYERS_SETTINGS) {
      const vtl = VECTOR_TILE_LAYERS_SETTINGS[layer]
      const layerStyle = (ArrayStyles ? ArrayStyles[vtl.NAME] : null)

      // Création de la source
      const vectorTileSource = new VectorTileSource({
        format: new MVT({
          idProperty: 'id'
        }),
        url: `${vtl.URL}/{z}/{x}/{y}.pbf`,
        attributions: vtl.ATTRIBUTION,
      })

      // Ajout de la couche vectorielle tuilée
      this.map.addLayer(
        new VectorTileLayer({
          source: vectorTileSource,
          zIndex: vtl.ZINDEX,
          properties: {
            'name': vtl.NAME,
          },
          preload: Infinity,
          renderMode: 'hybrid',
          style: function (feature): Style {
            // Application des styles. Si layerStyle est null alors le style par defaut est remonté.
            return (layerStyle ? layerStyle[feature.get(vtl.TYPE_ID)] : defaultStyle)
          },
          visible: vtl.VISIBLE
        })
      )

      // Ajout de la couche d'édition
      if (vtl.EDITABLE) {
        this.map.addLayer(
          new VectorTileLayer({
            source: vectorTileSource,
            zIndex: vtl.ZINDEX + 1,
            properties: {
              'name': `${vtl.NAME}_edition`
            },
            preload: Infinity,
            renderMode: 'vector',
            visible: false
          })
        )
      }
    }
  }
}

export default MapLayers
