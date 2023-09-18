import { defineStore } from 'pinia';
import { Map } from 'ol';
import BaseLayer from 'ol/layer/Base';

export const useMapStore = defineStore('map', {
  state: () => ({
    map: null as Map | null
  }),

  getters: {
    mainMap: (state) => state.map
  },

  actions: {
    defineMap(map: Map) {
      this.map = map;
    },

    getLayerByName(name: string): BaseLayer | null {
      if (this.$state.map != null) {
        return this.$state.map
          .getLayers()
          .getArray()
          .find((layer: BaseLayer) => layer.get('name') === name) as BaseLayer;
      } else {
        return null
      }
    }
  }
});
