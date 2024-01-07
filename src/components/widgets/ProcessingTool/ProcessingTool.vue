<template>
  <RegularWidget>
    <template #header>
      Processing
    </template>
    <template #component>
      <q-btn square flat label="Buffer" class="merriweather" @click="prepareProcess('buffer')" />
      <q-btn square flat label="Centroid" class="merriweather" @click="prepareProcess('centroid')" />
      <q-btn square flat label="Profile" class="merriweather" @click="prepareProcess('profile')" />

      <FeatureSelector v-if="selectedProcess == 'centroid' || selectedProcess == 'buffer'"
        @selector-next="executeProcesses" @selector-back="selectedProcess = ''" />
      <q-btn v-if="selectedProcess == 'profile'" square flat label="Exécuter" color="primary"
        @click="executeProcesses()" />

      <div>
        <VueApexCharts v-if="initialized" width="100%" :options="apexChartOptions" :series="topographicData.series" />
      </div>
    </template>

    <template #external>
      <DrawTool v-if="selectedProcess == 'profile'" draw-mode="addFeature" />
    </template>
  </RegularWidget>
</template>

<script setup lang="ts">

import 'font-gis/css/font-gis.css'
import Feature, { FeatureLike } from 'ol/Feature';
import FeatureSelector from '../FeatureSelector/FeatureSelector.vue';
import RegularWidget from '../RegularWidget/RegularWidget.vue';
import ApiRequestor from 'src/services/Api/ApiRequestor';
import GeoJSON from 'ol/format/GeoJSON';
import { useMapStore } from 'src/stores/mapStore/map-store';
import { VECTOR_LAYERS_SETTINGS } from 'src/map/layers/enum';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { OAProcessesResult, OAProcessesBuffer, OAProcessesCentroid, OAProcessesProfile, OAProcessesProfileResult } from './types'
import wretch from 'wretch'
import Notifier from 'src/services/Notifier/Notifier';
import { CONNECTION_PROPERTIES, USER_MESSAGE } from '../../../services/Api/enum';
import { onActivated, onDeactivated, onMounted, onUnmounted, ref, Ref } from 'vue';
import { FeatureCollection } from 'geojson';
import DrawTool from '../DrawTool/DrawTool.vue';
import RenderFeature from 'ol/render/Feature';
import VueApexCharts from 'vue3-apexcharts';
import { ApexOptions } from 'apexcharts';



const mapStore = useMapStore()
const selectedProcess = ref('')
const editionLayer = mapStore.getLayerByName(VECTOR_LAYERS_SETTINGS.EDITION_LAYER.NAME) as VectorLayer<VectorSource>
const editionLayerSource = editionLayer.getSource()
let apexChartOptions: ApexOptions = {

  // Définition du type de graphique
  chart: {
    type: 'area'
  },

  // Définition du trait du graphique
  stroke: {
    width: 1,
    colors: ['#8a1946']
  },

  // Paramètres de l'axe x
  xaxis: {
    categories: [],
    labels: {
      show: false
    },
    tooltip: {
      enabled: false
    },
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    }
  },

  // Parmètres de l'axe y
  yaxis: {
    decimalsInFloat: 0,
    title: {
      text: 'Altitude',
      style: {
        fontFamily: 'merriweather'
      }
    },
    labels: {
      style: {
        fontFamily: 'merriweather'
      }
    }
  },

  // Paramètre du marker (point sur la ligne lors du survol)
  markers: {
    colors: '#8a1946',
    hover: {
      size: 5
    }
  },


  // Paramètre des tooltip (fenêtre affichée à coté du point sur la ligne)
  tooltip: {
    x: {
      show: false
    },
    y: {
      formatter: (val) => {
        return `${val.toFixed(2)}m`
      }
    },
    style: {
      fontFamily: 'merriweather'
    },
    marker: {
      fillColors: ['#8a1946']
    }
  },

  dataLabels: {
    enabled: false
  },

  // Dégradé de couleur sous la ligne principale
  fill: {
    type: 'gradient',
    gradient: {
      opacityFrom: 0.5,
      opacityTo: 0.1
    },
    colors: ['#8a1946']
  }
}

const topographicData = ref({
  series: [{
    name: 'Elevation',
    data: [] as number[]
  }],
})

const dynamicChart = ref(apexChartOptions)


const initialized = ref(false)


onMounted(() => {
  editionLayer.setVisible(true)
})



onActivated(() => {
  editionLayer.setVisible(true)
})



onUnmounted(() => {
  editionLayer.setVisible(false)
})



onDeactivated(() => {
  editionLayer.setVisible(false)
})



/**
 * Fonction de récupération de la feature au format textuel.
 * @param feature Tuile vectorielle
 */
async function transformFeature(feature: FeatureLike): Promise<string> {
  const jsonFeature = await ApiRequestor.getFeatureById(feature.getId() as string)
  const stringFeature = convertFeatureToString(jsonFeature)
  return stringFeature
}



function convertFeatureToString(feature: FeatureLike | RenderFeature[] | undefined): string {
  const stringJson = new GeoJSON().writeFeature(feature as Feature, {
    dataProjection: 'EPSG:4326',
    featureProjection: 'EPSG:3857'
  })
  return stringJson
}




