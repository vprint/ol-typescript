import Style from 'ol/style/Style';
import VectorSource from 'ol/source/Vector.js';
import { VectorTileRenderType } from 'ol/layer/VectorTile';

export interface token {
  JAWGS: string
}



// Interface des fonds de plan
export interface backgroundLayerType {
  NAME: string;
  URL: string;
  IMG: string;
  ATTRIBUTION: string[];
  TOKEN?: string;
  ZINDEX: number;
  VISIBLE: boolean;
}
export interface backgroundLayerSettings {
  [backgroundLayerName: string]: backgroundLayerType;
}



// Interface des tuiles vectorielles
export interface vectorTileLayerType {
  NAME: string;
  ZINDEX: number;
  ATTRIBUTION?: string[];
  STYLE?: Style;
  VISIBLE: boolean;
  URL?: string;
  LAYERNAME?: string;
  RENDERMODE?: VectorTileRenderType;
}
export interface vectorTileLayerSettings {
  [vectorTileLayerName: string]: vectorTileLayerType
}



// Interface des couches vectorielles
export interface vectorLayerType {
  RENDER?: string;
  SOURCE: VectorSource;
  NAME: string;
  ZINDEX: number;
  VISIBLE: boolean;
  STYLE?: Style
}
export interface vectorLayerSettings {
  [vectorLayerName: string]: vectorLayerType
}
