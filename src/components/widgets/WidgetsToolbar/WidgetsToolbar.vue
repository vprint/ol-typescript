<template>
  <div class="q-pa-md">
    <div class="sidebar no-shadow">
      <q-list>
        <q-item
          v-for="widget in widgets"
          :key="widget.title"
          clickable
          class="sidebar-items"
          :class="{'active': widget.title === activeTool}"
          @click="setWidget(widget.title)">
          <q-item-section avatar>
            <q-icon :name="widget.icon" />
          </q-item-section>
          <q-tooltip
            anchor="center right"
            self="center left"
            transition-show="scale"
            transition-hide="scale"
            :delay=700
            style="border-radius: 0;">
            {{ widget.tooltip }}
          </q-tooltip>
        </q-item>
        <q-separator />
        <q-item clickable @click="zoom(1)">
          <q-item-section avatar>
            <q-icon name="sym_o_add" />
          </q-item-section>
          <q-tooltip
            anchor="center right"
            self="center left"
            transition-show="scale"
            transition-hide="scale"
            :delay=700
            style="border-radius: 0;">
            {{ 'Zoom in' }}
          </q-tooltip>
        </q-item>
        <q-item clickable @click="zoom(-1)">
          <q-item-section avatar>
            <q-icon name="sym_o_remove" />
          </q-item-section>
          <q-tooltip
            anchor="center right"
            self="center left"
            transition-show="scale"
            transition-hide="scale"
            :delay=700
            style="border-radius: 0;">
            {{ 'Zoom out' }}
          </q-tooltip>
        </q-item>
      </q-list>
    </div>
    <div v-if="activeTool !== null" class="content no-shadow">
      <keep-alive>
        <component
          :is="widgets[activeTool].tool"
          :width="widgets[activeTool].width">
        </component>
      </keep-alive>
    </div>
  </div>
</template>

<script setup lang="ts">
import { shallowRef, ref, Ref } from 'vue'
import { useMapStore } from 'src/stores/mapStore/map-store';
import { easeOut } from 'ol/easing'
import { View } from 'ol';
import { useWidgetStore } from 'src/stores/widgetStore/widget-store';

const mapStore = useMapStore()
const widgetStore = useWidgetStore()
const widgets = shallowRef(widgetStore.widgetList)
const activeTool: Ref<string | null> = ref(null)

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
function setWidget(toolname :string): void {
  // Vérifie si activeTool est égal au nom de l'outil en entré. Si oui, alors activeTool = null, sinon activeTool = toolname
  activeTool.value === toolname ? activeTool.value = null : activeTool.value = toolname
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
  color: $primary
  background-color: $secondary
  overflow: hidden
  &.active
    color: $secondary
    background-color: $primary

.content
  border-top: $borderDefault
  border-right: $borderDefault
  border-bottom: $borderDefault
</style>
