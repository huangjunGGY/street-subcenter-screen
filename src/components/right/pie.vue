
<template>
  <div id="condition"></div>
</template>

<script setup>
import * as echarts from 'echarts'
import { asygrid } from '@/api'

let streetName = ''
if (window.location.search) {
  streetName = decodeURI(window.location.search.split("=")[1])
}


const props = defineProps({
  rank: {
    type: Object,
    default: {}
  },
})

const p = ref(props)


const net = ref({
  GridData: {
    wgms: 0,
    contactWay: 0,
    fzr: 0,
    wgysl: 0,
    zbry: 0
  },
  xb: [],
  zzmm: []
})
const getasygrid = async () => {
  const res = await asygrid({
    streetName
  })
  net.value = res.data
  console.log(net, 'net');
}
getasygrid()


const names = ref([])
const values = ref([])

watch(() => p.value.rank, (newValue) => {
  for (let i = 0; i < newValue.length; i++) {
    const ele = newValue[i];
    // 根据ele.streetTypeNum大小排序
    newValue.sort((a, b) => {
      return a.streetTypeNum - b.streetTypeNum
    })
  }
  names.value = newValue.map(item => item.streetTypeName)
  values.value = newValue.map(item => item.streetTypeNum)

  const state = reactive({
    option: {
      tooltip: {},
      grid: [
        {
          width: '50%',
          containLabel: true,
          top: 0,
          left: 30,
        }
      ],
      xAxis: [
        {
          type: 'value',
          axisLabel: {
            show: false,
          },
        }
      ],
      yAxis: [
        {
          type: 'category',
          data: names.value,
          splitLine: {
            show: false,
          },
          axisLabel: {
            textStyle: {
              color: '#fff',
              fontSize: 14
            },
          }
        }
      ],
      series: [
        {
          type: 'bar',
          label: {
            position: 'right',
            show: true
          },
          data: values.value,
          itemStyle: {
            borderRadius: 8,
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
              offset: 0,
              color: '#01b9fd'
            },
            {
              offset: 1,
              color: '#0ef4f2'
            }]),
          }
        }
      ]
    },
  })

  const chart = echarts.init(document.getElementById('condition'));
  chart.setOption(state.option)
})

</script>
<style scoped lang="less">
#condition {
  width: 800px;
  height: 260px;
  margin-top: 15px;
}
</style>
