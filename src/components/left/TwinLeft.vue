<template>
  <div class="twin-left-container">
    <!-- 1. 3D空间物联与负荷中枢 -->
    <ItemWrap class="twin-card-item" title="3D空间物联与动力负荷">
      <div class="load-metrics-grid">
        <div class="metric-card" v-for="(item, key) in dataInfo" :key="key">
          <div class="metric-header">
            <span class="metric-title">{{ item.name }}</span>
            <span class="metric-badge">{{ item.tag }}</span>
          </div>
          <div class="metric-body">
            <span class="metric-val" :style="{ color: item.color }">{{ item.number }}</span>
            <span class="metric-unit">{{ item.unit }}</span>
          </div>
          <div class="metric-progress-track">
            <div
              class="metric-progress-bar"
              :style="{ width: item.rate + '%', background: item.color, boxShadow: `0 0 8px ${item.color}` }"
            ></div>
          </div>
        </div>
      </div>
    </ItemWrap>

    <!-- 2. 三维数字建筑空间体量 -->
    <ItemWrap class="twin-card-item" title="三维数字建筑 · 空间体量孪生">
      <div class="spatial-info-box">
        <div class="spatial-row">
          <div class="spatial-block">
            <span class="sp-lbl">白模建筑体量</span>
            <span class="sp-val cyan">2,860 <small>栋</small></span>
          </div>
          <div class="spatial-block">
            <span class="sp-lbl">最高地标层高</span>
            <span class="sp-val gold">186 <small>米</small></span>
          </div>
        </div>
        <div class="spatial-row">
          <div class="spatial-block">
            <span class="sp-lbl">平均建筑密度</span>
            <span class="sp-val green">34.2 <small>%</small></span>
          </div>
          <div class="spatial-block">
            <span class="sp-lbl">空间点云精度</span>
            <span class="sp-val purple">0.05 <small>米</small></span>
          </div>
        </div>
        <div class="lighting-status">
          <span class="dot"></span>
          <span>实时日光光影模拟已校准 (方位角 140°, 仰角 45°)</span>
        </div>
      </div>
    </ItemWrap>

    <!-- 3. 应急资源立体标绘 -->
    <ItemWrap class="twin-card-item" title="应急资源空间标绘与巡航" style="padding: 0 10px 10px 10px">
      <div class="resource-radar-list">
        <div class="resource-item" v-for="(res, idx) in emergencyResources" :key="idx">
          <img :src="res.icon" class="res-icon" />
          <div class="res-details">
            <div class="res-title-row">
              <span class="res-name">{{ res.name }}</span>
              <span class="res-count">{{ res.count }} 处</span>
            </div>
            <span class="res-desc">{{ res.desc }}</span>
          </div>
          <button class="locate-btn" @click="locateResource(res)">定位</button>
        </div>
      </div>
    </ItemWrap>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import ItemWrap from "components-vue/data/item-wrap.vue";

const dataInfo = reactive({
  iot: { name: "物联网设备负荷", unit: "个", number: 88, rate: 88, color: "#00f0ff", tag: "运行稳定" },
  event: { name: "全维空间告警", unit: "起", number: 16, rate: 32, color: "#ffaa00", tag: "闭环处置中" },
  power: { name: "电网瞬时负荷", unit: "kW", number: 642, rate: 64, color: "#07f7a8", tag: "削峰填谷" },
});

const emergencyResources = ref([
  { name: "消防急救联动站", count: 12, desc: "全辖区 3 分钟到达覆盖率 96%", icon: "/bg/fire.svg", lng: 114.398, lat: 30.648 },
  { name: "治安巡防联动车", count: 18, desc: "北斗高精度巡检在途巡查", icon: "/bg/jingcha.svg", lng: 114.412, lat: 30.638 },
  { name: "电力高压监控点", count: 24, desc: "红外热成像测温无异常", icon: "/bg/dianli.svg", lng: 114.425, lat: 30.630 },
]);

const locateResource = (res) => {
  if (typeof window !== "undefined" && window.map) {
    window.map.flyTo({
      center: [res.lng, res.lat],
      zoom: 16,
      pitch: 65,
      bearing: -15,
      duration: 1500
    });
    window["$message"]?.({
      text: `已联动 3D 镜头飞跃聚焦: ${res.name}`,
      type: "success"
    });
  }
};
</script>

