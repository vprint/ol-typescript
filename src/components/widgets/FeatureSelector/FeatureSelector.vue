<template>
  <q-table v-if="features.length > 0" ref="fTable" v-model:selected="selectedFeature" flat bordered square title="Entités"
    :rows="features" :columns="columns" row-key="id_" selection="single" virtual-scroll class="regular-selector"
    :rows-per-page-options="[0]" @selection="onRowSelection">
    <template #bottom>
      <q-space />
      <q-btn flat square color="primary" label="Retour" class="q-ml-sm" @click="back" />
      <q-btn square :disable="selectedFeature.length < 1" color="primary" icon="done" label="Continuer"
        class="merriweather" @click="next" />
    </template>
  </q-table>
  <div v-else>
    <p>
      Cliquer sur une entité pour la sélectionner
    </p>
    <q-btn square flat color="primary" label="Retour" class="q-ml-sm" @click="back" />
  </div>
</template>

<script setup lang="ts">
import { Ref, ref, onDeactivated, onActivated, onUnmounted } from 'vue';
import { QTable, QTableProps } from 'quasar';
import { useMapStore } from 'src/stores/mapStore/map-store';
import { FeatureLike } from 'ol/Feature';
import ApiRequestor from 'src/services/Api/ApiRequestor';
import { MapBrowserEvent } from 'ol';
import { FeatureCollection } from 'geojson';
import { ISelected } from './types';
import GeoJSON from 'ol/format/GeoJSON'
import { easeOut } from 'ol/easing';
import { Stroke, Fill, Style } from 'ol/style';
import VectorTileLayer from 'ol/layer/VectorTile'
import Notifier from 'src/services/Notifier/Notifier';

let typologiesTable: Record<number, string> = {}
let selectedId: string | number | undefined = ''
let selectedIds: (string | number | undefined)[] = [];
let featuresBBox: FeatureCollection | undefined
let fTable: QTable

const mapStore = useMapStore()
const selectionLayer = mapStore.getLayerByName('Features_selection') as VectorTileLayer
const selectedFeature: Ref<FeatureLike[]> = ref([])
const features: Ref<FeatureLike[]> = ref([])
const columns: QTableProps['columns'] = [
  {
    name: 'FeatureType',
    required: true,
    label: 'Type',
    align: 'left',
    field: row => row.properties_.id_typology,
    format: val => typologiesTable[val]
  },
  {
    name: 'id_',
    label: 'ID',
    align: 'left',
    field: 'id_',
  }
]
const selectionStyle = new Style({
  stroke: new Stroke({
    color: 'rgba(220,50,225,1)',
    width: 4,
  }),
  fill: new Fill({
    color: 'rgba(220,50,225,0)',
  }),
})


const emit = defineEmits(['selectorBack', 'selectorNext'])




/**
 * Fonction de récupération et de formatage des typologies
 */
async function formatTypologies(): Promise<void> {
  const typologies = await ApiRequestor.getTypologies()
  if (typologies !== undefined) {
    typologies.forEach(typology => {
      typologiesTable[typology.id_typology] = typology.typology_name
    })
  }
}




/**
 * Fonction de gestion des sélections selon un événement (dans notre cas, il s'agit d'un clic)
 * @param e Type d'événement
 */
const selector = async (e: MapBrowserEvent<UIEvent>): Promise<void> => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  fTable ? fTable.clearSelection() : null
  const mapFeatures = mapStore.map?.getFeaturesAtPixel(e.pixel, {
    hitTolerance: 5,
    layerFilter: (layer) => layer.get('selectionnable') === true
  })
  if (mapFeatures?.length === 0) {
    Notifier.push({
      mode: 'warning',
      text: 'Aucune entité trouvée',
      title: 'Aucune géométrie remontée'
    })
  }
  features.value = mapFeatures ? mapFeatures : []
  selectedIds = mapFeatures ? mapFeatures.map(feature => feature.getId()) : []
  selectionLayer.setVisible(true)
  selectionLayer.setStyle(selectionFeatureStyle)
  featuresBBox = await ApiRequestor.getBBox(selectedIds)
}




/**
 * Fonction de gestion de la sélection.
 * 1) Effectue un zoom sur la géométrie sélectionnée
 * 2) Modifie le style de la feature
 * @param selected Ligne selectionnée
 */
function onRowSelection(selected: ISelected): void {
  if (selected.added) {
    if (featuresBBox !== undefined) {
      selectedId = selected.rows[0].getId()
      const rawExtent = featuresBBox.features.find(feature => feature.id === selectedId)
      const bbox = new GeoJSON().readGeometry(rawExtent?.geometry, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857'
      })
      mapStore.map?.getView().fit(bbox.getExtent(), {
        padding: [50, 50, 50, 600],
        maxZoom: 17,
        duration: 250,
        easing: easeOut
      })
      selectionLayer.setVisible(true)
      selectionLayer.setStyle(selectedFeatureStyle)
    }
  } else {
    selectionLayer.setStyle(selectionFeatureStyle)
  }
}




/**
 * Stylisation pour la sélection générale (1ère sélection)
 * @param feature
 */
function selectionFeatureStyle(feature: FeatureLike): Style | undefined {
  if (selectedIds.includes(feature.getId() as string)) {
    return selectionStyle;
  }
}




/**
 * Stylisation pour la sélection "fine" (2nde sélection)
 * @param feature
 */
function selectedFeatureStyle(feature: FeatureLike): Style | undefined {
  if (selectedId === feature.getId()) {
    return selectionStyle;
  }
}




/**
 * Fonction de retour à l'étape précéddente
 */
function back(): void {
  emit('selectorBack')
}




/**
 * Fonction de passage à l'étape suivante
 */
function next(): void {
  emit('selectorNext', selectedFeature.value[0])
}




/**
 * Gestion de la desactivation du composant
 */
onDeactivated(() => {
  mapStore.map?.un('click', selector);
  selectionLayer.setVisible(false);
});




/**
 * Gestion de l'activation du composant
 */
onActivated(() => {
  mapStore.map?.on('click', selector);
  selectionLayer.setVisible(true);
});




/**
 * Gestion de la destruction du widget
 */
onUnmounted(() => {
  selectedIds = []
  selectedId = ''
  mapStore.map?.un('click', selector);
  selectionLayer.setVisible(false);
  selectionLayer.getSource()?.refresh()
});




formatTypologies()
mapStore.map?.on('click', selector)

</script>

<style lang="sass" scoped>
.regular-selector
  background-color: $secondary
  max-height: 400px
</style>

