<template>
  <RegularWidget>
    <template #header>
      Information
    </template>
    <template #component>
      <div v-for="layer in sortedEditableLayers" :key="layer.get('name')">
        <div v-if="layer.getVisible()">
          <div class="legend-div">
            <p class="merriweather">{{ layer.get('title') }}</p>
            <q-img v-if="(layer.getSource() instanceof ImageWMS)" class="legend-img" :no-spinner="true"
              :src="legendUrl[layer.get('name')]" height="80px" fit="scale-down" position="0 0"></q-img>
          </div>
          <q-separator />
        </div>
      </div>
    </template>
  </RegularWidget>
</template>

<script setup lang="ts">

import RegularWidget from '../RegularWidget/RegularWidget.vue';
import { useMapStore } from 'src/stores/mapStore/map-store';
import { Ref, ref, onBeforeMount, computed } from 'vue'

import { Layer } from 'ol/layer'
import ImageWMS from 'ol/source/ImageWMS';
import { ILegend } from './types'
import ImageLayer from 'ol/layer/Image';

const mapStore = useMapStore()
const legendUrl: Ref<ILegend> = ref({})
const editableLayers = getEditableLayers()

const legendParameters = {
  'WIDTH': 200,
  'BOXSPACE': 0,
  'TRANSPARENT': true,
  'SYMBOLHEIGHT': 25,
  'LAYERTITLE': false,
  'RULELABEL': false,
  'LAYERFONTSIZE': 0,
  'ITEMFONTSIZE': 0
}

const sortedEditableLayers = computed(() => {
  return sortLayersByIndex(editableLayers)
})



/**
 * Récupération des layers paramétrables
 */
function getEditableLayers(): Layer[] {
  const layers = mapStore.map?.getAllLayers()
  return layers?.filter(layer => layer.get('editable'))!
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
 * Fonction de récupération de l'url des légendes
 * @param layers Liste des couches
 */
function getRasterLegends(layers: Layer[]): ILegend {
  const legends: ILegend = {}
  for (const layer of layers) {
    if (layer.getSource() instanceof ImageWMS) {
      // Définition des variables de requête.
      const imgWms = layer.getSource() as ImageWMS
      const layerName = layer.get('name')

      legends[layerName] = imgWms.getLegendUrl(undefined, legendParameters)!
    }
  }
  return legends
}



/**
 * Fonction de récupération dynamique des légendes
 * @param layers Liste des couches
 */
function getDynamicsRasterLegends(layers: Layer[]): ILegend {
  const legends: ILegend = legendUrl.value
  for (const layer of layers) {
    if (layer.getSource() instanceof ImageWMS) {

      // Définition des variables de requête.
      const imgWms = layer.getSource() as ImageWMS
      const layerName = layer.get('name')

      const olView = mapStore.map?.getView()
      const extent = olView?.calculateExtent()
      const resolution = olView?.getResolution()

      // Définition des paramètres de légende dynamique
      const dynamicLegendParameters = {
        'CRS': 'EPSG:3857',
        'BBOX': extent,
      }

      // Concaténation des paramètres de légende
      const params = { ...legendParameters, ...dynamicLegendParameters }

      legends[layerName] = imgWms.getLegendUrl(resolution, params)!
    }
  }
  return legends
}



/**
 * Fonction de rafraichissement de la légende
 */
function refreshLegend(): void {
  for (const layer of editableLayers) {
    if (layer.get('dynamic') && layer instanceof ImageLayer) {
      layer.getSource()?.on('imageloadend', () => {
        legendUrl.value = getDynamicsRasterLegends(editableLayers.filter(layer => layer.get('dynamic')))
      })
    }
  }
}



/**
 * Initialisation des valeurs de légende
 */
onBeforeMount(() => {
  legendUrl.value = getRasterLegends(editableLayers)
})



refreshLegend()

</script>

<style lang="sass" scoped>
.legend-img
  height: 20%
  width: 20%
  top: -30px

.legend-div
  margin: 10px

</style>
