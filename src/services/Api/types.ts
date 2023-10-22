import { ColorLike } from 'ol/colorlike';
import { Style } from 'ol/style';

export interface SqlStyles {
  'fill_color': ColorLike | null | undefined,
  'id_typology': number,
  'line_dash': null | [],
  'stroke_color': string,
  'stroke_width': number,
  'layer_name': string
}
export type LayersStyles = Record<string, Style[]>
