<template>
  <div class="device-overview-wrap">
    <div class="overview-grid">
      <!-- 1. 总设备数 -->
      <div class="overview-card theme-cyan">
        <div class="dial-container">
          <div class="dial-spin-ring"></div>
          <div class="dial-core">
            <span class="core-num">
              <CountUp :endVal="state.totalNum" :duration="duration" />
            </span>
          </div>
        </div>
        <div class="meta-info">
          <span class="meta-title">总设备数</span>
          <span class="meta-tag">100% 接入</span>
        </div>
      </div>

      <!-- 2. 在线数 -->
      <div class="overview-card theme-green">
        <div class="dial-container">
          <div class="dial-spin-ring"></div>
          <div class="dial-core">
            <span class="core-num">
              <CountUp :endVal="state.onlineNum" :duration="duration" />
            </span>
          </div>
        </div>
        <div class="meta-info">
          <span class="meta-title">在线数</span>
          <span class="meta-tag tag-green">93.7% 在线率</span>
        </div>
      </div>

      <!-- 3. 掉线数 -->
      <div class="overview-card theme-gold">
        <div class="dial-container">
          <div class="dial-spin-ring"></div>
          <div class="dial-core">
            <span class="core-num">
              <CountUp :endVal="state.offlineNum" :duration="duration" />
            </span>
          </div>
        </div>
        <div class="meta-info">
          <span class="meta-title">掉线数</span>
          <span class="meta-tag tag-gold">6.3% 待排查</span>
        </div>
      </div>

      <!-- 4. 告警次数 -->
      <div class="overview-card theme-red">
        <div class="dial-container">
          <div class="dial-spin-ring"></div>
          <div class="dial-core">
            <span class="core-num">
              <CountUp :endVal="state.alarmNum" :duration="duration" />
            </span>
          </div>
        </div>
        <div class="meta-info">
          <span class="meta-title">告警次数</span>
          <span class="meta-tag tag-red">实时监控中</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";
import CountUp from "components-vue/data/count-up.vue";
import { currentGET } from "@/test/api";

const duration = ref(2);
const state = reactive({
  alarmNum: 759,
  offlineNum: 44,
  onlineNum: 654,
  totalNum: 698,
});

const getData = () => {
  currentGET("leftTop").then((res) => {
    if (res && res.success) {
      state.alarmNum = res.data.alarmNum;
      state.offlineNum = res.data.offlineNum;
      state.onlineNum = res.data.onlineNum;
      state.totalNum = res.data.totalNum;
    }
  });
};

onMounted(() => {
  getData();
});
</script>

<style lang="scss" scoped>
.device-overview-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.overview-grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.overview-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 4px;
  background: rgba(0, 16, 40, 0.45);
  border: 1px solid rgba(0, 229, 255, 0.15);
  border-radius: 8px;
  transition: all 0.3s;

  &:hover {
    border-color: rgba(0, 229, 255, 0.45);
    background: rgba(0, 24, 60, 0.6);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
    transform: translateY(-2px);
  }

  .dial-container {
    width: 82px;
    height: 82px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 8px;

    .dial-spin-ring {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      border: 2px dashed rgba(255, 255, 255, 0.2);
      animation: dialRotate 20s linear infinite;
    }

    .dial-core {
      width: 66px;
      height: 66px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: radial-gradient(circle, rgba(0, 20, 50, 0.8) 0%, rgba(0, 10, 30, 0.95) 100%);
      box-shadow: 0 0 12px rgba(0, 0, 0, 0.8) inset;

      .core-num {
        font-family: 'YouSheBiaoTiHei-2', sans-serif;
        font-size: 22px;
        font-weight: 800;
        letter-spacing: 0.5px;
      }
    }
  }

  .meta-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;

    .meta-title {
      font-size: 13px;
      color: #cce4ff;
      font-weight: 600;
      white-space: nowrap;
    }

    .meta-tag {
      font-size: 10px;
      padding: 1px 6px;
      border-radius: 10px;
      background: rgba(0, 229, 255, 0.12);
      color: #00f0ff;
      border: 1px solid rgba(0, 229, 255, 0.3);
      white-space: nowrap;

      &.tag-green {
        background: rgba(7, 247, 168, 0.12);
        color: #07f7a8;
        border-color: rgba(7, 247, 168, 0.3);
      }
      &.tag-gold {
        background: rgba(255, 185, 46, 0.12);
        color: #ffb92e;
        border-color: rgba(255, 185, 46, 0.3);
      }
      &.tag-red {
        background: rgba(255, 71, 87, 0.12);
        color: #ff4757;
        border-color: rgba(255, 71, 87, 0.3);
      }
    }
  }

  /* Themes */
  &.theme-cyan {
    .dial-spin-ring {
      border-color: rgba(0, 240, 255, 0.6);
      box-shadow: 0 0 10px rgba(0, 240, 255, 0.3);
    }
    .core-num {
      color: #00f0ff;
      text-shadow: 0 0 10px rgba(0, 240, 255, 0.7);
    }
  }

  &.theme-green {
    .dial-spin-ring {
      border-color: rgba(7, 247, 168, 0.6);
      box-shadow: 0 0 10px rgba(7, 247, 168, 0.3);
    }
    .core-num {
      color: #07f7a8;
      text-shadow: 0 0 10px rgba(7, 247, 168, 0.7);
    }
  }

  &.theme-gold {
    .dial-spin-ring {
      border-color: rgba(255, 185, 46, 0.6);
      box-shadow: 0 0 10px rgba(255, 185, 46, 0.3);
    }
    .core-num {
      color: #ffb92e;
      text-shadow: 0 0 10px rgba(255, 185, 46, 0.7);
    }
  }

  &.theme-red {
    .dial-spin-ring {
      border-color: rgba(255, 71, 87, 0.6);
      box-shadow: 0 0 10px rgba(255, 71, 87, 0.3);
    }
    .core-num {
      color: #ff4757;
      text-shadow: 0 0 10px rgba(255, 71, 87, 0.7);
    }
  }
}

@keyframes dialRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
