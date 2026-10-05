<template>
    <div class="top">
        <BorderBox11 title="街道困难群体人数" :color="['#3f91ec', 'rgb(33, 57, 101)']" backgroundColor="rgba(33, 57, 101,.2)">
            <div class="jdknqtrs">
                <div id="risk"></div>
            </div>
        </BorderBox11>
    </div>
</template>

<script setup >
import * as echarts from 'echarts'
import { asyhard } from '@/api'

let streetName = ''
if (window.location.search) {
    streetName = decodeURI(window.location.search.split("=")[1])
}

const getData = async () => {
    const res = await asyhard({
        streetName
    })

    const state = reactive({
        option: {
            xAxis: {
                type: 'category',
                data: ['残疾人', '低保', '空巢', '特困', '孤寡', '留守'],
                axisLabel: {
                    textStyle: {
                        color: '#fff',
                    },
                }
            },
            yAxis: {
                type: 'value',
                // 增加单位
                axisLabel: {
                    formatter: '{value} 人',
                    textStyle: {
                        color: '#fff',
                    },
                }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
            },
            series: [
                {
                    data: [
                        res.data.cjr,
                        res.data.db,
                        res.data.kc,
                        res.data.tk,
                        res.data.gg,
                        res.data.ls,
                    ],
                    type: 'bar',
                }
            ],
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#439cf4' },
                { offset: 1, color: 'rgba(67,156,244,.1)' }
            ]),
            grid: {
                top: "8px",
                bottom: "20px",
            }
        }
    })
    const initeCharts = () => {
        let myChart = echarts.init(document.getElementById('risk'))
        // 绘制图表
        myChart.setOption(state.option)
    }
    initeCharts()
}

getData()

</script>

<style lang="less" scoped>
.top {
    position: relative;

    #risk {
        height: 126px;
    }
}

.resource {
    display: flex;
    color: #fff;
    font-size: 22px;
    margin-left: 14px;
    box-sizing: border-box;
    padding-top: 20px;
    padding-left: 5px;
    padding-right: 5px;
    margin-bottom: 10px;
    height: 100px;

    .right {
        width: 520px;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        margin-bottom: 5px;
    }

    .r-2 {
        margin-left: 5px;
        padding: 0 20px;

        .num {

            span {
                font-size: 34px;
                color: #fff;
            }
        }
    }
}

.jdknqtrs {
    padding-top: 70px;
    padding-bottom: 20px;
    padding-left: 20px;
}
</style>
