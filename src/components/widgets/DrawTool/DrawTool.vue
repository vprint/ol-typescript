<template>
  <div class="drawer no-shadow" style="font-size: 2em;">
    <q-list>

      <q-item v-if="drawMode === 'addFeature'" clickable>
        <q-item-section avatar>
          <q-icon name="sym_o_pentagon" />
        </q-item-section>
        <q-tooltip anchor="center right" self="center left" transition-show="scale" transition-hide="scale" :delay=500
          style="border-radius: 0;">
          Ajouter un polygone
        </q-tooltip>
      </q-item>

      <q-item v-if="drawMode === 'addFeature'" clickable>
        <q-item-section avatar>
          <q-icon name="sym_o_timeline" />
        </q-item-section>
        <q-tooltip anchor="center right" self="center left" transition-show="scale" transition-hide="scale" :delay=500
          style="border-radius: 0;">
          Ajouter une ligne
        </q-tooltip>
      </q-item>

      <q-item clickable @click="drawMode = 'addFeature'">
        <q-item-section avatar>
          <q-icon name="sym_o_undo" />
        </q-item-section>
        <q-tooltip anchor="center right" self="center left" transition-show="scale" transition-hide="scale" :delay=500
          style="border-radius: 0;">
          Annuler
        </q-tooltip>
      </q-item>

      <q-item clickable>
        <q-item-section avatar>
          <q-icon name="sym_o_redo" />
        </q-item-section>
        <q-tooltip anchor="center right" self="center left" transition-show="scale" transition-hide="scale" :delay=500
          style="border-radius: 0;">
          Refaire
        </q-tooltip>
      </q-item>

    </q-list>
  </div>
</template>

<script setup lang="ts">

import { onUnmounted, onDeactivated, onActivated, onMounted } from 'vue';
import { toRefs } from 'vue';
import { Modify } from 'ol/interaction'
import { useMapStore } from 'src/stores/mapStore/map-store';
import { VECTOR_LAYERS_SETTINGS } from 'src/map/layers/enum';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Feature } from 'ol';
import ApiRequestor from 'src/services/Api/ApiRequestor';

const props = defineProps<{
  drawMode: string,
  featureId: string | number | undefined
}>();

const { drawMode } = toRefs(props);
const mapStore = useMapStore()
const editionLayer = mapStore.getLayerByName(VECTOR_LAYERS_SETTINGS.EDITION_LAYER.NAME) as VectorLayer<VectorSource>
const editionLayerSource = editionLayer.getSource()
let fullFeature: Feature | undefined

// Ajout de l'interaction de dessin
const modifyInteraction = new Modify({
  source: editionLayerSource ? editionLayerSource : undefined
})

async function initializeFeature(): Promise<void> {
  // Récupération de l'entité non simplifiée et affichage sur le layer d'édition
  fullFeature = await ApiRequestor.getFeatureById(props.featureId as string)
  fullFeature ? editionLayerSource?.addFeature(fullFeature) : null
  editionLayer.setVisible(true)
}

/**
 * Gestion du montage du composant
 */
onMounted(() => {
  mapStore.map?.addInteraction(modifyInteraction)
})


/**
 * Gestion du démontage du composant
 */
onUnmounted(() => {
  modifyInteraction.setActive(false)
  editionLayer.setVisible(false)
  editionLayerSource?.clear()
});

/**
 * Gestion de la desactivation du composant
 */
onDeactivated(() => {
  modifyInteraction.setActive(false)
  editionLayer.setVisible(false)
});

/**
 * Gestion de l'activation du composant
 */
onActivated(() => {
  modifyInteraction.setActive(true)
  editionLayer.setVisible(true)
});

initializeFeature()

</script>

<style lang="sass" scoped>
.drawer
  border: 1px solid rgba(0,0,0,0.2)
  position: relative
  min-width: 55px
  width: 55px
  color: $primary
  background-color: $secondary
  overflow: hidden
</style>
