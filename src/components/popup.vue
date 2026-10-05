
<template lang="pug">
el-dialog(v-model="visible", :title="p.title", :width="p.w", :class="'popup ' + p.class", :align-center="true", :destroy-on-close="p.destroy", :z-index="p.z", :draggable="p.drag", :modal="p.mask", :lock-scroll="fixedBoolean" close-on-press-escape)
  slot
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  selector: {
    type: String,
    default: ''
  },
  class: {
    type: String,
    default: ''
  },
  w: {
    type: String,
    default: '70%'
  },
  drag: {
    type: Boolean,
    default: false
  },
  destroy: {
    type: Boolean,
    default: false
  },
  mask: {
    type: Boolean,
    default: false
  },
  fixed: {
    type: [Boolean, String],
    default: true
  },
  z: {
    type: Number,
    default: 2000
  },
  default: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue'])

const p = ref(props)

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const fixedBoolean = computed(() => {
  if (typeof props.fixed === 'string') {
    return props.fixed === 'true' || props.fixed === ''
  }
  return Boolean(props.fixed)
})
</script>

<style lang="scss">
.el-dialog {
  background: url('@/assets/images/video-bg.png') no-repeat !important;
}

.popup,
.el-dialog,
.mapboxgl-popup-content {
  width: 80%;

  &::before {
    content: '';
    position: absolute;
    top: 10px;
    left: 10px;
    width: 400px;
    height: 50px;
    background: url('@/assets/images/left.png') no-repeat;
    background-size: 100% 100%;
    z-index: 1200 !important;
  }

  &::after {
    content: '';
    position: absolute;
    top: -80px;
    right: 120px;
    width: 120px;
    height: 120px;
    background: url('@/assets/images/light.png') no-repeat;
    background-size: 100% 100%;
    z-index: 1200 !important;
  }
}

.el-dialog__body {
  font-size: 24px !important;
}

.el-dialog__body {
  position: relative;
  height: 700px;
  overflow-x: hidden;
  overflow-y: scroll;

  video {
    width: 100%;
  }
}

.el-dialog__title {
  font-size: 32px !important;
  font-weight: 900 !important;
  margin-left: 80px;
  line-height: 32px !important;
}

.el-dialog__headerbtn {
  font-size: 32px !important;
  font-weight: 900 !important;
  top: -10px !important;

  i {
    color: #fff !important;
    background: #0096ff !important;
    border-radius: 50% !important;
  }
}
</style>
