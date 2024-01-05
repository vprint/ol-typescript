<template>
  <div v-for="( style, styleId ) in vtlStyle" :key="styleId" class="vector-legend">
    <q-btn v-if="typologies" flat square @click="modifyStyle(style, styleId)">
      <q-avatar square size="sm" :style="convertStyleToCss(style.style)" />
      <p class="vector-text-legend">{{ getTypeName(styleId) }}</p>
    </q-btn>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, Ref, ref } from 'vue'
import ApiRequestor from 'src/services/Api/ApiRequestor';

import { ILayersStyles, ITypologies } from 'src/services/Api/types';
import VectorTileLayer from 'ol/layer/VectorTile';
import { Style } from 'ol/style';
import { Layer } from 'ol/layer';
import { IExtendedStyle, IStateStyle } from './types'


const vtlStyle: Ref<IExtendedStyle> = ref({})
const typologies: Ref<ITypologies | undefined> = ref(undefined)
let rawStyles: ILayersStyles | undefined


const props = defineProps<{
  layer: VectorTileLayer
}>();



/**
 * Récupération des légendes
 * @param inputLayer Couche à légender
 */
async function getLegend(inputLayer: Layer): Promise<IExtendedStyle> {
  let stylesObject: IExtendedStyle = {}

  const styles = await ApiRequestor.getStyles()
  const layerStyles = styles![inputLayer.get('name')]

  Object.keys(layerStyles).forEach(key => {
    // Conversion des clés (type = string) vers des types = number
    const keyNumber = parseInt(key, 10)
    stylesObject[keyNumber] = {
      style: layerStyles[keyNumber],
      isActive: true
    }
  })

  return stylesObject
}



/**
 * Conversion des styles OpenLayers vers CSS
 * @param olStyle Style OL en entrée
 */
function convertStyleToCss(olStyle: Style): string {
  const backgroundColor = olStyle.getFill()?.getColor() as string
  const border = olStyle.getStroke()?.getWidth()
  const stroke = olStyle.getStroke()?.getColor()
  const lineDash = olStyle.getStroke()?.getLineDash()
  return `background: ${backgroundColor}; border: ${border}px ${lineDash ? 'dashed' : 'solid'} ${stroke}`
}



/**
 * Récupération du type associé au style
 * @param styleId Id du style
 */
function getTypeName(styleId: number): string | undefined {
  return typologies.value?.find(type => type.id_typology == styleId)?.typology_name

}



/**
 * Modification du style
 * @param olStyle Style à modifier
 * @param styleId_ id du style à modifier
 */
function modifyStyle(olStyle: IStateStyle, styleId_: number): void {
  // Récupération des valeurs de style
  const originalStyle = rawStyles![props.layer.get('name')]
  const dynamicStyle = vtlStyle.value

  // Si le style est actif alors il est rendu transparent
  if (olStyle.isActive) {
    dynamicStyle[styleId_].style.getFill()?.setColor('transparent')
    dynamicStyle[styleId_].style.getStroke()?.setColor('transparent')
    olStyle.isActive = false
  }

  // Si le style est transparent alors le style d'origine est retrouvé puis appliqué
  else {
    const color = originalStyle[styleId_].getFill()!.getColor()
    const stroke = originalStyle[styleId_].getStroke()!.getColor()
    dynamicStyle[styleId_].style.getFill()?.setColor(color)
    dynamicStyle[styleId_].style.getStroke()?.setColor(stroke)
    olStyle.isActive = true
  }
  applyStyles(dynamicStyle)
}



/**
 * Application des style
 * @param styles Styles à appliquer
 */
function applyStyles(styles: IExtendedStyle): void {
  // Récupération du nom du champ de stylisation
  const type_id = props.layer.get('type_id')

  // Application du style dynamique au layer
  const vtl = props.layer as VectorTileLayer
  vtl.setStyle(function (feature): Style {
    return (styles[feature.get(type_id)]).style
  })
}



/**
 * Initialisation des valeurs de légende vectorielle
 */
onBeforeMount(() => {
  async function initializeValues(): Promise<void> {
    vtlStyle.value = await getLegend(props.layer)
    typologies.value = await ApiRequestor.getTypologies()
    rawStyles = await ApiRequestor.getStyles()
  }
  initializeValues()
})
</script>



<style lang="sass" scoped>
.vector-legend
  display: flex

.vector-text-legend
  position: relative
  padding-left: 10px
  top: 8px
</style>
