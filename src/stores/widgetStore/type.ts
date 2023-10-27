import { DefineComponent } from 'vue';

/**
 * interface des widgets
 */
export interface IWidget {
  tool: DefineComponent,
  width: string;
  title: string;
  icon: string;
  tooltip: string;
}

export type IWidgets = Record<string, IWidget>
