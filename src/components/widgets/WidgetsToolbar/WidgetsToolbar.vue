<template>
  <div class="q-pa-md">
    <div class="sidebar no-shadow">
      <q-list>

        <q-item v-for="widget in widgets" :key="widget.title" clickable class="sidebar-items"
          :class="{ 'active': widget.title === activeTool }" @click="setWidget(widget.title)">
          <q-item-section avatar>
            <q-icon :name="widget.icon" />
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
          <q-tooltip anchor="center right" self="center left" transition-show="scale" transition-hide="scale" :delay=700
            style="border-radius: 0;">
            {{ 'Zoom in' }}
          </q-tooltip>
        </q-item>

        <q-item clickable @click="zoom(-1)">
          <q-item-section avatar>
            <q-icon name="sym_o_remove" />
          </q-item-section>
          <q-tooltip anchor="center right" self="center left" transition-show="scale" transition-hide="scale" :delay=700
            style="border-radius: 0;">
            {{ 'Zoom out' }}
          </q-tooltip>
        </q-item>
      </q-list>
    </div>

    <div class="no-shadow">
      <keep-alive>
        <component :is="widgets[activeTool]?.tool" :width="widgets[activeTool]?.width">
        </component>
      </keep-alive>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, Ref } from 'vue';

import { useMapStore } from 'src/stores/mapStore/map-store';
import { useWidgetStore } from 'src/stores/widgetStore/widget-store';

import { easeOut } from 'ol/easing';
import { View } from 'ol';


const mapStore = useMapStore()
const widgetStore = useWidgetStore()
const widgets = widgetStore.widgetList
const activeTool: Ref<string> = ref('')

/**
 * Fonction de zoom
 * @param value valeur de zoom
 */
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

/**
 * Fonction de gestion du widget actif
 * @param toolname nom du widget à activer / désactiver
 */
function setWidget(toolname: string): void {
  // Si le widget est actif alors il est desactivé. Sinon le widget change.
  activeTool.value === toolname ? activeTool.value = '' : activeTool.value = toolname
}

</script>

<style lang="sass" scoped>
.q-pa-md
  display: flex
  overflow: hidden
.sidebar
  border: $borderDefault
  position: relative
  min-width: 55px
  width: 55px
  color: $primary
  background-color: $secondary
  overflow: hidden
.sidebar-items
  border: none
  overflow: hidden
  &.active
    color: $secondary
    background-color: $primary
</style>
