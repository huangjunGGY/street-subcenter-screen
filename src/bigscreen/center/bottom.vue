<script setup>
import { ref, onMounted } from "vue";
import { currentGET } from "@/test/api";
import { graphic } from "echarts/core";

const option = ref({});

const getData = () => {
    currentGET("centerBottom", {}).then((res) => {
        if (res && res.success) {
            setOption(res.data);
        } else {
            window["$message"]?.({
                text: res?.msg || "获取计划数据失败",
                type: "warning",
            });
        }
    });
};

const setOption = async (newData) => {
    option.value = {
        tooltip: {
            trigger: "axis",
            backgroundColor: "rgba(6, 18, 45, 0.9)",
            borderColor: "rgba(0, 229, 255, 0.5)",
            borderWidth: 1,
            padding: [10, 16],
            textStyle: {
                color: "#FFF",
                fontSize: 13,
            },
            formatter: function (params) {
                let result = `<div style="font-weight: bold; margin-bottom: 6px; color: #00f0ff;">📍 ${params[0].name}</div>`;
                params.forEach(function (item) {
                    if (item.value !== undefined && item.value !== null) {
                        const unit = item.seriesName === "安装率" ? "%" : " 台";
                        const valColor = item.seriesName === "安装率" ? "#ff2a8d" : (item.seriesName === "已安装" ? "#00f0ff" : "#c084fc");
                        result += `<div style="display: flex; justify-content: space-between; gap: 16px; margin-top: 3px;">
                            <span>${item.marker} ${item.seriesName}</span>
                            <span style="font-weight: bold; color: ${valColor}; font-family: monospace;">${item.value}${unit}</span>
                        </div>`;
                    }
                });
                return result;
            },
        },
        legend: {
            data: ["已安装", "计划安装", "安装率"],
            textStyle: {
                color: "#a4c4e8",
                fontSize: 12,
            },
            icon: "roundRect",
            itemWidth: 12,
            itemHeight: 8,
            itemGap: 20,
            top: "6px",
            right: "20px",
        },
        grid: {
            left: "20px",
            right: "24px",
            bottom: "12px",
            top: "42px",
            containLabel: true,
        },
        xAxis: {
            data: newData.category,
            axisLine: {
                lineStyle: {
                    color: "rgba(0, 229, 255, 0.3)",
                },
            },
            axisTick: {
                show: false,
            },
            axisLabel: {
                color: "#8cbbe8",
                fontSize: 12,
                interval: 0,
            },
        },
        yAxis: [
            {
                type: "value",
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: "rgba(0, 229, 255, 0.08)",
                        type: "dashed",
                    },
                },
                axisLine: {
                    show: false,
                },
                axisLabel: {
                    color: "#7aa4d4",
                    fontSize: 11,
                    formatter: "{value}",
                },
            },
            {
                type: "value",
                splitLine: { show: false },
                axisLine: { show: false },
                axisLabel: {
                    color: "#ff70a6",
                    fontSize: 11,
                    formatter: "{value}%",
                },
            },
        ],
        series: [
            {
                name: "已安装",
                type: "bar",
                barWidth: 12,
                itemStyle: {
                    borderRadius: [4, 4, 0, 0],
                    color: new graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: "#00f0ff" },
                        { offset: 1, color: "#0055d4" },
                    ]),
                    shadowColor: "rgba(0, 240, 255, 0.4)",
                    shadowBlur: 6,
                },
                data: newData.barData,
            },
            {
                name: "计划安装",
                type: "bar",
                barGap: "-100%",
                barWidth: 12,
                itemStyle: {
                    borderRadius: [4, 4, 0, 0],
                    color: new graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: "rgba(168, 85, 247, 0.65)" },
                        { offset: 1, color: "rgba(88, 28, 135, 0.2)" },
                    ]),
                },
                z: -1,
                data: newData.lineData,
            },
            {
                name: "安装率",
                type: "line",
                smooth: true,
                showAllSymbol: true,
                symbol: "circle",
                symbolSize: 7,
                yAxisIndex: 1,
                lineStyle: {
                    width: 3,
                    color: "#ff2a8d",
                    shadowColor: "rgba(255, 42, 141, 0.6)",
                    shadowBlur: 10,
                },
                itemStyle: {
                    color: "#ff2a8d",
                    borderColor: "#ffffff",
                    borderWidth: 1.5,
                },
                areaStyle: {
                    color: new graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: "rgba(255, 42, 141, 0.2)" },
                        { offset: 1, color: "rgba(255, 42, 141, 0.0)" },
                    ]),
                },
                data: newData.rateData,
            },
        ],
    };
};

onMounted(() => {
    getData();
});
</script>

<template>
    <div class="center-bottom-wrap">
        <v-chart class="chart" :option="option" autoresize v-if="JSON.stringify(option) != '{}'" />
    </div>
</template>

<style scoped lang="scss">
.center-bottom-wrap {
    width: 100%;
    height: 100%;
    position: relative;

    .chart {
        width: 100%;
        height: 100%;
    }
}
</style>
