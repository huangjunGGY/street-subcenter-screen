<script setup>
import { ref, onMounted } from "vue";
import { currentGET } from "@/test/api";
import { graphic } from "echarts/core";

const option = ref({});
const peakStats = ref({
    peak1: 62,
    peak2: 45,
    peakTime: "15:00"
});

const getData = () => {
    currentGET("rightTop", {}).then((res) => {
        if (res && res.success) {
            const xData = res.data.dateList || [];
            const yData = res.data.numList || [];
            const yData2 = res.data.numList2 || [];
            
            if (yData.length > 0) {
                const max1 = Math.max(...yData);
                const max1Idx = yData.indexOf(max1);
                peakStats.value.peak1 = max1;
                peakStats.value.peakTime = xData[max1Idx] || "15:00";
            }
            if (yData2.length > 0) {
                peakStats.value.peak2 = Math.max(...yData2);
            }
            
            setOption(xData, yData, yData2);
        } else {
            window["$message"]?.({
                text: res?.msg || "获取告警数据失败",
                type: "warning",
            });
        }
    });
};

const setOption = async (xData, yData, yData2) => {
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
                let result = `<div style="font-weight: bold; margin-bottom: 6px; color: #00f0ff;">🕒 时段: ${params[0].name}</div>`;
                params.forEach((item) => {
                    const color = item.seriesName.includes("1") ? "#ff9900" : "#00f0ff";
                    result += `<div style="display: flex; justify-content: space-between; gap: 16px; margin-top: 3px;">
                        <span>${item.marker} ${item.seriesName}</span>
                        <span style="font-weight: bold; color: ${color}; font-family: monospace;">${item.value} 次</span>
                    </div>`;
                });
                return result;
            },
        },
        legend: {
            data: ["报警1频次", "报警2频次"],
            right: "16px",
            top: "4px",
            textStyle: {
                color: "#a4c4e8",
                fontSize: 12,
            },
            icon: "roundRect",
            itemWidth: 12,
            itemHeight: 6,
            itemGap: 16,
        },
        grid: {
            left: "14px",
            right: "24px",
            bottom: "8px",
            top: "38px",
            containLabel: true,
        },
        xAxis: {
            type: "category",
            data: xData,
            boundaryGap: false,
            splitLine: {
                show: true,
                lineStyle: {
                    color: "rgba(0, 229, 255, 0.08)",
                    type: "dashed",
                },
            },
            axisLine: {
                lineStyle: {
                    color: "rgba(0, 229, 255, 0.25)",
                },
            },
            axisTick: { show: false },
            axisLabel: {
                color: "#8cbbe8",
                fontSize: 11,
            },
        },
        yAxis: {
            type: "value",
            splitLine: {
                show: true,
                lineStyle: {
                    color: "rgba(0, 229, 255, 0.08)",
                    type: "dashed",
                },
            },
            axisLine: { show: false },
            axisLabel: {
                color: "#79a4d4",
                fontSize: 11,
            },
        },
        series: [
            {
                data: yData,
                type: "line",
                smooth: true,
                showSymbol: false,
                name: "报警1频次",
                lineStyle: {
                    width: 2.5,
                    color: "#ff9900",
                    shadowColor: "rgba(255, 153, 0, 0.5)",
                    shadowBlur: 8,
                },
                itemStyle: {
                    color: "#ff9900",
                },
                areaStyle: {
                    color: new graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: "rgba(255, 153, 0, 0.45)" },
                        { offset: 0.8, color: "rgba(255, 153, 0, 0.05)" },
                        { offset: 1, color: "transparent" },
                    ]),
                },
                markPoint: {
                    data: [
                        {
                            type: "max",
                            name: "峰值",
                            symbol: "roundRect",
                            symbolSize: [68, 24],
                            symbolOffset: [0, -18],
                            itemStyle: {
                                color: "rgba(255, 153, 0, 0.2)",
                                borderColor: "#ff9900",
                                borderWidth: 1,
                            },
                            label: {
                                color: "#ffb940",
                                fontSize: 11,
                                fontWeight: "bold",
                                formatter: "峰值: {c}",
                            },
                        },
                    ],
                },
            },
            {
                data: yData2,
                type: "line",
                smooth: true,
                showSymbol: false,
                name: "报警2频次",
                lineStyle: {
                    width: 2.5,
                    color: "#00f0ff",
                    shadowColor: "rgba(0, 240, 255, 0.5)",
                    shadowBlur: 8,
                },
                itemStyle: {
                    color: "#00f0ff",
                },
                areaStyle: {
                    color: new graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: "rgba(0, 240, 255, 0.4)" },
                        { offset: 0.8, color: "rgba(0, 240, 255, 0.05)" },
                        { offset: 1, color: "transparent" },
                    ]),
                },
                markPoint: {
                    data: [
                        {
                            type: "max",
                            name: "峰值",
                            symbol: "roundRect",
                            symbolSize: [68, 24],
                            symbolOffset: [0, -18],
                            itemStyle: {
                                color: "rgba(0, 240, 255, 0.2)",
                                borderColor: "#00f0ff",
                                borderWidth: 1,
                            },
                            label: {
                                color: "#00f0ff",
                                fontSize: 11,
                                fontWeight: "bold",
                                formatter: "峰值: {c}",
                            },
                        },
                    ],
                },
            },
        ],
    };
};

onMounted(() => {
    getData();
});
</script>

<template>
    <div class="right-top-alarm-wrap">
        <div class="alarm-stat-bar">
            <div class="stat-pill pill-orange">
                <span class="pill-dot"></span>
                <span class="pill-text">报警1最高: <b>{{ peakStats.peak1 }}</b> 次</span>
            </div>
            <div class="stat-pill pill-cyan">
                <span class="pill-dot"></span>
                <span class="pill-text">报警2最高: <b>{{ peakStats.peak2 }}</b> 次</span>
            </div>
            <div class="stat-pill pill-time">
                <span class="pill-text">高发期: <b>{{ peakStats.peakTime }}</b></span>
            </div>
        </div>

        <div class="chart-box">
            <v-chart class="chart" :option="option" autoresize v-if="JSON.stringify(option) != '{}'" />
        </div>
    </div>
</template>

<style scoped lang="scss">
.right-top-alarm-wrap {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;

    .alarm-stat-bar {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 4px 6px;
        margin-bottom: 4px;

        .stat-pill {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 3px 8px;
            border-radius: 4px;
            font-size: 11px;
            background: rgba(0, 20, 50, 0.4);

            .pill-dot {
                width: 6px;
                height: 6px;
                border-radius: 50%;
            }

            b {
                font-family: monospace;
                font-size: 13px;
            }

            &.pill-orange {
                border: 1px solid rgba(255, 153, 0, 0.35);
                color: #ffaa33;
                .pill-dot {
                    background: #ff9900;
                    box-shadow: 0 0 6px #ff9900;
                }
            }

            &.pill-cyan {
                border: 1px solid rgba(0, 229, 255, 0.35);
                color: #00f0ff;
                .pill-dot {
                    background: #00f0ff;
                    box-shadow: 0 0 6px #00f0ff;
                }
            }

            &.pill-time {
                border: 1px solid rgba(138, 178, 226, 0.25);
                color: #8cbbe8;
                margin-left: auto;
            }
        }
    }

    .chart-box {
        flex: 1;
        width: 100%;
        min-height: 0;
        position: relative;

        .chart {
            width: 100%;
            height: 100%;
        }
    }
}
</style>
