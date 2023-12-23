<template>
  <q-img :src="legendUrl" height="80px" fit="scale-down" position="0 0" :no-spinner="true" class="img-legend"></q-img>
</template>

<script setup lang="ts">
import { Layer } from 'ol/layer';
import ImageLayer from 'ol/layer/Image';
import ImageWMS from 'ol/source/ImageWMS';
import { useMapStore } from 'src/stores/mapStore/map-store';
import { onBeforeMount, ref } from 'vue'



const legendUrl = ref('')
const mapStore = useMapStore()
const props = defineProps<{
  layer: Layer
}>();



// Paramètre de légende WMS
const wmsLegendParameters = {
  'WIDTH': 200,
  'BOXSPACE': 0,
  'TRANSPARENT': true,
  'SYMBOLHEIGHT': 25,
  'LAYERTITLE': false,
  'RULELABEL': false,
  'LAYERFONTSIZE': 0,
  'ITEMFONTSIZE': 0
}



/**
 * Récupération des légendes
 * @param wmsLayer Couche à légender
 */
function getLegend(inputLayer: Layer): string {
  // Source WMS
  if (inputLayer.getSource() instanceof ImageWMS) {
    // Définition des variables de requête.
    const imgWms = inputLayer.getSource() as ImageWMS
    return imgWms.getLegendUrl(undefined, wmsLegendParameters)!
  }

  // Source vectorielle
  else {
    return 'https://i.pinimg.com/originals/a2/69/81/a2698150fcb84ecca19b7118a02dc484.gif'
  }
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
    legendUrl.value = getDynamicWMSLegend(wmsLayer)
  })
}



/**
 * Initialisation des valeurs de légende
 */
onBeforeMount(() => {
  legendUrl.value = getLegend(props.layer)
})



/**
 * Rafraichissement des couches dynamiques
 */
if (props.layer.get('dynamic') && props.layer instanceof ImageLayer) {
  refreshLegend(props.layer)
}

</script>

<style lang="sass" scoped>
.img-legend
  top: -15px
</style>
