import { Map } from 'ol';
import TileLayer from 'ol/layer/Tile'
import XYZ from 'ol/source/XYZ';
import { BACKGROUND_LAYERS_SETTINGS, VECTOR_LAYERS_SETTINGS, VECTOR_TILE_LAYERS_SETTINGS, DEFAULT_STYLE, RASTER_LAYERS_SETTINGS } from './enum'
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import { Image as ImageLayer } from 'ol/layer';
import ImageWMS from 'ol/source/ImageWMS';
import MVT from 'ol/format/MVT';
import ApiRequestor from 'src/services/Api/ApiRequestor';
import { Style, Fill, Stroke } from 'ol/style';
import { CONNECTION_PROPERTIES } from 'src/services/Api/enum';
import WMTS from 'ol/source/WMTS.js';
import WMTSTileGrid from 'ol/tilegrid/WMTS.js';
import { getTopLeft, getWidth } from 'ol/extent.js';
import { get as getProjection, ProjectionLike } from 'ol/proj.js';

/**
 * Gestionnaire de couches
 */
class MapLayers {
  private map: Map;
  private projection = getProjection('EPSG:3857')
  private projectionExtent = this.projection?.getExtent();
  private size = getWidth(this.projectionExtent!) / 256;
  private resolutions = new Array(19);
  private matrixIds = new Array(19);

  constructor(map: Map) {
    this.map = map;

    this.addBackgroundLayers();
    this.addVectorLayers();
    this.addVectorTileLayers();
    this.initializeMatrix();
    this.addWMSLayers();
    this.addWMTSLayers();
  }

  /**
   * Initialisation de la grille wmts
   */
  private initializeMatrix(): void {
    console.log('ce message en premier')
    for (let z = 0; z < 19; ++z) {
      this.resolutions[z] = this.size / Math.pow(2, z);
      this.matrixIds[z] = z;
    }
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
            'name': vl.NAME,
            'selectionnable': vl.SELECTIONNABLE
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
    const styles = await ApiRequestor.getStyles();

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
      const layerStyle = (styles ? styles[vtl.NAME] : null)

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
            'title': vtl.TITLE,
            'description': vtl.DESCRIPTION,
            'selectionnable': vtl.SELECTIONNABLE,
            'editable': vtl.EDITABLE,
            'type_id': vtl.TYPE_ID
          },
          preload: Infinity,
          renderMode: 'hybrid',
          // Application des styles. Si layerStyle est null alors le style par defaut est remonté.
          style: function (feature): Style {
            return (layerStyle ? layerStyle[feature.get(vtl.TYPE_ID)] : defaultStyle)
          },
          visible: vtl.VISIBLE
        })
      )

      // Ajout de la couche d'édition
      if (vtl.SELECTIONNABLE) {
        this.map.addLayer(
          new VectorTileLayer({
            source: vectorTileSource,
            zIndex: vtl.ZINDEX + 1,
            properties: {
              'name': `${vtl.NAME}_selection`,
              'selectionnable': false
            },
            preload: Infinity,
            renderMode: 'vector',
            visible: false
          })
        )
      }
    }
  }


  /**
   * Fonction d'ajout des couches WMS
   */
  private addWMSLayers(): void {
    for (const layer in RASTER_LAYERS_SETTINGS) {
      const rl = RASTER_LAYERS_SETTINGS[layer]
      if (rl.MODE === 'wms') {
        this.map.addLayer(
          new ImageLayer({
            source: new ImageWMS({
              url: `${CONNECTION_PROPERTIES.QGIS_SERVER.URL}/wms?`,
              params: { 'LAYERS': `${rl.NAME}` },
              attributions: rl.ATTRIBUTION
            }),
            properties: {
              'name': `${rl.NAME}_wms`,
              'title': rl.TITLE,
              'description': rl.DESCRIPTION,
              'editable': rl.EDITABLE,
              'dynamic': rl.DYNAMIC
            },
            zIndex: rl.ZINDEX,
            visible: rl.VISIBLE
          })
        )
      }
    }
  }

  /**
   * Fonction d'ajout des couches WMTS
   */
  private addWMTSLayers(): void {
    console.log('ce message après')
    for (const layer in RASTER_LAYERS_SETTINGS) {
      const rl = RASTER_LAYERS_SETTINGS[layer]
      if (rl.MODE === 'wmts') {
        this.map.addLayer(
          new TileLayer({
            source: new WMTS({
              attributions: rl.ATTRIBUTION,
              url: `${CONNECTION_PROPERTIES.MAPPROXY_SERVER.URL}/service`,
              layer: 'svf',
              matrixSet: 'webmercator',
              format: 'image/png',
              projection: this.projection as ProjectionLike,
              tileGrid: new WMTSTileGrid({
                origin: getTopLeft(this.projectionExtent!),
                resolutions: this.resolutions,
                matrixIds: this.matrixIds,
              }),
              style: 'default',
              tilePixelRatio: 2
            }),
            properties: {
              'name': `${rl.NAME}_wmts`,
              'title': rl.TITLE,
              'description': rl.DESCRIPTION,
              'editable': rl.EDITABLE,
              'dynamic': rl.DYNAMIC
            },
            zIndex: rl.ZINDEX,
            visible: rl.VISIBLE
          }),
        )
      }
    }
  }
}

export default MapLayers
