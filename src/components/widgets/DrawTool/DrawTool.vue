<template>
  <div class="drawer no-shadow" style="font-size: 2em;">
    <q-list>
      <q-item v-if="drawMode === 'addFeature'" clickable @click="addDrawInteraction('Polygon')" :disable="pendingState">
        <q-item-section avatar>
          <q-icon name="sym_o_pentagon" />
        </q-item-section>
        <q-tooltip anchor="center right" self="center left" transition-show="scale" transition-hide="scale" :delay=500
          style="border-radius: 0;">
          Ajouter un polygone
        </q-tooltip>
      </q-item>

      <q-item v-if="drawMode === 'addFeature'" clickable @click="addDrawInteraction('LineString')"
        :disable="pendingState">
        <q-item-section avatar>
          <q-icon name="sym_o_timeline" />
        </q-item-section>
        <q-tooltip anchor="center right" self="center left" transition-show="scale" transition-hide="scale" :delay=500
          style="border-radius: 0;">
          Ajouter une ligne
        </q-tooltip>
      </q-item>

      <q-item v-if="drawMode === 'addFeature'" clickable @click="addDrawInteraction('Circle')" :disable="pendingState">
        <q-item-section avatar>
          <q-icon name="sym_o_circle" />
        </q-item-section>
        <q-tooltip anchor="center right" self="center left" transition-show="scale" transition-hide="scale" :delay=500
          style="border-radius: 0;">
          Ajouter une ligne
        </q-tooltip>
      </q-item>

      <q-separator v-if="drawMode === 'addFeature'" />

      <q-item clickable :disable="disableUndo || pendingState" @click='undo'>
        <q-item-section avatar>
          <q-icon name="sym_o_undo" />
        </q-item-section>
        <q-tooltip anchor="center right" self="center left" transition-show="scale" transition-hide="scale" :delay=500
          style="border-radius: 0;">
          Annuler
        </q-tooltip>
      </q-item>

      <q-item clickable :disable="disableRedo || pendingState" @click="redo">
        <q-item-section avatar>
          <q-icon name="sym_o_redo" />
        </q-item-section>
        <q-tooltip anchor="center right" self="center left" transition-show="scale" transition-hide="scale" :delay=500
          style="border-radius: 0;">
          Refaire
        </q-tooltip>
      </q-item>

      <q-separator />

      <q-item v-if="drawMode === 'modifyFeature'" clickable @click="locate">
        <q-item-section avatar>
          <q-icon name="sym_o_room" />
        </q-item-section>
        <q-tooltip anchor="center right" self="center left" transition-show="scale" transition-hide="scale" :delay=500
          style="border-radius: 0;">
          Localiser
        </q-tooltip>
      </q-item>

      <q-item v-if="drawMode !== 'modifyFeature'" clickable @click="clearFeature" :disable="pendingState">
        <q-item-section avatar>
          <q-icon name="sym_o_delete" />
        </q-item-section>
        <q-tooltip anchor="center right" self="center left" transition-show="scale" transition-hide="scale" :delay=500
          style="border-radius: 0;">
          Effacer
        </q-tooltip>
      </q-item>

      <q-item v-if="pendingState">
        <q-item-section avatar>
          <q-spinner-facebook />
        </q-item-section>
      </q-item>

    </q-list>
  </div>
</template>


<script setup lang="ts">
import { Draw, Modify } from 'ol/interaction';
import { IDrawMode } from './types';
import { useMapStore } from 'src/stores/mapStore/map-store';
import { VECTOR_LAYERS_SETTINGS } from 'src/map/layers/enum';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Type } from 'ol/geom/Geometry';
import { ref, onMounted, onUnmounted, onDeactivated, onActivated } from 'vue';
import UndoRedo from 'ol-ext/interaction/UndoRedo';
import { easeOut } from 'ol/easing';
import ApiRequestor from 'src/services/Api/ApiRequestor';
import { FeatureLike } from 'ol/Feature';
import RenderFeature from 'ol/render/Feature';

const mapStore = useMapStore()
const editionLayer = mapStore.getLayerByName(VECTOR_LAYERS_SETTINGS.EDITION_LAYER.NAME) as VectorLayer<VectorSource>
const editionLayerSource = editionLayer.getSource()
const disableUndo = ref(true)
const disableRedo = ref(true)

