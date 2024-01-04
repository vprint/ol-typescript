<template>
  <q-img :src="(WMSLegendUrl)" height="90px" fit="scale-down" position="0 0" :no-spinner="true" class="img-legend">
  </q-img>
</template>

<script setup lang="ts">

import Layer from 'ol/layer/Layer';
import ImageLayer from 'ol/layer/Image';
import ImageWMS from 'ol/source/ImageWMS';

import { useMapStore } from 'src/stores/mapStore/map-store';
import { onBeforeMount, ref } from 'vue'

const mapStore = useMapStore()
const WMSLegendUrl = ref('')

const props = defineProps<{
  layer: ImageLayer<ImageWMS>
}>();

// Paramètre de légende WMS
const wmsLegendParameters = {
  'WIDTH': 200,
  'BOXSPACE': 0,
  'TRANSPARENT': true,
  'SYMBOLHEIGHT': 25,
  'LAYERTITLE': false,
  'RULELABEL': false,
  'ICONLABELSPACE': 5,
  'LAYERFONTSIZE': 0,
  'ITEMFONTSIZE': 0
}



/**
 * Récupération des légendes
 * @param wmsLayer Couche à légender
 */
async function getLegend(inputLayer: Layer): Promise<string> {
  let legendUrl: string

  // Définition des variables de requête.
  const imgWms = inputLayer.getSource() as ImageWMS
  legendUrl = imgWms.getLegendUrl(undefined, wmsLegendParameters)!

  return legendUrl
}



/**
 * Récupération dynamique des légendes
 * @param wmsLayer Couche WMS
 */
function getDynamicWMSLegend(wmsLayer: Layer): string {
  const imgWms = wmsLayer.getSource() as ImageWMS
  const olView = mapStore.map?.getView()
  const extent = olView?.calculateExtent()
  const resolution = olView?.getResolution()

  // Définition des paramètres de légende dynamique
  const dynamicLegendParameters = {
    'CRS': 'EPSG:3857',
    'BBOX': extent,
  }

  // Concaténation des paramètres de légende
  const params = { ...wmsLegendParameters, ...dynamicLegendParameters }
  return imgWms.getLegendUrl(resolution, params)!
}



/**
 * Fonction de rafraichissement de la légende
 */
function refreshLegend(wmsLayer: ImageLayer<ImageWMS>): void {
  wmsLayer.getSource()?.on('imageloadend', () => {
    WMSLegendUrl.value = getDynamicWMSLegend(wmsLayer)
  })
}



/**
 * Initialisation des valeurs de légende
 */
onBeforeMount(() => {
  async function initializeValues(): Promise<void> {
    WMSLegendUrl.value = await getLegend(props.layer)
  }
  initializeValues()
})



/**
 * Rafraichissement des couches dynamiques
 */
if (props.layer.get('dynamic')) {
  refreshLegend(props.layer)
}

</script>

<style lang="sass" scoped>
.img-legend
  top: -15px
</style>
