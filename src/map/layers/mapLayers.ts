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
        map.addLayer(
          new TileLayer({
            source: new XYZ({
              url: BACKGROUND_LAYERS_SETTINGS[layer].TOKEN ?
                `${BACKGROUND_LAYERS_SETTINGS[layer].URL}access-token=${BACKGROUND_LAYERS_SETTINGS[layer].TOKEN}` :
                `${BACKGROUND_LAYERS_SETTINGS[layer].URL}`,
              tilePixelRatio: 2,
              attributions: BACKGROUND_LAYERS_SETTINGS[layer].ATTRIBUTION,
            }),
            zIndex: BACKGROUND_LAYERS_SETTINGS[layer].ZINDEX,
            properties: {
              'name': BACKGROUND_LAYERS_SETTINGS[layer].NAME
            },
            visible: BACKGROUND_LAYERS_SETTINGS[layer].VISIBLE
          })
        )
      }
    }

    /**
     * ajout des couhes vectorielles
     */
    function addVectorLayers(): void {
      for (const layer in VECTOR_LAYERS_SETTINGS) {
        map.addLayer(
          new VectorLayer({
            source: VECTOR_LAYERS_SETTINGS[layer].SOURCE,
            zIndex: VECTOR_LAYERS_SETTINGS[layer].ZINDEX,
            style: VECTOR_LAYERS_SETTINGS[layer].STYLE,
            visible: VECTOR_LAYERS_SETTINGS[layer].VISIBLE,
            properties: {
              'name': VECTOR_LAYERS_SETTINGS[layer].NAME
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

        // Si la variable URL est renseignée alors la VectorTileSource est créée.
        let vct: VectorTileSource | null = null
        if (VECTOR_TILE_LAYERS_SETTINGS[layer].URL) {
          vct = new VectorTileSource({
            format: new MVT({
              idProperty: 'id'
            }),
            url: `${VECTOR_TILE_LAYERS_SETTINGS[layer].URL}/{z}/{x}/{y}.pbf`,
            attributions: VECTOR_TILE_LAYERS_SETTINGS[layer].ATTRIBUTION
          })
        }

        // Si LayerName est renseigné alors la source est récupérée via la fonction getLayerByName.
        else {
          const layerName = VECTOR_TILE_LAYERS_SETTINGS[layer].NAME
          if (typeof layerName === 'string') {
            vct = mapStore.getLayerByName(layerName)?.getProperties().source;
          }
        }

        // Ajout de la couche vectorielle tuilée
        if (vct) {
          map.addLayer(
            new VectorTileLayer({
              source: vct,
              zIndex: VECTOR_TILE_LAYERS_SETTINGS[layer].ZINDEX,
              properties: {
                'name': VECTOR_TILE_LAYERS_SETTINGS[layer].NAME,
              },
              preload: Infinity
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
