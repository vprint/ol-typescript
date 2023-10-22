<template>
  <div class="merriweather regular-header no-shadow" :style="{ width: width }">{{ title }}</div>
  <q-card class="regular-card no-shadow" :style="{ maxWidth: width }">
    <slot></slot>
  </q-card>
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
  border-radius: 0px
  border-width: 0px 1px 1px 0px
  border-style: solid
  border-color: rgba(0, 0, 0, 0.2)
  padding: 0px 0
  height: calc(100vh - 100px)
  overflow: auto
.regular-header
  background-color: $primary
  color: $secondary
  text-align: center
  position: relative
  min-width: 270px
  height: 48px
  border-radius: 0
  border-width: 1px 1px 0px 0px
  border-style: solid
  border-color: rgba(0,0,0,0.2)
  display: flex
  align-items: center
  justify-content: center
</style>
