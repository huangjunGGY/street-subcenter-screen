<template>
  <div class="empty-state-container">
    <div class="empty-icon">📡</div>
    <div class="empty-text">{{ text || '暂无提醒数据' }}</div>
  </div>
</template>

<script setup>
defineProps({
  text: {
    type: String,
    default: '暂无数据'
  }
})
</script>

<style scoped>
.empty-state-container {
  width: 100%;
  height: 100%;
  min-height: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #708cb6;
}
.empty-icon {
  font-size: 32px;
  margin-bottom: 8px;
  opacity: 0.8;
}
.empty-text {
  font-size: 14px;
}
</style>
