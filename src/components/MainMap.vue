<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <div id="map" class="map-container"></div>
    </q-page-container>
    <widget-toolbar />
    <background-tool/>
  </q-layout>
</template>

<script setup lang="ts">
import { Map, View } from 'ol';
import { fromLonLat } from 'ol/proj'
import {MAP_SETTINGS } from '../map/settings/enum'
import MapLayers from '../map/layers/mapLayers'

import { ref, onMounted } from 'vue';
import type { Ref } from 'vue'
import { useMapStore } from '../stores/mapStore/map-store'
import WidgetToolbar from './widgets/WidgetsToolbar/WidgetsToolbar.vue';
import BackgroundTool from './widgets/BackgroundTool.vue';

const map: Ref<Map | undefined> = ref<Map>()
const mapStore = useMapStore();

onMounted(()=>{
  map.value = new Map({
    target: 'map',
    controls: [],
    view: new View({
      center: fromLonLat(MAP_SETTINGS.CENTER),
      zoom: MAP_SETTINGS.ZOOM,
      maxZoom: MAP_SETTINGS.MAXZOOM,
      minZoom: MAP_SETTINGS.MINZOOM,
    })
  });

  mapStore.setMap(map.value)
  new MapLayers(map.value);
})
</script>

<style lang="sass">
@import "ol/ol.css"

#map
  position: absolute
  top: 0
  bottom: 0
  width: 100%
</style>
../stores/mapStore/map-store
