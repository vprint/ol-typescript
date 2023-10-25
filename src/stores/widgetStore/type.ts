import { DefineComponent } from 'vue';

/**
 * interface des widgets
 */
export interface Widget {
  tool: DefineComponent,
  width: string;
  title: string;
  icon: string;
  tooltip: string;
}

export type Widgets = Record<string, Widget>
