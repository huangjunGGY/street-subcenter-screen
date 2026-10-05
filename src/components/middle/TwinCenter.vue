<template>
  <div class="twin-center-container">
    <!-- 顶部数字孪生指标 HUD -->
    <div class="twin-hud-row">
      <div class="twin-hud-card" v-for="(hud, idx) in twinHuds" :key="idx">
        <span class="hud-label">{{ hud.label }}</span>
        <div class="hud-val-box">
          <span class="hud-num" :style="{ color: hud.color, textShadow: `0 0 10px ${hud.color}` }">{{ hud.value }}</span>
          <span class="hud-unit">{{ hud.unit }}</span>
        </div>
      </div>
    </div>

    <!-- 中部 3D 数字孪生镜头控制中枢 -->
    <div class="camera-control-dock">
      <div class="dock-title">
        <span class="dock-icon">🏙️</span>
        <span>3D 城市空间飞控中枢</span>
      </div>
      <div class="dock-actions">
        <button class="flight-btn" :class="{ 'active': isRotating }" @click="toggleOrbit">
          {{ isRotating ? '⏹ 停止环绕巡视' : '🛸 一键全域巡视' }}
        </button>
        <button class="flight-btn" @click="resetCamera('aerial')">
          📐 宏观俯瞰
        </button>
        <button class="flight-btn" @click="resetCamera('street')">
          🏢 街区近景
        </button>
      </div>
    </div>

    <!-- 底部：全网巡检与覆盖计划 -->
    <div class="twin-bottom-plan">
      <ItemWrap class="plan-card" title="智能感知网络覆盖与演进规划">
        <CenterBottom />
      </ItemWrap>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue';
import ItemWrap from "components-vue/data/item-wrap.vue";
import CenterBottom from "bigscreen/center/bottom.vue";

const isRotating = ref(false);
let orbitTimer = null;

const twinHuds = ref([
  { label: "三维立体空间", value: "全域覆盖", unit: "100%", color: "#00f0ff" },
  { label: "白模数字建筑", value: "2,860", unit: "栋", color: "#07f7a8" },
  { label: "空间遥测信标", value: "1,420", unit: "个", color: "#ffb92e" },
  { label: "孪生渲染刷新", value: "60", unit: "FPS", color: "#00d2ff" },
]);

const toggleOrbit = () => {
  if (isRotating.value) {
    stopOrbit();
  } else {
    startOrbit();
  }
};

const startOrbit = () => {
  if (typeof window === 'undefined' || !window.map) return;
  isRotating.value = true;
  let currentBearing = window.map.getBearing() || 0;
  orbitTimer = setInterval(() => {
    currentBearing = (currentBearing + 0.3) % 360;
    window.map.easeTo({
      bearing: currentBearing,
      duration: 100,
      easing: (n) => n
    });
  }, 100);
};

const stopOrbit = () => {
  isRotating.value = false;
  if (orbitTimer) {
    clearInterval(orbitTimer);
    orbitTimer = null;
  }
};

const resetCamera = (type) => {
  stopOrbit();
  if (typeof window === 'undefined' || !window.map) return;
  if (type === 'aerial') {
    window.map.flyTo({
      pitch: 45,
      bearing: 0,
      zoom: 13.8,
      duration: 1500
    });
  } else if (type === 'street') {
    window.map.flyTo({
      pitch: 65,
      bearing: -20,
      zoom: 15.6,
      duration: 1500
    });
  }
};

onUnmounted(() => {
  stopOrbit();
});
</script>

<style scoped lang="scss">
.twin-center-container {
  width: 900px;
  height: 949px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
  pointer-events: none;

  .twin-hud-row {
    pointer-events: auto;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    margin-top: 10px;
    padding: 0 10px;
  }

  .twin-hud-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 8px 12px;
    background: rgba(6, 20, 48, 0.78);
    border: 1px solid rgba(0, 229, 255, 0.35);
    border-radius: 6px;
    backdrop-filter: blur(10px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);

    .hud-label {
      font-size: 12px;
      color: #8cbbe8;
      margin-bottom: 3px;
    }

    .hud-val-box {
      display: flex;
      align-items: baseline;
      gap: 4px;

      .hud-num {
        font-family: 'YouSheBiaoTiHei-2', sans-serif;
        font-size: 24px;
        font-weight: 800;
      }

      .hud-unit {
        font-size: 11px;
        color: #79a6d8;
      }
    }
  }

  .camera-control-dock {
    pointer-events: auto;
    align-self: center;
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 6px 18px;
    border-radius: 30px;
    background: rgba(4, 18, 45, 0.85);
    border: 1px solid rgba(0, 229, 255, 0.45);
    backdrop-filter: blur(12px);
    box-shadow: 0 0 20px rgba(0, 229, 255, 0.25);

    .dock-title {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      font-weight: 700;
      color: #cce9ff;
    }

    .dock-actions {
      display: flex;
      align-items: center;
      gap: 8px;

      .flight-btn {
        cursor: pointer;
        padding: 4px 12px;
        font-size: 12px;
        font-weight: 600;
        border-radius: 16px;
        background: rgba(0, 229, 255, 0.15);
        border: 1px solid rgba(0, 229, 255, 0.4);
        color: #00f0ff;
        transition: all 0.25s;

        &:hover {
          background: rgba(0, 229, 255, 0.35);
          box-shadow: 0 0 10px rgba(0, 229, 255, 0.6);
        }

        &.active {
          background: rgba(250, 140, 22, 0.3);
          border-color: #fa8c16;
          color: #ffb940;
          box-shadow: 0 0 12px rgba(250, 140, 22, 0.7);
        }
      }
    }
  }

  .twin-bottom-plan {
    pointer-events: auto;
    width: 100%;
    margin-bottom: 12px;

    .plan-card {
      width: 100%;
      height: 320px;
      box-shadow: 0 4px 25px rgba(0, 0, 0, 0.7), 0 0 20px rgba(0, 229, 255, 0.15) inset;
    }
  }
}
</style>
