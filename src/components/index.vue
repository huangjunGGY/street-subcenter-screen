<template>
  <div class="index-wrapper">
    <Head :currentView="activeMode" @switchView="handleSwitchView" />
    
    <div class="icon absolute">
      <weathers></weathers>
    </div>

    <!-- 模式切换状态指示浮条 -->
    <div class="mode-status-indicator" v-if="activeMode !== 'gis'">
      <span class="status-dot" :class="{ 'twin-dot': activeMode === 'twin' }"></span>
      <span class="status-msg">
        {{ activeMode === 'iot' ? '⚡ 已进入「智能协同 · 物联全态感知」模式' : '🏙️ 已进入「联动指挥 · 3D城市数字孪生」视界' }}
      </span>
      <button class="back-gis-pill" @click="handleSwitchView('gis')">返回街区治理 ‹</button>
    </div>

    <div class="index">
      <!-- 左侧面板组：常驻内存，绝对不销毁，无缝切换 -->
      <div class="left-panel-col">
        <transition name="panel-slide">
          <Left v-show="activeMode === 'gis'" class="panel-layer" />
        </transition>
        <transition name="panel-slide">
          <IotLeft v-show="activeMode === 'iot'" class="panel-layer" />
        </transition>
        <transition name="panel-slide">
          <TwinLeft v-show="activeMode === 'twin'" class="panel-layer" />
        </transition>
      </div>

      <!-- 中部视界组：Middle（包含核心地图与视频）永久常驻，绝不重复初始化地图资源 -->
      <div class="center-panel-col">
        <transition name="panel-slide">
          <Middle v-show="activeMode === 'gis'" class="panel-layer" />
        </transition>
        <transition name="panel-slide">
          <IotCenter v-show="activeMode === 'iot'" class="panel-layer" />
        </transition>
        <transition name="panel-slide">
          <TwinCenter v-show="activeMode === 'twin'" class="panel-layer" />
        </transition>
      </div>

      <!-- 右侧面板组：常驻内存，绝对不销毁，无缝切换 -->
      <div class="right-panel-col">
        <transition name="panel-slide">
          <Right v-show="activeMode === 'gis'" class="panel-layer" />
        </transition>
        <transition name="panel-slide">
          <IotRight v-show="activeMode === 'iot'" class="panel-layer" />
        </transition>
        <transition name="panel-slide">
          <TwinRight v-show="activeMode === 'twin'" class="panel-layer" />
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import weathers from 'components/weather.vue';
import Head from "@/components/head.vue";
import Left from "@/components/left/index.vue";
import Middle from "@/components/middle/index.vue";
import Right from "@/components/right/index.vue";

import IotLeft from "@/components/left/IotLeft.vue";
import IotCenter from "@/components/middle/IotCenter.vue";
import IotRight from "@/components/right/IotRight.vue";

import TwinLeft from "@/components/left/TwinLeft.vue";
import TwinCenter from "@/components/middle/TwinCenter.vue";
import TwinRight from "@/components/right/TwinRight.vue";

import "./base.css";
import { useStore } from "hooks/weather";

const props = defineProps({
  currentView: {
    type: String,
    default: 'gis'
  }
});

const emit = defineEmits(['switchView']);

const activeMode = ref(props.currentView || 'gis');

watch(() => props.currentView, (val) => {
  if (val && val !== activeMode.value) {
    activeMode.value = val;
    handleCameraPose(val);
  }
});

const handleSwitchView = (val) => {
  activeMode.value = val;
  emit('switchView', val);
  handleCameraPose(val);
};

// 电影级多维相机大景深飞巡动效（零资源重载，纯GPU矩阵运算）
const handleCameraPose = (mode) => {
  if (typeof window !== 'undefined' && window.map && typeof window.map.flyTo === 'function') {
    if (mode === 'iot') {
      window.map.flyTo({
        center: [114.430, 30.634],
        zoom: 15.3,
        pitch: 62,
        bearing: -18,
        curve: 1.4,
        speed: 0.9,
        essential: true
      });
    } else if (mode === 'twin') {
      window.map.flyTo({
        center: [114.415, 30.642],
        zoom: 16.2,
        pitch: 70,
        bearing: 38,
        curve: 1.4,
        speed: 0.9,
        essential: true
      });
    } else if (mode === 'gis') {
      window.map.flyTo({
        center: [114.430, 30.634],
        zoom: 14.2,
        pitch: 50,
        bearing: 0,
        curve: 1.4,
        speed: 0.9,
        essential: true
      });
    }
  }
};

onMounted(() => {
  setTimeout(() => {
    const store = useStore();
    console.log(store.value, 'value111');
  });
});
</script>

<style lang="scss" scoped>
.index-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
}

.mode-status-indicator {
  position: absolute;
  top: 86px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(3, 16, 42, 0.85);
  border: 1px solid rgba(0, 229, 255, 0.45);
  padding: 4px 18px;
  border-radius: 20px;
  backdrop-filter: blur(10px);
  z-index: 1000;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.6), 0 0 10px rgba(0, 229, 255, 0.25) inset;
  animation: fadeInDown 0.4s ease-out;

  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #00f0ff;
    box-shadow: 0 0 8px #00f0ff;
  }

  .status-msg {
    font-size: 13px;
    color: #e2f2ff;
    letter-spacing: 0.5px;
  }

  .back-gis-pill {
    cursor: pointer;
    font-size: 12px;
    padding: 3px 12px;
    border-radius: 12px;
    background: rgba(0, 229, 255, 0.18);
    border: 1px solid rgba(0, 229, 255, 0.5);
    color: #00f0ff;
    font-weight: 600;
    transition: all 0.25s;

    &:hover {
      background: rgba(0, 229, 255, 0.35);
      box-shadow: 0 0 10px rgba(0, 229, 255, 0.6);
      transform: scale(1.02);
    }
  }
}

.index {
  position: absolute;
  top: 110px;
  left: 0;
  width: 1920px;
  height: 949px;
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  box-sizing: border-box;
  z-index: 1;
  pointer-events: none;

  .left-panel-col, .right-panel-col {
    position: relative;
    width: 488px;
    height: 949px;
    pointer-events: none;

    .panel-layer {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: auto !important;
    }
  }

  .center-panel-col {
    position: relative;
    width: 864px;
    height: 949px;
    pointer-events: none;

    .panel-layer {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: auto !important;
    }
  }
}

.icon {
  top: 0;
  right: 0;
  z-index: 1;
}

/* 丝滑面板无闪烁切换动画 (纯 GPU 渐变，零重排零重绘) */
.panel-slide-enter-active,
.panel-slide-leave-active {
  transition: opacity 0.35s cubic-bezier(0.25, 0.8, 0.25, 1), transform 0.35s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.panel-slide-enter-from {
  opacity: 0;
  transform: translateY(14px) scale(0.99);
}

.panel-slide-leave-to {
  opacity: 0;
  transform: translateY(-14px) scale(0.99);
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translate(-50%, -10px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}
</style>