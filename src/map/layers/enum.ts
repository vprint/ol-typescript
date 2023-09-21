import { backgroundLayerSettings, vectorLayerSettings, vectorTileLayerSettings } from './types'
import { HIDDEN_TOKEN } from './key'
import { Fill, Stroke, Style } from 'ol/style';
import VectorSource from 'ol/source/Vector.js';

export const BACKGROUND_LAYERS_SETTINGS: backgroundLayerSettings = {
  JAWGMAPS_STREETS: {
    NAME: 'Basique',
    URL: 'https://tile.jawg.io/jawg-streets/{z}/{x}/{y}@2x.png?',
    IMG: 'https://tile.jawg.io/jawg-streets/13/6459/3787@2x.png?',
    ATTRIBUTION: [
      '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank" class="jawg-attrib">&copy; <b>Jawg</b>Maps</a> | <a href="https://www.openstreetmap.org/copyright" title="OpenStreetMap is open data licensed under ODbL" target="_blank" class="osm-attrib">&copy; OSM contributors</a>',
    ],
    TOKEN: HIDDEN_TOKEN.JAWGS.TOKEN,
    ZINDEX: 1,
    VISIBLE: false
  },
  JAWGMAPS_LIGHT: {
    NAME: 'Clair',
    URL: 'https://tile.jawg.io/jawg-light/{z}/{x}/{y}@2x.png?',
    IMG: 'https://tile.jawg.io/jawg-light/13/6459/3787@2x.png?',
    ATTRIBUTION: [
      '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank" class="jawg-attrib">&copy; <b>Jawg</b>Maps</a> | <a href="https://www.openstreetmap.org/copyright" title="OpenStreetMap is open data licensed under ODbL" target="_blank" class="osm-attrib">&copy; OSM contributors</a>',
    ],
    TOKEN: HIDDEN_TOKEN.JAWGS.TOKEN,
    ZINDEX: 1,
    VISIBLE: true
  },
  JAWGMAPS_DARK: {
    NAME: 'Sombre',
    URL: 'https://tile.jawg.io/jawg-dark/{z}/{x}/{y}@2x.png?',
    IMG: 'https://tile.jawg.io/jawg-dark/13/6459/3787@2x.png?',
    ATTRIBUTION: [
      '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank" class="jawg-attrib">&copy; <b>Jawg</b>Maps</a> | <a href="https://www.openstreetmap.org/copyright" title="OpenStreetMap is open data licensed under ODbL" target="_blank" class="osm-attrib">&copy; OSM contributors</a>',
    ],
    TOKEN: HIDDEN_TOKEN.JAWGS.TOKEN,
    ZINDEX: 1,
    VISIBLE: false
  },
  OSM: {
    NAME: 'OSM',
    URL: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png?',
    IMG: 'https://tile.openstreetmap.org/13/6459/3787.png?',
    ATTRIBUTION: [
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    ],
    ZINDEX: 1,
    VISIBLE: false
  },
}

export const VECTOR_TILE_LAYERS_SETTINGS: vectorTileLayerSettings = {
  CARTOGRAPHY_LAYER: {
    ZINDEX: 3,
    NAME: 'Features',
    STYLE: new Style({
      stroke: new Stroke({
        color: 'rgba(220,50,225,1)',
        width: 4,
      }),
      fill: new Fill({
        color: 'rgba(220,50,225,0)',
      }),
    }),
    VISIBLE: true,
    URL: 'http://localhost:6767/ANGKOR_QUALIF_TILESET',
    RENDERMODE: 'hybrid',
    EDITABLE: true
  },
}

export const VECTOR_LAYERS_SETTINGS: vectorLayerSettings = {
  EDITION_LAYER: {
    ZINDEX: 4,
    NAME: 'Edition',
    STYLE: new Style({
      stroke: new Stroke({
        color: 'rgba(220,50,225,1)',
        width: 2,
      }),
      fill: new Fill({
        color: 'rgba(220,50,225,0.4)',
      }),
    }),
    VISIBLE: true,
    SOURCE: new VectorSource()
  },
}
