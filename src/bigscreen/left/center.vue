<script setup>
import { reactive, ref, onMounted } from "vue";
import { graphic } from "echarts/core";
import { currentGET } from "@/test/api";

const option = ref({});
const state = reactive({
  lockNum: 120,
  offlineNum: 44,
  onlineNum: 654,
  alarmNum: 759,
  totalNum: 1577,
});

const getData = () => {
  currentGET("leftCenter").then((res) => {
    if (res && res.success) {
      state.lockNum = res.data.lockNum || 120;
      state.offlineNum = res.data.offlineNum || 44;
      state.onlineNum = res.data.onlineNum || 654;
      state.alarmNum = res.data.alarmNum || 759;
      state.totalNum = state.lockNum + state.offlineNum + state.onlineNum + state.alarmNum;
      setOption();
    }
  });
};

const setOption = () => {
  option.value = {
    tooltip: {
      trigger: "item",
      backgroundColor: "rgba(6, 18, 45, 0.9)",
      borderColor: "rgba(0, 229, 255, 0.5)",
      borderWidth: 1,
      padding: [8, 14],
      textStyle: {
        color: "#FFF",
        fontSize: 13,
      },
      formatter: "{b} : <b>{c} 台</b> ({d}%)",
    },
    legend: {
      orient: "horizontal",
      bottom: "0%",
      left: "center",
      icon: "circle",
      itemWidth: 8,
      itemHeight: 8,
      itemGap: 16,
      textStyle: {
        color: "#a4c4e8",
        fontSize: 12,
      },
    },
    title: {
      top: "42%",
      left: "center",
      text: [`{val|${state.totalNum}}`, "{lbl|监测总数}"].join("\n"),
      textStyle: {
        rich: {
          val: {
            color: "#ffffff",
            fontSize: 22,
            fontFamily: "YouSheBiaoTiHei-2, sans-serif",
            fontWeight: "bold",
            lineHeight: 28,
            textShadow: "0 0 10px rgba(0, 229, 255, 0.7)",
          },
          lbl: {
            color: "#7da8d8",
            fontSize: 11,
            lineHeight: 18,
          },
        },
      },
    },
    series: [
      {
        type: "pie",
        radius: ["42%", "44%"],
        center: ["50%", "48%"],
        silent: true,
        label: { show: false },
        data: [{ value: 1, itemStyle: { color: "rgba(0, 229, 255, 0.25)" } }],
      },
      {
        name: "用户总览",
        type: "pie",
        radius: ["50%", "72%"],
        center: ["50%", "48%"],
        avoidLabelOverlap: true,
        padAngle: 3,
        itemStyle: {
          borderRadius: 4,
          borderColor: "#05132d",
          borderWidth: 2,
        },
        label: {
          show: true,
          position: "outside",
          formatter: "{b}\n{per|{d}%}",
          rich: {
            b: {
              color: "#d0e4ff",
              fontSize: 11,
              lineHeight: 14,
            },
            per: {
              color: "#00f0ff",
              fontSize: 12,
              fontWeight: "bold",
              lineHeight: 16,
            },
          },
        },
        labelLine: {
          show: true,
          length: 12,
          length2: 16,
          smooth: 0.1,
          lineStyle: {
            color: "rgba(0, 229, 255, 0.4)",
            width: 1,
          },
        },
        data: [
          {
            value: state.onlineNum,
            name: "正常在线",
            itemStyle: {
              color: new graphic.LinearGradient(0, 0, 1, 1, [
                { offset: 0, color: "#07f7a8" },
                { offset: 1, color: "#00b875" },
              ]),
            },
          },
          {
            value: state.alarmNum,
            name: "异常告警",
            itemStyle: {
              color: new graphic.LinearGradient(0, 0, 1, 1, [
                { offset: 0, color: "#ff4757" },
                { offset: 1, color: "#c01525" },
              ]),
            },
          },
          {
            value: state.lockNum,
            name: "保护锁定",
            itemStyle: {
              color: new graphic.LinearGradient(0, 0, 1, 1, [
                { offset: 0, color: "#00f0ff" },
                { offset: 1, color: "#0088ff" },
              ]),
            },
          },
          {
            value: state.offlineNum,
            name: "离线掉线",
            itemStyle: {
              color: new graphic.LinearGradient(0, 0, 1, 1, [
                { offset: 0, color: "#ffb92e" },
                { offset: 1, color: "#d48806" },
              ]),
            },
          },
        ],
      },
    ],
  };
};

onMounted(() => {
  getData();
});
</script>

<template>
  <div class="user-overview-chart">
    <v-chart class="chart" :option="option" autoresize />
  </div>
</template>

<style scoped lang="scss">
.user-overview-chart {
  width: 100%;
  height: 100%;
  position: relative;

  .chart {
    width: 100%;
    height: 100%;
  }
}
</style>
