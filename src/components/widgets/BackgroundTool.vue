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
                <q-btn :ref=layer.NAME round @click="changeLayer(layer.NAME)" class="layer-roud-button" :class="{ 'active': selectedBackground[layer.NAME] }">
                  <q-avatar size="70px" class="layer-roud-avatar">
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

<script setup lang="ts">

import { ref } from 'vue';
import { BACKGROUND_LAYERS_SETTINGS } from 'src/map/layers/enum';
import { useMapStore } from '../../stores/map-store'

import type { Ref } from 'vue';
import type { BackgroundLayerSettings } from 'src/map/layers/types';

const activated: Ref<boolean> = ref(false);
const bgl: Ref<BackgroundLayerSettings> = ref(BACKGROUND_LAYERS_SETTINGS);
const selectedBackground: Ref<{[key: string]: boolean }> = ref({ Basique: true });
const mapStore = useMapStore()


/**
 * Fonction de changement des fonds de plan
 * @param layer Nom de la couche à afficher
 */
function changeLayer(layer: string) {
  for (const background of Object.values(bgl.value)) {
    mapStore.getLayerByName(background.NAME)?.setVisible(false)
  }
  mapStore.getLayerByName(layer)?.setVisible(true)
  selectedBackground.value = { [layer] : true };
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
  margin: 2px
  box-shadow: 0 0 0 2px transparent
  transition: box-shadow 0.4s ease

  &.active
    box-shadow: 0 0 0 3px $primary

.layer-roud-avatar
  margin: 2px
</style>
