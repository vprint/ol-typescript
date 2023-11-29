<template>
  <div class="global">
    <div class="tool">
      <div class="merriweather regular-header no-shadow" :style="{ width: width }">
        <slot name="header">{{ title }}</slot>
      </div>
      <q-card class="regular-card no-shadow" :style="{ maxWidth: width }">
        <slot name="component"></slot>
      </q-card>
    </div>

    <div class="q-pl-md">
      <slot name="external"></slot>
    </div>
  </div>
</template>

<script setup lang="ts" >
defineProps({
  title: {
    type: String,
    default: 'Title'
  },
  width: {
    type: String,
    default: '400px'
  }
})
</script>

<style lang="sass" scoped>
.regular-card
  background-color: $secondary
  border-radius: 0
  padding: 0px 0
  height: calc(100vh - 100px)
  overflow: auto

.tool
  border-top: $borderDefault
  border-right: $borderDefault
  border-bottom: $borderDefault

.regular-header
  background-color: $primary
  color: $secondary
  text-align: center
  position: relative
  min-width: 270px
  height: 48px
  display: flex
  align-items: center
  justify-content: center

.global
  display: flex
</style>
