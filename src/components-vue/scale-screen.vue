<template>
  <v-scale-screen
    :width="width"
    :height="height"
    :delay="delay"
    :fullScreen="fullScreen"
    :boxStyle="boxStyle"
    :wrapperStyle="wrapperStyle"
    :autoScale="autoScale"
  >
    <slot />
  </v-scale-screen>
</template>

<script setup>
import VScaleScreen from 'v-scale-screen'

defineProps({
  width: {
    type: [String, Number],
    default: 1920
  },
  height: {
    type: [String, Number],
    default: 1080
  },
  delay: {
    type: Number,
    default: 500
  },
  fullScreen: {
    type: Boolean,
    default: false
  },
  boxStyle: {
    type: Object,
    default: () => ({})
  },
  wrapperStyle: {
    type: Object,
    default: () => ({})
  },
  autoScale: {
    type: [Boolean, Object],
    default: true
  }
})
</script>
