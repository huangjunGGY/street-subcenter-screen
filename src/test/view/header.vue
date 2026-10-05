<template>
  <div class="test-header-wrap">
    <!-- Cyber decorative background lines -->
    <div class="header-glow-bar"></div>
    <div class="header-grid-lines"></div>

    <div class="header-left">
      <button class="nav-cyber-btn back-btn" @click="emit('switchView', 'gis')">
        <span class="btn-arrow">‹</span>
        <span class="btn-text">返回街区GIS大屏</span>
      </button>

      <div class="header-clock-box">
        <span class="clock-icon">🕒</span>
        <span class="clock-date">{{ dateStr }}</span>
        <span class="clock-time">{{ timeStr }}</span>
      </div>
    </div>

    <div class="header-center">
      <div class="title-wing-left"></div>
      <div class="title-main-block">
        <h1 class="header-title">智能物联网设备态势感知平台</h1>
        <div class="header-subtitle">
          <span class="sub-dot"></span>
          <span>SMART IOT EQUIPMENT MONITORING & ALARM SYSTEM</span>
          <span class="sub-dot"></span>
        </div>
      </div>
      <div class="title-wing-right"></div>
    </div>

    <div class="header-right">
      <div class="system-status-badge">
        <span class="status-pulse-dot"></span>
        <span class="status-text">全域遥测正常 (99.8%)</span>
      </div>

      <button class="nav-cyber-btn twin-btn" @click="emit('switchView', 'twin')">
        <span class="btn-text">3D数字孪生空间</span>
        <span class="btn-arrow">›</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import dayjs from 'dayjs'

const emit = defineEmits(['switchView'])
const timeStr = ref('')
const dateStr = ref('')
let timer = null

onMounted(() => {
  const update = () => {
    const now = dayjs()
    timeStr.value = now.format('HH:mm:ss')
    dateStr.value = now.format('YYYY-MM-DD dddd')
  }
  update()
  timer = setInterval(update, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped lang="scss">
.test-header-wrap {
  width: 100%;
  height: 72px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;
  box-sizing: border-box;
  background: linear-gradient(180deg, rgba(8, 22, 54, 0.95) 0%, rgba(4, 12, 32, 0.7) 100%);
  border-bottom: 1px solid rgba(0, 229, 255, 0.35);
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.7);
  z-index: 10;
  overflow: hidden;

  .header-glow-bar {
    position: absolute;
    top: 0;
    left: 10%;
    right: 10%;
    height: 2px;
    background: linear-gradient(90deg, transparent, #00f0ff, #0088ff, transparent);
    box-shadow: 0 0 12px #00f0ff;
  }

  .header-grid-lines {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background-image: linear-gradient(90deg, rgba(0, 229, 255, 0.03) 1px, transparent 1px);
    background-size: 30px 100%;
  }
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
  z-index: 2;

  .header-clock-box {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 14px;
    border-radius: 4px;
    background: rgba(0, 18, 48, 0.6);
    border: 1px solid rgba(0, 229, 255, 0.2);

    .clock-icon {
      font-size: 13px;
      opacity: 0.8;
    }

    .clock-date {
      font-size: 13px;
      color: #79a6d8;
      font-family: monospace;
    }

    .clock-time {
      font-size: 15px;
      font-weight: bold;
      color: #00f0ff;
      font-family: monospace;
      letter-spacing: 1px;
    }
  }
}

.header-center {
  text-align: center;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 16px;
  z-index: 2;

  .title-wing-left,
  .title-wing-right {
    width: 60px;
    height: 14px;
    background: linear-gradient(90deg, transparent, rgba(0, 229, 255, 0.6));
    clip-path: polygon(0 50%, 100% 0, 100% 100%);
  }

  .title-wing-right {
    transform: rotate(180deg);
  }

  .title-main-block {
    display: flex;
    flex-direction: column;
    align-items: center;

    .header-title {
      margin: 0;
      font-size: 26px;
      font-weight: 900;
      letter-spacing: 3px;
      background: linear-gradient(180deg, #ffffff 20%, #7fe6ff 70%, #00bfff 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-shadow: 0 0 16px rgba(0, 229, 255, 0.7);
      line-height: 1.2;
    }

    .header-subtitle {
      font-size: 10px;
      color: #6398d4;
      letter-spacing: 3px;
      margin-top: 3px;
      display: flex;
      align-items: center;
      gap: 8px;

      .sub-dot {
        width: 3px;
        height: 3px;
        border-radius: 50%;
        background: #00e5ff;
        box-shadow: 0 0 6px #00e5ff;
      }
    }
  }
}

.header-right {
  display: flex;
  align-items: center;
  gap: 18px;
  z-index: 2;

  .system-status-badge {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 12px;
    border-radius: 20px;
    background: rgba(7, 247, 168, 0.1);
    border: 1px solid rgba(7, 247, 168, 0.35);

    .status-pulse-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #07f7a8;
      box-shadow: 0 0 8px #07f7a8;
      animation: pulseGreen 1.5s infinite;
    }

    .status-text {
      font-size: 12px;
      color: #a7fbe2;
      font-weight: 500;
    }
  }
}

@keyframes pulseGreen {
  0% { transform: scale(0.9); opacity: 0.7; }
  50% { transform: scale(1.3); opacity: 1; }
  100% { transform: scale(0.9); opacity: 0.7; }
}

.nav-cyber-btn {
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 16px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.3s;
  user-select: none;
  backdrop-filter: blur(8px);

  &.back-btn {
    background: rgba(0, 229, 255, 0.12);
    border: 1px solid rgba(0, 229, 255, 0.45);
    color: #00f0ff;
    box-shadow: 0 0 10px rgba(0, 229, 255, 0.15);

    &:hover {
      background: rgba(0, 229, 255, 0.25);
      box-shadow: 0 0 16px rgba(0, 229, 255, 0.6);
      transform: translateY(-1px);
    }
  }

  &.twin-btn {
    background: rgba(250, 140, 22, 0.12);
    border: 1px solid rgba(250, 140, 22, 0.45);
    color: #ffaa33;
    box-shadow: 0 0 10px rgba(250, 140, 22, 0.15);

    &:hover {
      background: rgba(250, 140, 22, 0.25);
      box-shadow: 0 0 16px rgba(250, 140, 22, 0.6);
      transform: translateY(-1px);
    }
  }

  .btn-arrow {
    font-size: 16px;
    line-height: 1;
  }
}
</style>
