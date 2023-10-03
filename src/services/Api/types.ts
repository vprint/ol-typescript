import { ColorLike } from 'ol/colorlike';

export interface sqlStyles {
  'fill_color': ColorLike | null | undefined,
  'id_typology': number,
  'line_dash': null | [],
  'stroke_color': string,
  'stroke_width': number
}
