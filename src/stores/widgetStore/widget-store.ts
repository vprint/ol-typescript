import { defineStore } from 'pinia';
import { toolbarWidgets } from './enum'

export const useWidgetStore = defineStore('widget', {
  state: () => ({
    _widgetList: toolbarWidgets,
    _widget: 0 as number,
    _drawMode: '' as string
  }),
  getters: {
    widgetList: (state) => state._widgetList,
    widget: (state) => state._widget * 2,
    drawMode: (state) => state._drawMode
  },

  actions: {
    /**
     * Définition du widget
     * @param widget Widget
     */
    setWidget(widget: number): void {
      this._widget = widget
    },

    /**
     * Definition du mode de dessin
     * @param mode Mode de dessin
     */
    setDrawMode(mode: string): void {
      this._drawMode = mode
    }
  },
});