const props = defineProps<{
  drawMode: IDrawMode,
  featureId: string | number | undefined,
  pendingState: boolean
}>();

// Ajout de l'interaction retour/refaire
const undoRedo = new UndoRedo({
  layers: [editionLayer]
})
undoRedo.set('name', 'undoRedoInteraction')

let drawInteraction: Draw | undefined
let modifyInteraction: Modify | undefined
let fullFeature: FeatureLike | RenderFeature[] | undefined



/**
 * Fonction d'ajout de géométrie
 * @param drawMode Mode de dessin
 */
function addDrawInteraction(drawMode: Type): void {
  // Suppression des interactions et des features existantes
  clearFeature()

  // Ajout de l'interaction de dessin
  drawInteraction = new Draw({
    source: editionLayerSource ? editionLayerSource : undefined,
    type: drawMode
  });
  drawInteraction.set('name', 'drawInteraction')
  mapStore.map?.addInteraction(drawInteraction);

  // Supression de la fonction de dessin lors d'un ajout de géométrie et ajout de la fonction de modification
  drawInteraction.on('drawend', () => {
    mapStore.removeInteractionsByName('drawInteraction')
    addModifyInteraction()
  })
}



/**
 * Ajout de l'interaction de modification
 */
function addModifyInteraction(): void {
  mapStore.removeInteractionsByName('modifyInteraction')

  // Ajout de l'interaction de dessin
  modifyInteraction = new Modify({
    source: editionLayerSource ? editionLayerSource : undefined
  })
  modifyInteraction.set('name', 'modifyInteraction')
  mapStore.map?.addInteraction(modifyInteraction)

  // Activation de retour arrière
  modifyInteraction.on('modifyend', () => {
    disableUndo.value = false
  })
}



/**
 * Fonction de suppression des features de la couche d'édition
 */
function clearFeature(): void {
  mapStore.removeInteractionsByName('drawInteraction')
  mapStore.removeInteractionsByName('modifyInteraction')
  editionLayerSource?.clear()
  disableUndo.value = true
  disableRedo.value = true
}



/**
 * Fonction annuler/retour
 */
function undo(): void {
  undoRedo.undo()
  disableRedo.value = false
  if (undoRedo.hasUndo() === 0) {
    disableUndo.value = true
  }
}



/**
 * Retour refaire
 */
function redo(): void {
  undoRedo.redo()
  disableUndo.value = false
  if (undoRedo.hasRedo() === 0) {
    disableRedo.value = true
  }
}



/**
 * Function de localisation de l'objet édité
 */
function locate(): void {
  const extent = editionLayerSource?.getFeatures()[0].getGeometry()?.getExtent()
  if (extent) {
    mapStore.map?.getView().fit(extent, {
      padding: [50, 50, 50, 600],
      maxZoom: 17,
      duration: 250,
      easing: easeOut
    })
  }
}



/**
 * Fonction de récupération de l'entité à éditer
 */
async function initializeFeature(): Promise<void> {
  // Récupération de l'entité non simplifiée et affichage sur le layer d'édition
  fullFeature = await ApiRequestor.getFeatureById(props.featureId as string)
  // @ts-ignore
  fullFeature ? editionLayerSource?.addFeature(fullFeature) : null
}



/**
 * Gestion du montage du composant
 */
onMounted(() => {
  editionLayer.setVisible(true)
  if (props.drawMode === 'modifyFeature') {
    initializeFeature()
    addModifyInteraction()
  }
  mapStore.map?.addInteraction(undoRedo)
})



/**
 * Gestion du démontage du composant
 */
onUnmounted(() => {
  mapStore.removeInteractionsByName('drawInteraction')
  mapStore.removeInteractionsByName('modifyInteraction')
  mapStore.removeInteractionsByName('undoRedoInteraction')
  editionLayer.setVisible(false)
  editionLayerSource?.clear()

});



/**
 * Gestion de la desactivation du composant
 */
onDeactivated(() => {
  modifyInteraction?.setActive(false)
  drawInteraction?.setActive(false)
  editionLayer.setVisible(false)
});



/**
 * Gestion de l'activation du composant
 */
onActivated(() => {
  modifyInteraction?.setActive(true)
  drawInteraction?.setActive(true)
  editionLayer.setVisible(true)
});

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
