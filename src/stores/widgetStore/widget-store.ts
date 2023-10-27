import { defineStore } from 'pinia';
import { toolbarWidgets } from './enum'

export const useWidgetStore = defineStore('widget', {
  state: () => ({
    _widgetList: toolbarWidgets,
    _drawMode: '' as string
  }),
  getters: {
    widgetList: (state) => state._widgetList,
    drawMode: (state) => state._drawMode
  },

  actions: {
    /**
     * Definition du mode de dessin
     * @param mode Mode de dessin
     */
    setDrawMode(mode: string): void {
      this._drawMode = mode
    }
  },
});
