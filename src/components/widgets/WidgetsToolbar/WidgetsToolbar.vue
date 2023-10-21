<template>
  <div class="q-pa-md">
    <div class="no-shadow">
      <q-list>
        <q-item v-for="widget in widgets" :key="widget.icon">
          <q-item-section avatar>
            <q-icon :name=widget.icon />
          </q-item-section>
          <q-tooltip anchor="center right" self="center left" transition-show="scale" transition-hide="scale" :delay=700
            style="border-radius: 0;">
            {{ widget.tooltip }}
          </q-tooltip>
        </q-item>
        <q-separator />
        <q-item clickable @click="zoom(1)">
          <q-item-section avatar>
            <q-icon name="sym_o_add" />
          </q-item-section>
        </q-item>
        <q-item clickable @click="zoom(-1)">
          <q-item-section avatar>
            <q-icon name="sym_o_remove" />
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { toolbarWidgets } from './enum';
import { useMapStore } from 'src/stores/map-store';
import { easeOut } from 'ol/easing'
import { View } from 'ol';

const mapStore = useMapStore()

const widgets = ref(toolbarWidgets)

function zoom(value: number): void {
  const view: View | undefined = mapStore.map?.getView();
  const zoom: number | undefined = view?.getZoom();

  if (view && zoom) {
    view.animate({
    zoom: zoom + value,
    duration: 250,
    easing: easeOut
    })
  }
}

</script>
