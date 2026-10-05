<template>
  <span class="count-up-number">{{ displayVal }}</span>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
  endVal: {
    type: Number,
    default: 0
  },
  duration: {
    type: Number,
    default: 2
  }
})

const displayVal = ref(0)

const animateNumber = (target) => {
  const start = displayVal.value
  const diff = target - start
  const startTime = performance.now()
  const durationMs = (props.duration || 2) * 1000

  const step = (now) => {
    const elapsed = now - startTime
    const progress = Math.min(elapsed / durationMs, 1)
    // easeOutExpo
    const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
    displayVal.value = Math.floor(start + diff * ease)

    if (progress < 1) {
      requestAnimationFrame(step)
    } else {
      displayVal.value = target
    }
  }

  requestAnimationFrame(step)
}

watch(() => props.endVal, (val) => {
  animateNumber(val)
})

onMounted(() => {
  animateNumber(props.endVal)
})
</script>

<style scoped>
.count-up-number {
  font-family: 'YouSheBiaoTiHei-2', sans-serif;
  letter-spacing: 1px;
}
</style>
