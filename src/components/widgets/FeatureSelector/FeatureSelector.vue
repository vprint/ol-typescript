<template>
  <q-table
    v-model:selected="selectedFeature"
    flat
    bordered
    square
    title="Entités"
    :rows="features"
    :columns="columns"
    row-key="id_"
    selection="single"
    class="shadow-4"
    @selection="onRowSelection">
    <template #bottom>
      <q-space />
      <q-btn
        flat
        square
        color="primary"
        label="Retour"
        class="q-ml-sm"
        @click="back"/>
      <q-btn
        square
        :disable="selectedFeature.length < 1"
        color="primary"
        icon="done"
        label="Continuer"
        class="merriweather"
        @click="next" />
    </template>
  </q-table>
  <!--TODO: Ecrire un double bas de page (pagination + boutons)-->
</template>

<script setup lang="ts">
import { Ref, ref } from 'vue';
import { QTableProps } from 'quasar';
import { useMapStore } from 'src/stores/mapStore/map-store';
import { FeatureLike } from 'ol/Feature';
import { VECTOR_TILE_LAYERS_SETTINGS } from 'src/map/layers/enum';
import ApiRequestor from 'src/services/Api/ApiRequestor';
import { MapBrowserEvent } from 'ol';
import { FeatureCollection } from 'geojson';
import { ISelected } from './types';
import GeoJSON from 'ol/format/GeoJSON'
import { easeOut } from 'ol/easing';

let typologiesTable: Record<number, string> = {}
let selectedIds: string[] = [];
let featuresBBox: FeatureCollection | undefined

const mapStore = useMapStore()
const selectedFeature = ref([])
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

const emit = defineEmits(['selectorBack', 'selectorNext'])

formatTypologies()

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
 * Fonction de gestion des sélections selon un événement (dans notre cas, ils'agit d'un clic)
 * @param e Type d'événement
 */
const selector = async (e: MapBrowserEvent<UIEvent>): Promise<void> => {
  const mapFeatures = mapStore.map?.getFeaturesAtPixel(e.pixel, {
    hitTolerance: 5,
    layerFilter: (layer) => layer.get('name') === VECTOR_TILE_LAYERS_SETTINGS.CARTOGRAPHY_LAYER.NAME
  })
  features.value = mapFeatures ? mapFeatures : []
  selectedIds = mapFeatures ? mapFeatures.map(feature => feature.getId() as string) : []
  featuresBBox = await ApiRequestor.getBBox(selectedIds)
}

// Activation de la selection lors d'un clic
mapStore.map?.on('click', selector)

function onRowSelection(selected: ISelected): void {
  if (featuresBBox !== undefined) {
    const selectedId = selected.rows[0].getId()
    const rawExtent = featuresBBox.features.find(feature => feature.id === selectedId)
    const bbox = new GeoJSON().readGeometry(rawExtent?.geometry, {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:3857'
    })
    mapStore.map?.getView().fit(bbox.getExtent(), {
      padding: [50, 50, 50, 600],
      maxZoom: 17,
      duration: 1000,
      easing: easeOut
    })
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
  emit('selectorNext')
}

</script>
