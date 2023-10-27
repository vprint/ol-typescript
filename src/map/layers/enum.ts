import { IBackgroundLayerSettings, IVectorLayerSettings, IVectorTileLayerSettings } from './types'
import { HIDDEN_TOKEN } from './key'

export const BACKGROUND_LAYERS_SETTINGS: IBackgroundLayerSettings = {
  JAWGMAPS_STREETS: {
    NAME: 'Basique',
    URL: 'https://tile.jawg.io/jawg-streets/{z}/{x}/{y}@2x.png?',
    IMG: 'https://tile.jawg.io/jawg-streets/13/6459/3787@2x.png?',
    ATTRIBUTION: [
      '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank" class="jawg-attrib">&copy; <b>Jawg</b>Maps</a> | <a href="https://www.openstreetmap.org/copyright" title="OpenStreetMap is open data licensed under ODbL" target="_blank" class="osm-attrib">&copy; OSM contributors</a>',
    ],
    TOKEN: HIDDEN_TOKEN.JAWGS.TOKEN,
    ZINDEX: 1,
    VISIBLE: true
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
    VISIBLE: false
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

export const VECTOR_TILE_LAYERS_SETTINGS: IVectorTileLayerSettings = {
  CARTOGRAPHY_LAYER: {
    ZINDEX: 3,
    NAME: 'Features',
    VISIBLE: true,
    URL: 'http://localhost:6767/ANGKOR_QUALIF_TILESET',
    EDITABLE: true,
    TYPE_ID: 'id_typology'
  },
}

export const VECTOR_LAYERS_SETTINGS: IVectorLayerSettings = {
  EDITION_LAYER: {
    ZINDEX: 4,
    NAME: 'Edition',
    VISIBLE: true,
  },
}

export const DEFAULT_STYLE = {
  background_color: 'rgba(255,255,255,0.4)',
  stroke_color: 'rgba(51,153,204,1)',
  stroke_width: 1.25,
};
