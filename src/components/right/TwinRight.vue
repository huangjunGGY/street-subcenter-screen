<template>
  <div class="twin-right-container">
    <!-- 1. 突发应急事件联动派单中心 -->
    <ItemWrap class="twin-card-item dispatch-card" title="突发应急事件联动派单">
      <div class="emergency-events-list">
        <div
          class="event-card-item"
          v-for="(item, idx) in eventList"
          :key="idx"
          :class="{ 'active': activeIdx === idx }"
          @click="selectEvent(item, idx)"
        >
          <div class="event-type-badge">
            <img :src="imgs[item.name]" class="event-icon" />
          </div>

          <div class="event-info-col">
            <div class="event-top-row">
              <span class="event-name" :class="'type-' + item.name">{{ item.name }}告警响应</span>
              <span class="event-time">{{ item.time }}</span>
            </div>
            <p class="event-desc">{{ item.content }}</p>
          </div>

          <div class="event-status-pill">
            <span class="blink-dot"></span>
            <span>处置中</span>
          </div>
        </div>
      </div>
    </ItemWrap>

    <!-- 2. 全域联动指挥日志与响应效能 -->
    <ItemWrap class="twin-card-item log-card" title="全域联动应急效能排行" style="padding: 0 10px 10px 10px">
      <div class="efficiency-container">
        <div class="kpi-mini-grid">
          <div class="kpi-mini-item">
            <span class="kpi-mini-lbl">平均派单时延</span>
            <span class="kpi-mini-val">1.2 <small>分</small></span>
          </div>
          <div class="kpi-mini-item">
            <span class="kpi-mini-lbl">联动处置率</span>
            <span class="kpi-mini-val green">99.4 <small>%</small></span>
          </div>
          <div class="kpi-mini-item">
            <span class="kpi-mini-lbl">闭环满意度</span>
            <span class="kpi-mini-val gold">98.8 <small>%</small></span>
          </div>
        </div>

        <div class="ranking-stream">
          <div class="rank-row" v-for="(rank, i) in efficiencyRanks" :key="i">
            <span class="rank-num">{{ i + 1 }}</span>
            <span class="rank-name">{{ rank.name }}</span>
            <div class="rank-bar-box">
              <div class="rank-bar-fill" :style="{ width: rank.rate + '%' }"></div>
            </div>
            <span class="rank-rate">{{ rank.rate }}%</span>
          </div>
        </div>
      </div>
    </ItemWrap>
  </div>
</template>

<script setup>
import { ref } from "vue";
import ItemWrap from "components-vue/data/item-wrap.vue";

const activeIdx = ref(0);

const imgs = {
  电力: "/bg/dianli.svg",
  火警: "/bg/fire.svg",
  治安: "/bg/jingcha.svg",
};

const eventList = ref([
  {
    name: "火警",
    time: "17:14:02",
    content: "红钢城街道建设三路某老旧小区烟雾感知报警",
    lng: 114.398,
    lat: 30.648,
  },
  {
    name: "电力",
    time: "17:09:45",
    content: "冶金街道102街坊配电房瞬时温度超标85℃预警",
    lng: 114.418,
    lat: 30.642,
  },
  {
    name: "治安",
    time: "16:55:18",
    content: "和平大道商圈人群瞬时聚集密度超阈值联动提醒",
    lng: 114.430,
    lat: 30.634,
  },
  {
    name: "火警",
    time: "16:42:30",
    content: "沿江工业园区压力传感器报文异常回传，巡防确认中",
    lng: 114.385,
    lat: 30.655,
  }
]);

const efficiencyRanks = ref([
  { name: "红卫路街应急站", rate: 99.2 },
  { name: "红钢城街指挥所", rate: 98.6 },
  { name: "冶金街联动中心", rate: 97.4 },
  { name: "新沟桥街处置站", rate: 96.8 },
  { name: "青山镇街联络站", rate: 95.5 },
]);

const selectEvent = (item, idx) => {
  activeIdx.value = idx;
  if (typeof window !== "undefined" && window.map) {
    window.map.flyTo({
      center: [item.lng, item.lat],
      zoom: 16.5,
      pitch: 65,
      bearing: -20,
      duration: 1600
    });
    window["$message"]?.({
      text: `已联动 3D 镜头飞跃至事件发生地: ${item.content}`,
      type: "warning"
    });
  }
};
</script>

