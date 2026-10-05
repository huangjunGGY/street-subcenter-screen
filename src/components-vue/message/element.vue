<template>
  <div class="message-container" v-if="msgList.length">
    <transition-group name="msg-fade">
      <div
        v-for="msg in msgList"
        :key="msg.id"
        class="message-toast"
        :class="'type-' + msg.type"
      >
        <span class="msg-icon">{{ getIcon(msg.type) }}</span>
        <span class="msg-text">{{ msg.text }}</span>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const msgList = ref([])
let msgId = 0

const getIcon = (type) => {
  if (type === 'success') return '✓'
  if (type === 'warning') return '⚠'
  if (type === 'error') return '✕'
  return 'ℹ'
}

const showMessage = (options) => {
  const item = {
    id: ++msgId,
    text: typeof options === 'string' ? options : options.text || '',
    type: options.type || 'info'
  }
  msgList.value.push(item)
  setTimeout(() => {
    msgList.value = msgList.value.filter(m => m.id !== item.id)
  }, options.duration || 3000)
}

onMounted(() => {
  window['$message'] = showMessage
})
</script>

<style scoped lang="scss">
.message-container {
  position: fixed;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  pointer-events: none;
}

.message-toast {
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  backdrop-filter: blur(8px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
  pointer-events: auto;

  &.type-info {
    background: rgba(13, 35, 75, 0.9);
    border: 1px solid #1890ff;
    color: #e6f7ff;
  }
  &.type-success {
    background: rgba(14, 55, 35, 0.9);
    border: 1px solid #52c41a;
    color: #f6ffed;
  }
  &.type-warning {
    background: rgba(65, 45, 10, 0.9);
    border: 1px solid #faad14;
    color: #fffbe6;
  }
  &.type-error {
    background: rgba(65, 20, 20, 0.9);
    border: 1px solid #ff4d4f;
    color: #fff1f0;
  }
}

.msg-fade-enter-active,
.msg-fade-leave-active {
  transition: all 0.3s ease;
}
.msg-fade-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}
.msg-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
