<template>
  <div class="drawer no-shadow" style="font-size: 2em;">
    <q-list>

      <q-item
        v-if="lolDrawMode==='addFeature'"
        clickable>
        <q-item-section avatar>
          <q-icon name="sym_o_pentagon" />
        </q-item-section>
        <q-tooltip
          anchor="center right"
          self="center left"
          transition-show="scale"
          transition-hide="scale"
          :delay=500
          style="border-radius: 0;">
          Ajouter un polygone
        </q-tooltip>
      </q-item>

      <q-item
      v-if="drawMode==='addFeature'"
      clickable>
        <q-item-section avatar>
          <q-icon name="sym_o_timeline" />
        </q-item-section>
        <q-tooltip
          anchor="center right"
          self="center left"
          transition-show="scale"
          transition-hide="scale"
          :delay=500
          style="border-radius: 0;">
          Ajouter une ligne
        </q-tooltip>
      </q-item>

      <q-item
      clickable
      @click="drawMode='addFeature'">
        <q-item-section avatar>
          <q-icon name="sym_o_undo" />
        </q-item-section>
        <q-tooltip
          anchor="center right"
          self="center left"
          transition-show="scale"
          transition-hide="scale"
          :delay=500
          style="border-radius: 0;">
          Annuler
        </q-tooltip>
      </q-item>

      <q-item clickable>
        <q-item-section avatar>
          <q-icon name="sym_o_redo" />
        </q-item-section>
        <q-tooltip
          anchor="center right"
          self="center left"
          transition-show="scale"
          transition-hide="scale"
          :delay=500
          style="border-radius: 0;">
          Refaire
        </q-tooltip>
      </q-item>

    </q-list>
  </div>
</template>

<script setup lang="ts">

import { toRefs } from 'vue';

const props = defineProps<{
  drawMode: string,
}>();

const { drawMode } = toRefs(props);

console.log(props.drawMode)

</script>

<style lang="sass" scoped>
.drawer
  border: 1px solid rgba(0,0,0,0.2)
  position: relative
  min-width: 55px
  width: 55px
  max-height: 145px
  color: $primary
  background-color: $secondary
  overflow: hidden
</style>