<style scoped lang="scss">
.twin-right-container {
  width: 100%;
  height: 949px;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;

  .twin-card-item {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.65), 0 0 15px rgba(0, 229, 255, 0.12) inset;

    &.dispatch-card {
      height: 450px;
    }

    &.log-card {
      height: 482px;
    }
  }
}

.emergency-events-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 100%;
  justify-content: space-around;
  padding: 4px 0;
}

.event-card-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 6px;
  background: rgba(0, 20, 50, 0.45);
  border: 1px solid rgba(0, 229, 255, 0.15);
  cursor: pointer;
  transition: all 0.3s;

  &:hover, &.active {
    background: rgba(0, 32, 75, 0.7);
    border-color: rgba(0, 229, 255, 0.6);
    box-shadow: 0 0 16px rgba(0, 229, 255, 0.3);
    transform: translateX(-3px);
  }

  .event-type-badge {
    width: 38px;
    height: 38px;
    border-radius: 6px;
    background: rgba(0, 229, 255, 0.12);
    display: flex;
    align-items: center;
    justify-content: center;

    .event-icon {
      width: 24px;
      height: 24px;
    }
  }

  .event-info-col {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 3px;
    min-width: 0;

    .event-top-row {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .event-name {
        font-size: 13px;
        font-weight: 700;

        &.type-火警 { color: #ff4757; }
        &.type-电力 { color: #ffb92e; }
        &.type-治安 { color: #00f0ff; }
      }

      .event-time {
        font-size: 11px;
        color: #79a6d8;
        font-family: monospace;
      }
    }

    .event-desc {
      margin: 0;
      font-size: 11px;
      color: #b0d2f8;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .event-status-pill {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 10px;
    color: #ff9900;
    padding: 2px 6px;
    border-radius: 10px;
    background: rgba(255, 153, 0, 0.15);
    border: 1px solid rgba(255, 153, 0, 0.35);

    .blink-dot {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: #ff9900;
      box-shadow: 0 0 6px #ff9900;
      animation: pulseBlink 1.2s infinite;
    }
  }
}

.efficiency-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
  justify-content: space-around;
  padding: 4px 6px;
}

.kpi-mini-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;

  .kpi-mini-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 6px 4px;
    background: rgba(0, 20, 50, 0.45);
    border: 1px solid rgba(0, 229, 255, 0.15);
    border-radius: 4px;

    .kpi-mini-lbl {
      font-size: 11px;
      color: #8cbbe8;
      margin-bottom: 2px;
    }

    .kpi-mini-val {
      font-family: 'YouSheBiaoTiHei-2', sans-serif;
      font-size: 18px;
      font-weight: 800;
      color: #00f0ff;

      small {
        font-size: 11px;
        font-weight: normal;
      }

      &.green { color: #07f7a8; }
      &.gold { color: #ffb92e; }
    }
  }
}

.ranking-stream {
  display: flex;
  flex-direction: column;
  gap: 8px;

  .rank-row {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: #cde4ff;

    .rank-num {
      width: 16px;
      height: 16px;
      border-radius: 3px;
      background: rgba(0, 229, 255, 0.15);
      color: #00f0ff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      font-weight: bold;
    }

    .rank-name {
      width: 100px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .rank-bar-box {
      flex: 1;
      height: 6px;
      background: rgba(0, 20, 40, 0.8);
      border-radius: 3px;
      overflow: hidden;

      .rank-bar-fill {
        height: 100%;
        background: linear-gradient(90deg, #00f0ff 0%, #0088ff 100%);
        border-radius: 3px;
        box-shadow: 0 0 6px rgba(0, 229, 255, 0.4);
      }
    }

    .rank-rate {
      width: 45px;
      text-align: right;
      font-weight: bold;
      color: #00f0ff;
      font-family: monospace;
    }
  }
}

@keyframes pulseBlink {
  0% { opacity: 0.4; }
  50% { opacity: 1; }
  100% { opacity: 0.4; }
}
</style>
