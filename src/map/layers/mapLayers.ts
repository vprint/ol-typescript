import { Map } from 'ol';
import { useMapStore } from 'src/stores/map-store';
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

    const mapStore = useMapStore()

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
     * ajout des couhes vectorielles
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

        // Si la variable URL est renseignée alors la VectorTileSource est créée.
        let vectorTileSource: VectorTileSource | null = null
        if (vtl.URL) {
          vectorTileSource = new VectorTileSource({
            format: new MVT({
              idProperty: 'id'
            }),
            url: `${vtl.URL}/{z}/{x}/{y}.pbf`,
            attributions: vtl.ATTRIBUTION
          })
        }

        // Si LayerName est renseigné alors la source est récupérée via la fonction getLayerByName.
        else {
          const layerName = vtl.NAME
          if (typeof layerName === 'string') {
            vectorTileSource = mapStore.getLayerByName(layerName)?.getProperties().source;
          }
        }

        // Ajout de la couche vectorielle tuilée
        if (vectorTileSource) {
          map.addLayer(
            new VectorTileLayer({
              source: vectorTileSource,
              zIndex: vtl.ZINDEX,
              properties: {
                'name': vtl.NAME,
              },
              preload: Infinity,
              renderMode: vtl.RENDERMODE
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
