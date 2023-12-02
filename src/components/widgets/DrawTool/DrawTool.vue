<template>
  <div class="drawer no-shadow" style="font-size: 2em;">
    <q-list>

      <q-item v-if="drawMode === 'addFeature'" clickable @click="drawInteraction('Polygon')">
        <q-item-section avatar>
          <q-icon name="sym_o_pentagon" />
        </q-item-section>
        <q-tooltip anchor="center right" self="center left" transition-show="scale" transition-hide="scale" :delay=500
          style="border-radius: 0;">
          Ajouter un polygone
        </q-tooltip>
      </q-item>

      <q-item v-if="drawMode === 'addFeature'" clickable @click="drawInteraction('LineString')">
        <q-item-section avatar>
          <q-icon name="sym_o_timeline" />
        </q-item-section>
        <q-tooltip anchor="center right" self="center left" transition-show="scale" transition-hide="scale" :delay=500
          style="border-radius: 0;">
          Ajouter une ligne
        </q-tooltip>
      </q-item>

      <q-item v-if="drawMode === 'addFeature'" clickable @click="drawInteraction('Circle')">
        <q-item-section avatar>
          <q-icon name="sym_o_circle" />
        </q-item-section>
        <q-tooltip anchor="center right" self="center left" transition-show="scale" transition-hide="scale" :delay=500
          style="border-radius: 0;">
          Ajouter une ligne
        </q-tooltip>
      </q-item>

      <q-separator v-if="drawMode === 'addFeature'" />

      <q-item clickable :disable="disableUndo" @click='undo'>
        <q-item-section avatar>
          <q-icon name="sym_o_undo" />
        </q-item-section>
        <q-tooltip anchor="center right" self="center left" transition-show="scale" transition-hide="scale" :delay=500
          style="border-radius: 0;">
          Annuler
        </q-tooltip>
      </q-item>

      <q-item clickable :disable="disableRedo" @click="redo">
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

      <q-item v-if="drawMode !== 'modifyFeature'" clickable @click="deleteFeature">
        <q-item-section avatar>
          <q-icon name="sym_o_delete" />
        </q-item-section>
        <q-tooltip anchor="center right" self="center left" transition-show="scale" transition-hide="scale" :delay=500
          style="border-radius: 0;">
          Localiser
        </q-tooltip>
      </q-item>

    </q-list>
  </div>
</template>

<script setup lang="ts">

import { onUnmounted, onDeactivated, onActivated, onMounted } from 'vue';
import { ref, toRefs } from 'vue';
import { Draw, Modify } from 'ol/interaction'
import { useMapStore } from 'src/stores/mapStore/map-store';
import { VECTOR_LAYERS_SETTINGS } from 'src/map/layers/enum';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { FeatureLike } from 'ol/Feature';
import RenderFeature from 'ol/render/Feature';
import ApiRequestor from 'src/services/Api/ApiRequestor';
import { easeOut } from 'ol/easing';
import UndoRedo from 'ol-ext/interaction/UndoRedo'
import { Type } from 'ol/geom/Geometry';
import { IDrawMode, IInteraction } from './type'

const props = defineProps<{
  drawMode: IDrawMode,
  featureId: string | number | undefined
}>();

const { drawMode } = toRefs(props);
const mapStore = useMapStore()
const editionLayer = mapStore.getLayerByName(VECTOR_LAYERS_SETTINGS.EDITION_LAYER.NAME) as VectorLayer<VectorSource>
const editionLayerSource = editionLayer.getSource()
const disableUndo = ref(true)
const disableRedo = ref(true)

let fullFeature: FeatureLike | RenderFeature[] | undefined
let draw: Draw
let modifyInteraction: Modify


function drawInteraction(mode: Type): void {
  removeCustomInteraction('modify')

  // Nettoyage de la source
  editionLayerSource?.clear()
  editionLayerSource?.refresh()

  // Ajout de l'interaction de dessin
  draw = new Draw({
    source: editionLayerSource ? editionLayerSource : undefined,
    type: mode,

  })
  mapStore.map?.addInteraction(draw)

  editionLayerSource?.on('addfeature', () => {
    // Suppression de l'interaction
    removeCustomInteraction('draw')
    Modifier()
  })
}

function removeCustomInteraction(interactionType: IInteraction): void {
  mapStore.map?.getInteractions().forEach(interaction => {
    if (interactionType === 'draw') {
      if (interaction instanceof Draw) {
        mapStore.map?.removeInteraction(interaction)
      }
    }
    else {
      if (interaction instanceof Modify) {
        mapStore.map?.removeInteraction(interaction)
      }
    }
  })
}

function deleteFeature(): void {
  editionLayerSource?.clear()
  editionLayerSource?.refresh()
}

function Modifier(): void {
  // Ajout de l'interaction de dessin
  modifyInteraction = new Modify({
    source: editionLayerSource ? editionLayerSource : undefined
  })
  mapStore.map?.addInteraction(modifyInteraction)
}



// Ajout de l'interaction retour/refaire
const undoRedo = new UndoRedo({
  layers: [editionLayer]
})




/**
 * Fonction de récupération de l'entité à éditer
 */
async function initializeFeature(): Promise<void> {
  if (props.drawMode === 'modifyFeature') {
    // Récupération de l'entité non simplifiée et affichage sur le layer d'édition
    fullFeature = await ApiRequestor.getFeatureById(props.featureId as string)
    // @ts-ignore
    fullFeature ? editionLayerSource?.addFeature(fullFeature) : null
  }
  editionLayer.setVisible(true)
}


/**
 * Function de zoom sur l'objet édité
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
 * Gestion du montage du composant
 */
onMounted(() => {
  initializeFeature()
  Modifier()
  mapStore.map?.addInteraction(undoRedo)
  modifyInteraction.on('modifyend', () => {
    disableUndo.value = false
  })
})


/**
 * Gestion du démontage du composant
 */
onUnmounted(() => {
  editionLayer.setVisible(false)
  editionLayerSource?.clear()
  removeCustomInteraction('draw')
  removeCustomInteraction('modify')
});


/**
 * Gestion de la desactivation du composant
 */
onDeactivated(() => {
  modifyInteraction.setActive(false)
  draw.setActive(false)
  editionLayer.setVisible(false)
});


/**
 * Gestion de l'activation du composant
 */
onActivated(() => {
  modifyInteraction.setActive(true)
  draw.setActive(true)
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
