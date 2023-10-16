<template>
  <q-page-sticky @click="activated=!activated" position="bottom" class="q-px-md q-py-md ">
    <q-btn fab icon="mdi-layers" class="toolButton" :class="{ active: activated }"/>
  </q-page-sticky>
  <KeepAlive>
    <q-card v-if="activated" square class="regular-card">
      <q-card-section class="regular-section">
        <div class="q-pa-xs column-row-wrapping">
          <div class="column">
            <div v-for="layer in bgl" :key="layer.NAME">
              <div class="col-3 col-sm-10 layer-column">
                <q-btn :ref=layer.NAME round class="layer-roud-button" :class="{ 'active': selectedBackground[layer.NAME] }" @click="changeLayer(layer.NAME)">
                  <q-avatar size=" 70px">
                    <img v-if="layer.TOKEN" :src="`${layer.IMG}access-token=${layer.TOKEN}`">
                    <img v-else :src="`${layer.IMG}`">
                  </q-avatar>
                </q-btn>
              </div>
              <div class="col-3 col-sm-2">
                <p class="q-ma-xs regular-font">{{ layer.NAME }}</p>
              </div>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </KeepAlive>
</template>

<script setup props lang="ts">

import { ref } from 'vue';
import { BACKGROUND_LAYERS_SETTINGS } from 'src/map/layers/enum';
import { useMapStore } from 'src/stores/map-store';

import type { Ref } from 'vue';
import type { BackgroundLayerSettings } from 'src/map/layers/types';

const { mapLayers } = defineProps({
  mapLayers: Object
});

const activated: Ref<boolean> = ref(false);
const bgl: Ref<BackgroundLayerSettings> = ref(BACKGROUND_LAYERS_SETTINGS);
const selectedBackground: Ref<{[key: string]: boolean }> = ref({ OSM: true })

function changeLayer(layer: string) {
  mapLayers.tester(layer)
}

</script>


<style lang="sass" scoped>
.toolButton
  background-color: $secondary
  color: $primary
  &.active
    background-color: $primary
    color: $secondary

.regular-card
  border: 1px solid rgba(0,0,0,0.2)
  position: fixed
  height: 110px
  width: 350px
  bottom:30px
  left: 50%
  transform: translate(-50%, -50%)

.regular-section
  padding: 0
  background-color: $secondary

.regular-font
  text-align: center
  font: 1em"merriweather", sans-serif

.column-row-wrapping
  .column
    background: $secondary
    height: 100px
  .column > div
    background: $secondary
  .column + .column
    margin-top: 1rem

.layer-column
  display: flex
  justify-content: center
  align-items: center

.layer-roud-button
  margin: 3px
  &.active
    margin: 0px
    border: 3px solid $primary
</style>
