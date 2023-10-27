<template>
  <q-page-sticky position="bottom" class="q-px-md q-py-md" @click="open=!open">
    <q-btn fab icon="mdi-layers" class="toolButton" :class="{ active: open }"/>
  </q-page-sticky>
  <KeepAlive>
    <q-card v-if="open" square class="regular-card">
      <q-card-section class="regular-section">
        <div class="q-pa-xs column-row-wrapping">
          <div class="column">
            <div v-for="layer in bgl" :key="layer.NAME">
              <div class="col-3 col-sm-10 layer-column">
                <q-btn :ref=layer.NAME round class="layer-roud-button" :class="{ 'active': selectedBackground[layer.NAME] }" @click="changeLayer(layer.NAME)">
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
import { useMapStore } from 'src/stores/mapStore/map-store'

import type { Ref } from 'vue';
import type { IBackgroundLayerSettings } from 'src/map/layers/types';

const open: Ref<boolean> = ref(false);
const bgl: Ref<IBackgroundLayerSettings> = ref(BACKGROUND_LAYERS_SETTINGS);
const selectedBackground: Ref<Record<string, boolean>> = ref({ Basique: true });
const mapStore = useMapStore()

/**
 * Fonction de changement des fonds de plan
 * @param layer Nom de la couche à afficher
 */
function changeLayer(layer: string): void {
  Object.values(bgl.value).forEach(background => {
    mapStore.getLayerByName(background.NAME)?.setVisible(false)
  })
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
../../stores/mapStore/map-store
