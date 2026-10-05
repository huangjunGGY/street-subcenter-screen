<template>
  <div class="device-alerts-container">
    <SeamlessScroll
      :list="state.list"
      v-model="state.scroll"
      :step="0.4"
      :hover="true"
      :wheel="true"
      :limitScrollNum="3"
    >
      <div class="alert-list-box">
        <div
          class="alert-card-item"
          v-for="(item, i) in state.list"
          :key="i"
          :class="item.onlineState === 1 ? 'is-online' : 'is-offline'"
        >
          <div class="item-left-badge">
            <span class="rank-index">{{ String(i + 1).padStart(2, '0') }}</span>
          </div>

          <div class="item-main-content">
            <div class="row-top">
              <span class="device-id">📍 {{ item.gatewayno }}</span>
              <span class="status-pill" :class="item.onlineState === 1 ? 'pill-online' : 'pill-offline'">
                <span class="led-dot"></span>
                <span>{{ item.onlineState === 1 ? "上线运行" : "掉线告警" }}</span>
              </span>
            </div>

            <div class="row-bottom">
              <span class="device-addr">{{ addressHandle(item) }}</span>
              <span class="event-time">{{ item.createTime }}</span>
            </div>
          </div>
        </div>
      </div>
    </SeamlessScroll>
  </div>
</template>

<script setup>
import { reactive, onMounted } from "vue";
import { currentGET } from "@/test/api";
import SeamlessScroll from "components-vue/data/seamless-scroll.vue";

const state = reactive({
  list: [],
  scroll: true,
});

const getData = () => {
  currentGET("leftBottom", { limitNum: 20 }).then((res) => {
    if (res && res.success) {
      state.list = res.data.list;
    }
  });
};

const addressHandle = (item) => {
  let name = item.provinceName || "";
  if (item.cityName) {
    name += " · " + item.cityName;
    if (item.countyName) {
      name += " · " + item.countyName;
    }
  }
  return name;
};

onMounted(() => {
  getData();
});
</script>

<style scoped lang="scss">
.device-alerts-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}

.alert-list-box {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 4px 0;
}

.alert-card-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 6px;
  background: rgba(0, 18, 45, 0.45);
  border: 1px solid rgba(0, 229, 255, 0.15);
  transition: all 0.3s;

  &:hover {
    background: rgba(0, 28, 65, 0.7);
    border-color: rgba(0, 229, 255, 0.5);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
    transform: translateX(2px);
  }

  &.is-offline {
    border-left: 3px solid #ff4757;
    background: rgba(45, 12, 20, 0.45);
    &:hover {
      background: rgba(65, 15, 28, 0.65);
      border-color: rgba(255, 71, 87, 0.6);
    }
  }

  &.is-online {
    border-left: 3px solid #07f7a8;
  }

  .item-left-badge {
    .rank-index {
      font-size: 13px;
      font-weight: 800;
      color: #79aee8;
      font-family: monospace;
    }
  }

  .item-main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;

    .row-top {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .device-id {
        font-size: 13px;
        font-weight: 700;
        color: #e6f4ff;
        font-family: monospace;
      }

      .status-pill {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        font-size: 11px;
        padding: 2px 8px;
        border-radius: 10px;

        .led-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }

        &.pill-online {
          background: rgba(7, 247, 168, 0.15);
          color: #07f7a8;
          border: 1px solid rgba(7, 247, 168, 0.35);
          .led-dot {
            background: #07f7a8;
            box-shadow: 0 0 6px #07f7a8;
          }
        }

        &.pill-offline {
          background: rgba(255, 71, 87, 0.15);
          color: #ff4757;
          border: 1px solid rgba(255, 71, 87, 0.35);
          .led-dot {
            background: #ff4757;
            box-shadow: 0 0 6px #ff4757;
          }
        }
      }
    }

    .row-bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 11px;

      .device-addr {
        color: #8bb1db;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 200px;
      }

      .event-time {
        color: #5585b5;
        font-family: monospace;
      }
    }
  }
}
</style>
