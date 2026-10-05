<template>
  <div class="iot-center-container">
    <!-- 顶部全网 KPI 浮动数据 HUD -->
    <div class="kpi-hud-row">
      <div class="kpi-hud-card" v-for="(kpi, idx) in kpiData" :key="idx">
        <span class="kpi-lbl">{{ kpi.label }}</span>
        <div class="kpi-val-box">
          <span class="kpi-num" :style="{ color: kpi.color, textShadow: `0 0 10px ${kpi.color}` }">{{ kpi.value }}</span>
          <span class="kpi-unit">{{ kpi.unit }}</span>
        </div>
      </div>
    </div>

    <!-- 中部街区态势指示徽章 -->
    <div class="center-street-badge">
      <span class="pulse-ring"></span>
      <span class="badge-text">🌐 3D 街区物联感知底座 · 实时遥测中</span>
    </div>

    <!-- 底部：终端安装与巡检计划 (可折叠抽屉式大屏图表) -->
    <div class="center-bottom-plan" :class="{ 'collapsed': isPlanCollapsed }">
      <div class="plan-collapse-btn" @click="isPlanCollapsed = !isPlanCollapsed">
        <span>{{ isPlanCollapsed ? '▲ 展开安装计划图表' : '▼ 收起安装计划图表' }}</span>
      </div>
      <ItemWrap v-show="!isPlanCollapsed" class="plan-card" title="智能终端安装与覆盖率计划">
        <CenterBottom />
      </ItemWrap>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ItemWrap from "components-vue/data/item-wrap.vue";
import CenterBottom from "bigscreen/center/bottom.vue";

const isPlanCollapsed = ref(false);

const kpiData = ref([
  { label: "接入辖区社区", value: "34", unit: "个", color: "#00f0ff" },
  { label: "全网监测终端", value: "14,890", unit: "台", color: "#07f7a8" },
  { label: "今日遥测报文", value: "328.6", unit: "万条", color: "#ffb92e" },
  { label: "设备在线率", value: "98.9", unit: "%", color: "#00d2ff" },
]);
</script>

<style scoped lang="scss">
.iot-center-container {
  width: 900px;
  height: 949px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
  pointer-events: none; /* 允许点击穿透到底部 Mapbox 地图 */

  .kpi-hud-row {
    pointer-events: auto;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    margin-top: 10px;
    padding: 0 10px;
  }

  .kpi-hud-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 8px 12px;
    background: rgba(6, 20, 48, 0.78);
    border: 1px solid rgba(0, 229, 255, 0.3);
    border-radius: 6px;
    backdrop-filter: blur(10px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);

    .kpi-lbl {
      font-size: 12px;
      color: #8cbbe8;
      margin-bottom: 3px;
    }

    .kpi-val-box {
      display: flex;
      align-items: baseline;
      gap: 4px;

      .kpi-num {
        font-family: 'YouSheBiaoTiHei-2', sans-serif;
        font-size: 24px;
        font-weight: 800;
        letter-spacing: 0.5px;
      }

      .kpi-unit {
        font-size: 11px;
        color: #79a6d8;
      }
    }
  }

  .center-street-badge {
    pointer-events: auto;
    align-self: center;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 18px;
    border-radius: 20px;
    background: rgba(4, 18, 42, 0.7);
    border: 1px solid rgba(0, 229, 255, 0.4);
    backdrop-filter: blur(8px);
    box-shadow: 0 0 16px rgba(0, 229, 255, 0.2);

    .pulse-ring {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #00f0ff;
      box-shadow: 0 0 8px #00f0ff;
      animation: pulseAnim 1.8s infinite;
    }

    .badge-text {
      font-size: 13px;
      font-weight: 600;
      color: #cce9ff;
      letter-spacing: 1px;
    }
  }

  .center-bottom-plan {
    pointer-events: auto;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 12px;

    .plan-collapse-btn {
      cursor: pointer;
      font-size: 12px;
      color: #70c4ff;
      background: rgba(4, 16, 38, 0.85);
      border: 1px solid rgba(0, 229, 255, 0.3);
      border-bottom: none;
      padding: 3px 16px;
      border-radius: 8px 8px 0 0;
      backdrop-filter: blur(6px);
      transition: all 0.3s;
      user-select: none;

      &:hover {
        color: #ffffff;
        background: rgba(0, 150, 255, 0.4);
      }
    }

    .plan-card {
      width: 100%;
      height: 320px;
      box-shadow: 0 4px 25px rgba(0, 0, 0, 0.7), 0 0 20px rgba(0, 229, 255, 0.15) inset;
    }
  }
}

@keyframes pulseAnim {
  0% { transform: scale(0.85); opacity: 0.8; }
  50% { transform: scale(1.3); opacity: 1; }
  100% { transform: scale(0.85); opacity: 0.8; }
}
</style>
