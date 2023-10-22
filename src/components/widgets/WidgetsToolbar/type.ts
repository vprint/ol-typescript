/**
 * interface des widgets
 */
export interface Widget {
  width: string;
  title: string;
  icon: string;
  tooltip: string;
}

export type Widgets = Record<string, Widget>
