<template>
  <div class="capsule-chart-container">
    <div
      v-for="(item, index) in data"
      :key="item.name || index"
      class="capsule-item"
    >
      <div class="capsule-label">
        <div class="rank-badge-wrap">
          <span class="capsule-rank" :class="'rank-' + (index + 1)">
            <template v-if="index === 0">🥇</template>
            <template v-else-if="index === 1">🥈</template>
            <template v-else-if="index === 2">🥉</template>
            <template v-else>{{ index + 1 }}</template>
          </span>
        </div>
        <span class="capsule-name">{{ item.name }}</span>
        <div class="capsule-val-box">
          <span class="capsule-val">{{ item.value }}</span>
          <span class="capsule-unit">{{ config.unit || '次' }}</span>
        </div>
      </div>

      <div class="capsule-track">
        <div
          class="capsule-bar"
          :style="{
            width: calculateWidth(item.value) + '%',
            background: getGradient(index)
          }"
        >
          <div class="bar-head-light"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  config: {
    type: Object,
    default: () => ({ showValue: true, unit: '次' })
  }
})

const maxVal = computed(() => {
  if (!props.data || props.data.length === 0) return 100
  const max = Math.max(...props.data.map(d => d.value || 0))
  return max > 0 ? max : 100
})

const calculateWidth = (val) => {
  if (!val) return 0
  return Math.min(Math.round((val / maxVal.value) * 100), 100)
}

const getGradient = (i) => {
  const gradients = [
    'linear-gradient(90deg, #ff4757 0%, #ff6b81 100%)',
    'linear-gradient(90deg, #fa8c16 0%, #ffa940 100%)',
    'linear-gradient(90deg, #f5b041 0%, #f7dc6f 100%)',
    'linear-gradient(90deg, #00f0ff 0%, #0099ff 100%)',
    'linear-gradient(90deg, #07f7a8 0%, #00b875 100%)',
    'linear-gradient(90deg, #a855f7 0%, #c084fc 100%)',
    'linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%)',
    'linear-gradient(90deg, #14b8a6 0%, #2dd4bf 100%)'
  ]
  return gradients[i % gradients.length]
}
</script>

<style scoped lang="scss">
.capsule-chart-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 6px 4px;
}

.capsule-item {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 2px 6px;
  border-radius: 4px;
  transition: all 0.25s;

  &:hover {
    background: rgba(0, 229, 255, 0.08);
    .capsule-name {
      color: #00f0ff;
    }
  }
}

.capsule-label {
  display: flex;
  align-items: center;
  font-size: 13px;
  color: #cde4ff;

  .rank-badge-wrap {
    margin-right: 10px;
    display: flex;
    align-items: center;

    .capsule-rank {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 800;
      background: rgba(255, 255, 255, 0.1);
      color: #a4c4e8;
      font-family: monospace;

      &.rank-1, &.rank-2, &.rank-3 {
        font-size: 14px;
        background: transparent;
      }
    }
  }

  .capsule-name {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 500;
    transition: color 0.25s;
  }

  .capsule-val-box {
    display: flex;
    align-items: baseline;
    gap: 3px;
    margin-left: 10px;

    .capsule-val {
      font-weight: 800;
      color: #00f0ff;
      font-size: 15px;
      font-family: 'YouSheBiaoTiHei-2', monospace;
    }

    .capsule-unit {
      font-size: 11px;
      color: #79a6d8;
    }
  }
}

.capsule-track {
  width: 100%;
  height: 8px;
  border-radius: 4px;
  background: rgba(0, 25, 60, 0.7);
  border: 1px solid rgba(0, 229, 255, 0.15);
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.6) inset;
  overflow: hidden;
  position: relative;
}

.capsule-bar {
  height: 100%;
  border-radius: 4px;
  transition: width 0.8s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;

  .bar-head-light {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 6px;
    background: #ffffff;
    box-shadow: 0 0 8px #ffffff;
    border-radius: 2px;
  }
}
</style>
