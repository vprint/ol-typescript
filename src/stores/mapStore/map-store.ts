import { defineStore } from 'pinia';
import { Map } from 'ol';
import BaseLayer from 'ol/layer/Base';
import { Interaction, Link } from 'ol/interaction';

export const useMapStore = defineStore('map', {
  state: () => ({
    _map: null as Map | null
  }),

  getters: {
    map: (state) => state._map
  },

  actions: {
    /**
     * Définition de la carte de travail.
     * @param map : Carte de travail
     */
    async setMap(map: Map): Promise<void> {
      this._map = map;
    },

    /**
    * Fonction de recherche de couche.
    * @param name : nom de la couche à retourner
    */
    getLayerByName(name: string): BaseLayer | null {
      return this.$state._map!
        .getLayers()
        .getArray()
        .find((layer: BaseLayer) => layer.get('name') === name)! as BaseLayer;
    },

    /**
     * Fonction de suppression des interaction par nom
     * @param name Nom de l'interaction à supprimer
     */
    removeInteractionsByName(name: string): void {
      this.$state._map?.getInteractions().getArray().forEach(interaction => {
        if (interaction.get('name') === name) {
          this.$state._map?.removeInteraction(interaction)
        }
      })
    }

  }
});
