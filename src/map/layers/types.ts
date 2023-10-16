// Interface des tokens
export interface Token {
  TOKEN: string
}
export interface TokenSettings {
  [tokenName: string]: Token
}



// Interface des fonds de plan
export interface BackgroundLayerType {
  NAME: string;
  URL: string;
  IMG: string;
  ATTRIBUTION: string[];
  TOKEN?: string;
  ZINDEX: number;
  VISIBLE: boolean;
}
export interface BackgroundLayerSettings {
  [backgroundLayerName: string]: BackgroundLayerType;
}



// Interface des tuiles vectorielles
export interface VectorTileLayerType {
  NAME: string;
  ZINDEX: number;
  ATTRIBUTION?: string[];
  VISIBLE: boolean;
  URL?: string;
  EDITABLE: boolean;
  TYPE_ID: string;
}
export interface VectorTileLayerSettings {
  [vectorTileLayerName: string]: VectorTileLayerType
}



// Interface des couches vectorielles
export interface VectorLayerType {
  NAME: string;
  ZINDEX: number;
  VISIBLE: boolean;
}
export interface VectorLayerSettings {
  [vectorLayerName: string]: VectorLayerType
}
