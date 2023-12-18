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
  TITLE: string;
  DESCRIPTION: string;
  ZINDEX: number;
  ATTRIBUTION?: string[];
  VISIBLE: boolean;
  URL?: string;
  SELECTIONNABLE: boolean;
  TYPE_ID: string;
  EDITABLE: boolean;
}
export type IVectorTileLayerSettings = Record<string, IVectorTileLayerType>



// Interface des couches vectorielles
export interface IVectorLayerType {
  NAME: string;
  ZINDEX: number;
  SELECTIONNABLE: boolean;
  VISIBLE: boolean;
}
export type IVectorLayerSettings = Record<string, IVectorLayerType>



// Interface des couches rasters
export interface IRasterLayerType {
  NAME: string;
  TITLE: string;
  DESCRIPTION: string;
  VISIBLE: boolean;
  ZINDEX: number;
  EDITABLE: boolean;
  DYNAMIC: boolean
}
export type IRasterLayerSettings = Record<string, IRasterLayerType>
