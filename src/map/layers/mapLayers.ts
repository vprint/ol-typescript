import { Map } from 'ol';
import TileLayer from 'ol/layer/Tile'
import XYZ from 'ol/source/XYZ';
import { BACKGROUND_LAYERS_SETTINGS, VECTOR_LAYERS_SETTINGS, VECTOR_TILE_LAYERS_SETTINGS } from './enum'
import VectorLayer from 'ol/layer/Vector.js';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile.js';
import MVT from 'ol/format/MVT';

/**
 * Gestionnaire de couches
 */
class MapLayers {
  constructor(map: Map) {

    /**
     * ajout des fonds de plan
     */
    function addBackgroundLayers(): void {
      for (const layer in BACKGROUND_LAYERS_SETTINGS) {
        const bl = BACKGROUND_LAYERS_SETTINGS[layer]
        map.addLayer(
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
    function addVectorLayers(): void {
      for (const layer in VECTOR_LAYERS_SETTINGS) {
        const vl = VECTOR_LAYERS_SETTINGS[layer]
        map.addLayer(
          new VectorLayer({
            source: vl.SOURCE,
            zIndex: vl.ZINDEX,
            style: vl.STYLE,
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
    function addVectorTileLayers(): void {
      for (const layer in VECTOR_TILE_LAYERS_SETTINGS) {
        const vtl = VECTOR_TILE_LAYERS_SETTINGS[layer]

        // Création de la source
        const vectorTileSource = new VectorTileSource({
          format: new MVT({
            idProperty: 'id'
          }),
          url: `${vtl.URL}/{z}/{x}/{y}.pbf`,
          attributions: vtl.ATTRIBUTION
        })

        // Ajout de la couche vectorielle tuilée
        map.addLayer(
          new VectorTileLayer({
            source: vectorTileSource,
            zIndex: vtl.ZINDEX,
            properties: {
              'name': vtl.NAME,
            },
            preload: Infinity,
            renderMode: vtl.RENDERMODE,
            visible: vtl.VISIBLE
          })
        )

        // Ajout de la couche d'édition
        if (vtl.EDITABLE) {
          map.addLayer(
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

    addBackgroundLayers();
    addVectorLayers();
    addVectorTileLayers();
  }
}

export default MapLayers