function convertGeometryToString(feature: FeatureLike | RenderFeature[] | undefined): string {
  //@ts-ignore
  const geom = feature?.getGeometry()

  const stringGeom = new GeoJSON().writeGeometry(geom, {
    dataProjection: 'EPSG:4326',
    featureProjection: 'EPSG:3857'
  })
  return stringGeom
}


/**
 * Fonction de postage des données.
 * @param url Url de la requête
 * @param errorMsg Message d'erreur en cas d'echec de la requête
 * @param data Donnée à transmettre au serveur
 * @returns reponse au format texte
 */
async function postData<T>(url: string, errorMsg: string, data: string): Promise<T | undefined> {
  const response = wretch(url)
    .headers({
      'Content-Type': 'application/json;charset=UTF-8'
    })
    .options({
      'mode': 'cors'
    })
    .post(data)
    .json<T>()
    .catch(error => {
      console.error(`${error.status}: ${error.message}`)
      Notifier.push({
        mode: 'error',
        text: errorMsg,
        title: USER_MESSAGE.ERROR
      });
      return undefined
    });
  return response
}



/**
 * Fonction d'ajout à la carte de l'entité transformée.
 * @param geojson geoJSON à ajouter
 */
function addFeature(geojson: FeatureCollection | undefined): void {
  const featureOut = new GeoJSON().readFeature(geojson?.features[0], {
    dataProjection: 'EPSG:4326',
    featureProjection: 'EPSG:3857'
  });
  // @ts-ignore
  editionLayerSource?.addFeature(featureOut)
}



/**
 * Execution du processus Buffer.
 * @param feature GeoJSON au format string
 */
async function bufferProcesses(feature: string): Promise<void> {
  const BufferPayload: OAProcessesBuffer = {
    inputs: {
      InputPolygon: {
        format: {
          mediaType: 'application/geo+json'
        },
        value: feature
      },
      BufferDistance: 0.0001
    },
    outputs: {
      Result: {
        format: {
          mediaType: 'application/json'
        },
        transmissionMode: 'value'
      }
    }
  }

  const OAProcessesRequest = await postData<OAProcessesResult>(`${CONNECTION_PROPERTIES.ZOO_SERVER.URL}/Buffer`, CONNECTION_PROPERTIES.ZOO_SERVER.ERROR, JSON.stringify(BufferPayload));
  addFeature(OAProcessesRequest?.Result.value);
}



/**
 * Execution du processus Centroid.
 * @param feature GeoJSON au format string
 */
async function centroidProcesses(feature: string): Promise<void> {
  const CentroidPayload: OAProcessesCentroid = {
    inputs: {
      InputPolygon: {
        format: {
          mediaType: 'application/geo+json'
        },
        value: feature
      },
    },
    outputs: {
      Result: {
        format: {
          mediaType: 'application/json'
        },
        transmissionMode: 'value'
      }
    }
  }

  const OAProcessesRequest = await postData<OAProcessesResult>(`${CONNECTION_PROPERTIES.ZOO_SERVER.URL}/Centroid`, CONNECTION_PROPERTIES.ZOO_SERVER.ERROR, JSON.stringify(CentroidPayload));
  addFeature(OAProcessesRequest?.Result.value);
}



/**
 * Execution du processus Profile.
 * @param feature GeoJSON linéaire au format string
 */
async function profileProcesses(feature: string): Promise<void> {
  const ProfilePayload: OAProcessesProfile = {
    inputs: {
      RasterFile: 'AngkorDem.tif',
      Geometry: {
        type: 'application/geo+json',
        value: feature
      },
    },
    outputs: {
      Profile: {
        format: {
          mediaType: 'application/json'
        },
        transmissionMode: 'value'
      }
    }
  }

  const OAProcessesRequest = await postData<OAProcessesProfileResult>(`${CONNECTION_PROPERTIES.ZOO_SERVER.URL}/GdalExtractProfile`, CONNECTION_PROPERTIES.ZOO_SERVER.ERROR, JSON.stringify(ProfilePayload));
  let i = 0
  topographicData.value.series[0].data = []
  apexChartOptions.xaxis!.categories = []

  for (const coordinate of OAProcessesRequest!.Profile.value.coordinates) {
    topographicData.value.series![0].data.push(parseFloat(coordinate[2].toFixed(2)))
    apexChartOptions.xaxis!.categories.push(i)
    i = i + 1
  }

  initialized.value = true
}



/**
 * Exécution des processus.
 * @param feature Tuile vectorielle sélectionnée
 */
async function executeProcesses(feature?: FeatureLike): Promise<void> {

  let stringFeature = ''

  if (feature) {
    stringFeature = await transformFeature(feature)
  }

  switch (selectedProcess.value) {
    case 'buffer':
      bufferProcesses(stringFeature);
      break;
    case 'centroid':
      centroidProcesses(stringFeature);
      break;
    case 'profile': {
      const lineFeature = editionLayerSource?.getFeatures()
      const stringGeom = convertGeometryToString(lineFeature![0])
      profileProcesses(stringGeom);
    }
  }
}



function prepareProcess(processName: string): void {
  editionLayerSource?.clear()
  selectedProcess.value = processName
}
</script>