<style scoped lang="scss">
.twin-left-container {
  width: 100%;
  height: 949px;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;

  .twin-card-item {
    height: 306px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.65), 0 0 15px rgba(0, 229, 255, 0.12) inset;
  }
}

.load-metrics-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
  justify-content: space-around;
  padding: 6px 4px;
}

.metric-card {
  padding: 8px 12px;
  background: rgba(0, 20, 50, 0.45);
  border: 1px solid rgba(0, 229, 255, 0.15);
  border-radius: 6px;

  .metric-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;

    .metric-title {
      font-size: 13px;
      color: #c9e4ff;
    }

    .metric-badge {
      font-size: 11px;
      padding: 1px 6px;
      border-radius: 10px;
      background: rgba(0, 229, 255, 0.12);
      color: #00f0ff;
    }
  }

  .metric-body {
    display: flex;
    align-items: baseline;
    gap: 4px;
    margin-bottom: 6px;

    .metric-val {
      font-family: 'YouSheBiaoTiHei-2', monospace;
      font-size: 22px;
      font-weight: 800;
    }

    .metric-unit {
      font-size: 11px;
      color: #79a6d8;
    }
  }

  .metric-progress-track {
    width: 100%;
    height: 6px;
    background: rgba(0, 20, 40, 0.8);
    border-radius: 3px;
    overflow: hidden;

    .metric-progress-bar {
      height: 100%;
      border-radius: 3px;
      transition: width 0.8s ease;
    }
  }
}

.spatial-info-box {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
  justify-content: space-around;
  padding: 4px 6px;

  .spatial-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .spatial-block {
    display: flex;
    flex-direction: column;
    padding: 8px 12px;
    background: rgba(0, 22, 54, 0.45);
    border: 1px solid rgba(0, 229, 255, 0.18);
    border-radius: 6px;

    .sp-lbl {
      font-size: 12px;
      color: #8bb1db;
      margin-bottom: 4px;
    }

    .sp-val {
      font-family: 'YouSheBiaoTiHei-2', sans-serif;
      font-size: 22px;
      font-weight: 800;

      small {
        font-size: 11px;
        font-weight: normal;
        margin-left: 2px;
      }

      &.cyan { color: #00f0ff; text-shadow: 0 0 10px rgba(0, 240, 255, 0.6); }
      &.gold { color: #ffb92e; text-shadow: 0 0 10px rgba(255, 185, 46, 0.6); }
      &.green { color: #07f7a8; text-shadow: 0 0 10px rgba(7, 247, 168, 0.6); }
      &.purple { color: #c084fc; text-shadow: 0 0 10px rgba(192, 132, 252, 0.6); }
    }
  }

  .lighting-status {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 11px;
    color: #79a6d8;
    padding: 4px 8px;
    background: rgba(0, 16, 40, 0.35);
    border-radius: 4px;

    .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #00f0ff;
      box-shadow: 0 0 6px #00f0ff;
    }
  }
}

.resource-radar-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: 100%;
  justify-content: space-around;
  padding: 4px 0;
}

.resource-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background: rgba(0, 20, 50, 0.45);
  border: 1px solid rgba(0, 229, 255, 0.15);
  border-radius: 6px;
  transition: all 0.3s;

  &:hover {
    background: rgba(0, 30, 70, 0.65);
    border-color: rgba(0, 229, 255, 0.5);
  }

  .res-icon {
    width: 28px;
    height: 28px;
  }

  .res-details {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;

    .res-title-row {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .res-name {
        font-size: 13px;
        font-weight: 700;
        color: #e6f4ff;
      }

      .res-count {
        font-size: 12px;
        font-weight: 700;
        color: #00f0ff;
        font-family: monospace;
      }
    }

    .res-desc {
      font-size: 11px;
      color: #7da5d2;
    }
  }

  .locate-btn {
    cursor: pointer;
    font-size: 11px;
    padding: 3px 10px;
    border-radius: 12px;
    background: rgba(0, 229, 255, 0.15);
    border: 1px solid rgba(0, 229, 255, 0.4);
    color: #00f0ff;
    transition: all 0.25s;

    &:hover {
      background: rgba(0, 229, 255, 0.35);
      box-shadow: 0 0 10px rgba(0, 229, 255, 0.6);
    }
  }
}
</style>
