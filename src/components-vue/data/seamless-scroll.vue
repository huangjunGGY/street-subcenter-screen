<template>
  <div
    class="seamless-scroll-wrapper"
    ref="scrollBox"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
    @wheel="onWheel"
  >
    <div
      class="seamless-scroll-content"
      :style="{ transform: `translateY(${yPos}px)` }"
    >
      <div ref="slotBox">
        <slot />
      </div>
      <div v-if="shouldCopy" v-html="copyHtml"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'

const props = defineProps({
  list: { type: Array, default: () => [] },
  modelValue: { type: Boolean, default: true },
  step: { type: Number, default: 0.5 },
  singleHeight: { type: Number, default: 0 },
  singleWaitTime: { type: Number, default: 0 },
  hover: { type: Boolean, default: true },
  wheel: { type: Boolean, default: true },
  limitScrollNum: { type: Number, default: 4 },
})

const scrollBox = ref(null)
const slotBox = ref(null)
const yPos = ref(0)
const copyHtml = ref('')
const shouldCopy = ref(false)
let reqId = null
let isHovered = false

const updateCopy = async () => {
  await nextTick()
  if (slotBox.value && props.list && props.list.length >= props.limitScrollNum) {
    copyHtml.value = slotBox.value.innerHTML
    shouldCopy.value = true
  } else {
    copyHtml.value = ''
    shouldCopy.value = false
  }
}

const move = () => {
  if (!isHovered && shouldCopy.value && slotBox.value) {
    const slotH = slotBox.value.offsetHeight
    yPos.value -= props.step
    if (Math.abs(yPos.value) >= slotH) {
      yPos.value = 0
    }
  }
  reqId = requestAnimationFrame(move)
}

const onMouseEnter = () => {
  if (props.hover) isHovered = true
}

const onMouseLeave = () => {
  if (props.hover) isHovered = false
}

const onWheel = (e) => {
  if (props.wheel && shouldCopy.value && slotBox.value) {
    yPos.value -= e.deltaY * 0.2
    const slotH = slotBox.value.offsetHeight
    if (yPos.value > 0) yPos.value = -slotH
    if (Math.abs(yPos.value) >= slotH) yPos.value = 0
  }
}

watch(() => props.list, () => {
  updateCopy()
}, { deep: true })

onMounted(() => {
  updateCopy()
  reqId = requestAnimationFrame(move)
})

onUnmounted(() => {
  if (reqId) cancelAnimationFrame(reqId)
})
</script>

<style scoped>
.seamless-scroll-wrapper {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}
.seamless-scroll-content {
  width: 100%;
}
</style>
