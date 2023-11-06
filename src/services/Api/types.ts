import { ColorLike } from 'ol/colorlike';
import { Style } from 'ol/style';


export interface ISqlStyles {
  fill_color: ColorLike | null | undefined,
  id_typology: number,
  line_dash: null | [],
  stroke_color: string,
  stroke_width: number,
  layer_name: string
}
export type ILayersStyles = Record<string, Style[]>


export interface ISqlTypologies {
  typology_name: string,
  id_style: number,
  id_typology: number,
  geom_type: string
}

//TODO: Retirer si inutile
export type ITypologys = ISqlTypologies[]
