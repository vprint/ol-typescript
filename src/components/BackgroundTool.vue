<template>
  <q-page-sticky @click="console.log('hi')" position="bottom" class="q-px-md q-py-md">
    <q-btn fab icon="mdi-layers" :color=buttonColor :text-color=iconColor />
  </q-page-sticky>
</template>

<script setup>
import { ref } from 'vue';

const buttonColor = ref('secondary')
const iconColor = ref('primary')


</script>
