<template>
  <RegularWidget>
    <template #header>
      Tuning
    </template>
    <template #component>
      <!-- Transitionneur -->
      <transition-group tag="div" name="fade" class="container">

        <!-- Conteneur général + titre -->
        <div v-for="layer in sortedEditableLayers" :key="layer.get('name')">
          <div class="layer-div">
            <p class="merriweather">{{ layer.get('title') }}</p>


            <!-- Controlleur de couche -->
            <div class="layer-control">

              <!-- Checkbox de visibilité -->
              <q-checkbox v-model="layersVisibilities[layer.get('name')]" checked-icon="sym_o_visibility"
                unchecked-icon="sym_o_visibility_off" @click="layer.setVisible(!layer.getVisible())" size="xl" />

              <!-- Slider d'opacité -->
              <q-slider v-model="layersOpacities[layer.get('name')]" :min="0" :max="1" :step="0.01"
                @update:model-value="value => layer.setOpacity(value as number)" :disable="!layer.getVisible()" />

              <!-- Modificateur d'index de couche-->
              <div class="up-down-buttons">
                <q-btn flat square icon="sym_o_keyboard_double_arrow_up" :disable="layer.getZIndex() === maxIndex"
                  @click="setLayerIndex(layer, 1)" />
                <q-btn flat square icon="sym_o_keyboard_double_arrow_down" :disable="layer.getZIndex() === minIndex"
                  @click="setLayerIndex(layer, -1)" />
              </div>

            </div>

            <!-- Accordéon de détail + légende -->
            <q-expansion-item caption="Information et légende" class="merriweather">

              <!-- Description générale de la couche -->
              <q-expansion-item expand-separator switch-toggle-side dense-toggle label="Description"
                class="secondary-text" :content-inset-level="0.5">
                <q-card>
                  <q-card-section class="description-card tertiary-text">
                    {{ layer.get('description') }}
                  </q-card-section>
                </q-card>
              </q-expansion-item>

              <!-- Légende de la couche -->
              <q-expansion-item switch-toggle-side dense-toggle label=" Légende" class="secondary-text"
                :content-inset-level="0.5">
                <q-card>
                  <q-card-section class="description-card tertiary-text">
                    <RasterLegendTool v-if="(layer instanceof ImageLayer)" :layer="layer" />
                    <VectorLegendTool v-if="(layer instanceof VectorTileLayer)" :layer="layer" />
                  </q-card-section>
                </q-card>
              </q-expansion-item>
            </q-expansion-item>

          </div>

          <q-separator />

        </div>
      </transition-group>
    </template>
  </RegularWidget>
</template>

<script setup lang="ts">

import RegularWidget from '../RegularWidget/RegularWidget.vue';
import { useMapStore } from 'src/stores/mapStore/map-store';
import { onMounted, ref, Ref, computed } from 'vue';
import LegendTool from '../LegendTool/LegendTool.vue';

import { ILayersOpacities, ILayersVisibilities } from './types'
import { Layer } from 'ol/layer';
import RasterLegendTool from '../RasterLegendTool/RasterLegendTool.vue';
import ImageLayer from 'ol/layer/Image';
import VectorLegendTool from '../VectorLegendTool/VectorLegendTool.vue';
import VectorTileLayer from 'ol/layer/VectorTile';


const mapStore = useMapStore()
const editableLayers = getEditableLayers()
const IndexList = editableLayers.map(layer => layer.getZIndex()!)
const maxIndex = Math.max(...IndexList)
const minIndex = Math.min(...IndexList)
const layersOpacities: Ref<ILayersOpacities> = ref({})
const layersVisibilities: Ref<ILayersVisibilities> = ref({})

const sortedEditableLayers = computed(() => {
  return sortLayersByIndex(editableLayers)
})



/**
 * Récupération des opacités
 */
function getLayersOpacity(): void {
  editableLayers.forEach(layer => {
    layersOpacities.value[layer.get('name')] = layer.getOpacity() * 100
  })
}



/**
 * Récupération des paramètres de visibilité des couches
 */
function getLayersVisibilities(): void {
  editableLayers.forEach(layer => {
    layersVisibilities.value[layer.get('name')] = layer.isVisible()
  })
}



/**
 * Fonction de tri des couches par leurs valeurs Z-index
 * @param layerlist Liste des couches à trier
 */
function sortLayersByIndex(layerlist: Layer[]): Layer[] {
  layerlist.sort((a, b) => b.getZIndex()! - a.getZIndex()!)
  return layerlist
}



/**
 * Récupération des layers paramétrables
 */
function getEditableLayers(): Layer[] {
  const layers = mapStore.map?.getAllLayers()
  return layers?.filter(layer => layer.get('editable'))!
}



/**
 * Application du Z-index
 * @param layer Couche cible
 * @param index Valeur de Z-index à ajouter
 */
function setLayerIndex(layer: Layer, index: number): void {
  const layerIndex = layer.getZIndex()!
  const targetIndex = layerIndex + (index)

  getLayerAtIndex(targetIndex).forEach(l => l.setZIndex(l.getZIndex()! + index * (-1)))
  layer.setZIndex(targetIndex)
}



/**
 * Récupération des layers pour un Z-index donné
 * @param index valeur de Z-index
 */
function getLayerAtIndex(index: number): Layer[] {
  return editableLayers.filter(layer => layer.getZIndex() === index)
}


onMounted(() => {
  getLayersOpacity()
  getLayersVisibilities()
})

</script>

<style lang="sass" scoped>
.layer-div
  margin: 10px 30px 10px 30px

.description-card
  background-color: $secondary

.layer-control
  position: relative
  display: flex
  align-items: center
  left: -15px

.up-down-buttons
  position: relative
  left: 40px

.fade-move,
.fade-enter-active,
.fade-leave-active
  transition: all 0.4s cubic-bezier(0.55, 0, 0.1, 1)


.fade-enter-from,
.fade-leave-to
  opacity: 0
  transform: scaleY(0.01) translate(30px, 0)

.fade-leave-active
  position: absolute

.secondary-text
  font-size: 0.75rem
  font-weight: 400
  line-height: 1.25rem
  letter-spacing: 0.03333em
  color: rgba(0, 0, 0, 0.54)

.tertiary-text
  font-size: 0.75rem
  font-weight: 400
</style>
