import { ColorLike } from 'ol/colorlike';
import { Style } from 'ol/style';


export interface ISQLStyles {
  fill_color: ColorLike | null | undefined,
  id_typology: number,
  line_dash: null | [],
  stroke_color: string,
  stroke_width: number,
  layer_name: string
}

export type ILayersStyles = Record<string, Style[]>

export interface ISQLTypologies {
  typology_name: string,
  id_style: number,
  id_typology: number,
  geom_type: string
}

export type ITypologies = ISQLTypologies[]

export interface IWFSResult {
  result: boolean,
  id?: string
}
