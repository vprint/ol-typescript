// Interface des tokens
export interface token {
  TOKEN: string
}
export interface tokenSettings {
  [tokenName: string]: token
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
  VISIBLE: boolean;
  URL?: string;
  EDITABLE: boolean;
}
export interface vectorTileLayerSettings {
  [vectorTileLayerName: string]: vectorTileLayerType
}



// Interface des couches vectorielles
export interface vectorLayerType {
  NAME: string;
  ZINDEX: number;
  VISIBLE: boolean;
}
export interface vectorLayerSettings {
  [vectorLayerName: string]: vectorLayerType
}
