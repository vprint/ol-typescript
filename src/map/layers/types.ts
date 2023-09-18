import Style from 'ol/style/Style';
import VectorSource from 'ol/source/Vector.js';
import VectorTileSource from 'ol/source/VectorTile.js';

export interface token {
  JAWGS: string
}



// Interface des fonds de plan
export interface backgroundLayer {
  NAME: string;
  URL: string;
  IMG: string;
  ATTRIBUTION: string[];
  TOKEN?: string;
  ZINDEX: number;
  VISIBLE: boolean;
}
export interface backgroundLayerSettings {
  [backgroundLayerName: string]: backgroundLayer;
}



// Interface des tuiles vectorielles
export interface vectorTileLayer {
  NAME: string;
  ZINDEX: number;
  ATTRIBUTION?: string[];
  STYLE?: Style;
  VISIBLE: boolean;
  URL?: string;
  LAYERNAME?: string;
  RENDERMODE?: string;
}
export interface vectorTileLayerSettings {
  [vectorTileLayerName: string]: vectorTileLayer
}



// Interface des couches vectorielles
export interface vectorLayer {
  RENDER?: string;
  SOURCE: VectorSource;
  NAME: string;
  ZINDEX: number;
  VISIBLE: boolean;
  STYLE?: Style
}
export interface vectorLayerSettings {
  [vectorLayerName: string]: vectorLayer
}
