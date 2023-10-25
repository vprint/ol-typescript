<template>
  <div class="q-pa-md">
    <div class="sidebar no-shadow">
      <q-list>
        <q-item
          v-for="widget in widgets"
          :key="widget.title"
          :active="activeTool === widget.title"
          clickable
          @click="setWidget(widget.title)">
          <q-item-section avatar>
            <q-icon :name=widget.icon />
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
    <div class="no-shadow">
      <information-tool v-if="activeTool==='InformationTool'"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, Ref } from 'vue'
import { toolbarWidgets } from './enum';
import { useMapStore } from 'src/stores/map-store';
import { easeOut } from 'ol/easing'
import { View } from 'ol';
import InformationTool from '../InformationTool/InformationTool.vue';
import { useWidgetStore } from 'src/stores/widgetStore/widget-store';

const mapStore = useMapStore()
const widgetStore = useWidgetStore()
const widgets = ref(toolbarWidgets)
const activeTool: Ref<string | null> = ref(null)

console.log(widgetStore.widgetList)

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
  // Vérifie si activateTool est égal au nom de l'outil en entré. Si oui, alors activateTool = null, sinon activateTool = toolname
  activeTool.value === toolname ? activeTool.value = null : activeTool.value = toolname

}

</script>

<style lang="sass" scoped>
.q-pa-md
  display: flex
  overflow: hidden
.sidebar
  border: 1px solid rgba(0,0,0,0.2)
  position: relative
  min-width: 55px
  width: 55px
  color: $primary
  background-color: $secondary
  overflow: hidden
.sidebar-items
  color: $secondary
  background-color: $primary
  overflow: hidden
.content
  border-width: 1px 0px 0px 0px
  border-radius: 0
  border-style: solid
  border-color: rgba(0,0,0,0.2)
  position: relative
</style>
