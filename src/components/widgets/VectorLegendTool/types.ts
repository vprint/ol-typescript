import { Style } from 'ol/style'

export interface IStateStyle {
  style: Style;
  isActive: boolean;
}
export type IExtendedStyle = Record<number, IStateStyle>
