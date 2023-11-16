// Interface des tokens
export interface IToken {
  TOKEN: string
}
export type ITokenSettings = Record<string, IToken>



// Interface des fonds de plan
export interface IBackgroundLayerType {
  NAME: string;
  URL: string;
  IMG: string;
  ATTRIBUTION: string[];
  TOKEN?: string;
  ZINDEX: number;
  VISIBLE: boolean;
}
export type IBackgroundLayerSettings = Record<string, IBackgroundLayerType>



// Interface des tuiles vectorielles
export interface IVectorTileLayerType {
  NAME: string;
  ZINDEX: number;
  ATTRIBUTION?: string[];
  VISIBLE: boolean;
  URL?: string;
  SELECTIONABLE: boolean;
  TYPE_ID: string;
}
export type IVectorTileLayerSettings = Record<string, IVectorTileLayerType>



// Interface des couches vectorielles
export interface IVectorLayerType {
  NAME: string;
  ZINDEX: number;
  VISIBLE: boolean;
}
export type IVectorLayerSettings = Record<string, IVectorLayerType>
