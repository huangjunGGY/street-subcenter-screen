
<template>
  <div id="head">
    <div class="nav-container">
      <div class="nav-item item1" @click="() => {
        // faulttext.fault
      }">
        <p class="faulttext">{{ streetName }}城市运行管理平台</p>
        <div class="head-mode-switcher">
          <span class="mode-tab" :class="{ 'active': currentView === 'gis' }" @click.stop="emit('switchView', 'gis')" title="街区综合网格与民生治理视角">🌐 街区治理</span>
          <span class="mode-tab" :class="{ 'active': currentView === 'iot' }" @click.stop="emit('switchView', 'iot')" title="全域物联网终端态势感知与告警协同">⚡ 智能协同 (IoT态势)</span>
          <span class="mode-tab" :class="{ 'active': currentView === 'twin' }" @click.stop="emit('switchView', 'twin')" title="3D城市数字孪生视界">🏙️ 3D数字孪生</span>
        </div>
      </div>

      <img src="@/assets/images/nav-left.png" alt="" class="nav-left">
      <img src="@/assets/images/nav-left.png" alt="" class="nav-right">

      <div class="box">
        <p class="boxTime">{{ dateDay }}</p>
        <div class="right">
          <p class="boxDay">{{ dateWeek }}</p>
          <p class="boxDate">{{ dateYear }}</p>
        </div>
      </div>

      <div class="weather">
        <div class="text flex flex-wrap absolute">
          <div class="title">青山区</div>
          <span>{{ weather.temp || 0 }}℃</span>
        </div>
      </div>

      <div class="left">
        <div class="title-item" @click="dialogVisible = true">
          <span><el-icon size="32">
              <Phone />
            </el-icon>&nbsp;融合通信</span>
        </div>
        <div class="title-item" :class="{ 'mode-active-btn': currentView === 'iot' }" @click="toggleIot">
          <span><el-icon size="32">
              <DataAnalysis />
            </el-icon>&nbsp;智能协同</span>
        </div>
      </div>
      <div class="right">
        <div class="title-item" :class="{ 'mode-active-btn': currentView === 'twin' }" @click="open2">
          <span><el-icon size="32">
              <Place />
            </el-icon>&nbsp;联动指挥</span>
        </div>
        <el-popover placement="bottom" :width="60">
          <template #reference>
            <div class="title-item">
              <span><el-icon size="32">
                  <SetUp />
                </el-icon>&nbsp;信息配置</span>
            </div>
          </template>
          <div class="config flex flex-wrap">
            <span @click="dialogVisible2 = true">值班配置</span>
            <span @click="info.openVideoPopup()">视频配置</span>
          </div>
        </el-popover>
      </div>
      <span class="settings" @click="dialogVisible3 = true">⚙</span>
    </div>
    <popup title="融合通信" v-model="dialogVisible" class="hl-panel video-panel" align-center>
      <trans></trans>
    </popup>
    <popup title="值班配置" v-model="dialogVisible2" align-center>
      <dutyPopup></dutyPopup>
    </popup>
    <popup title="视频配置" v-model="info.videoPopup" align-center>
      <videoPopup></videoPopup>
    </popup>
    <popup title="设置" v-model="dialogVisible3" drag fixed="false" w="30%" class="setting">
      <div class="flex items-center">
        <el-icon size="28">
          <Coordinate />
        </el-icon>&nbsp;
        地图视角调节：
        <input type="range" min="0" max="60" value="50" class="slider" id="slider" @change="pitch" />
      </div>
      <div class="flex items-center">
        <el-icon size="28">
          <OfficeBuilding />
        </el-icon>&nbsp;
        开启白模：
        <el-switch v-model="s.setting.openBaimo" @change="val => s.update({
          openBaimo: val
        })" />
      </div>
    </popup>
  </div>
</template>

<script setup >
import dayjs from "dayjs";
import trans from '@/components/middle/transfer.vue'
import dutyPopup from '@/components/middle/duty-popup.vue'
import videoPopup from '@/components/middle/video-popup.vue'
import { asyweather } from '@/api'
import { useStore } from 'hooks/weather';
import { useSettingStore } from 'hooks/setting';
import { useInfoStore } from 'hooks/info'

import {
  ElPopover
} from 'element-plus'

import { Phone, DataAnalysis, Place, SetUp, Coordinate, OfficeBuilding } from '@element-plus/icons-vue'

const props = defineProps({
  currentView: {
    type: String,
    default: 'gis'
  }
})

const emit = defineEmits(['switchView'])

const toggleIot = () => {
  if (props.currentView === 'iot') {
    emit('switchView', 'gis')
  } else {
    emit('switchView', 'iot')
  }
}

const s = useSettingStore();

watch(() => s.setting.openBaimo, () => {
  if (typeof window !== 'undefined' && window.map && window.map.setLayoutProperty && window.map.getLayer && window.map.getLayer('3Dbuilding')) {
    window.map.setLayoutProperty('3Dbuilding', 'visibility', s.setting.openBaimo ? 'visible' : 'none');
  }
})

const info = useInfoStore()
console.log(info.info);


// 文字损坏特效
const faulttext = {
  player: [],
  texts: [],
  init() {
    this.texts = [...document.getElementsByClassName('faulttext')]
  },
  fault() {
    setTimeout(() => {
      this.texts.forEach((text, index) => {
        text.classList.remove('faulttext_fault')
        text.style.transform = ``
        text.style.clipPath = ``
      })
      clearInterval(this.player)
    }, 1000)
    this.player = setInterval(() => {
      this.texts.forEach((text, index) => {
        text.classList.add('faulttext_fault')
        text.style.transform = `translate(${Math.random() * 10 - 30}px, ${Math.random() * 10 - 30}px)`
        let x = Math.random() * 100
        let y = Math.random() * 100
        let h = Math.random() * 50 + 50
        let w = Math.random() * 40 + 10
        text.style.clipPath = `polygon(${x}% ${y}%, ${x + w}% ${y}%, ${x + w}% ${y + h}%, ${x}% ${y + h}%)`
      })
    }, 30)
  }
}



const weather = ref({
  temp: 0
})

onMounted(() => {

  const getWeather = async () => {
    const res = await asyweather({
      cityName: "101200101"
    })

    console.log(res.data, 'weather');
    weather.value = res.data || {}
    const store = useStore();
    store.fn(res.data)
    store.change(res.data.weather)
  }
  getWeather()

  // 每隔5分钟请求一次天气
  setInterval(() => {
    getWeather()
  }, 1000 * 60 * 5);


  faulttext.init()

  // // 页面加载后触发一次文字损坏特效
  // setTimeout(() => {
  //   faulttext.fault()

  //   // 每隔2秒触发一次文字损坏特效
  //   setInterval(() => {
  //     faulttext.fault()
  //   }, 5000);
  // }, 2000)
})


const open = () => {
  emit('switchView', 'iot')
}

const open2 = () => {
  emit('switchView', 'twin')
}

const dialogVisible = ref(false)
const dialogVisible2 = ref(false)
const dialogVisible3 = ref(false)

const streetName = ref(null)
if (window.location.search) {
  streetName.value = decodeURI(window.location.search.split("=")[1])
}

let dateDay = ref(null);
let dateYear = ref(null);
let dateWeek = ref(null);

const weekday = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]

let timer = setInterval(() => {
  const date = dayjs(new Date());
  dateDay.value = date.format("HH:mm:ss");
  dateYear.value = date.format("YYYY-MM-DD");
  dateWeek.value = date.format(weekday[date.day()]);
}, 1000);

// 卸载组件时清除定时器
onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
});

const pitch = () => {
  window.map.easeTo({
    pitch: document.getElementById('slider').value
  })
}

</script>

<style lang="scss" scoped>
#head {
  pointer-events: visible !important;
}

.nav-container {
  display: flex;
  /* 横向排列导航项 */
  flex-direction: row;
  /* 选项超出容器宽度时自动换行 */
  flex-wrap: wrap;
  position: fixed;
  z-index: 2000 !important;
}

.nav-item {
  /* 设置导航项的宽度和高度 */
  // width: 800px;
  // width: 372px;
  width: 100%;
  height: 84px;
  font-size: 36px;
  margin-bottom: 15px;
  background: url(@/assets/images/nav.png) no-repeat;
  /* 居中文本内容 */
  display: flex;
  align-items: center;
  justify-content: center;
  /* 添加背景和其他样式 */
  color: #fff;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1 !important;
  font-family: 'YouSheBiaoTiHei-2' !important;
}

.item1 {
  background-size: 100% 90px;
  // color: #6deefc;
  color: #fff;
  font-weight: 900;
  text-shadow: 0 0 1rem rgba(0, 234, 255, .48);
}

.box {
  width: 250px;
  color: #fff;
  display: flex;
  align-items: center;
  position: absolute;
  left: 20px;
  top: 20px;
  display: flex;
  justify-content: space-between;

  .right {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
}

.boxDay,
.boxDate {
  font-size: 14px;
  color: rgb(136, 166, 184);
}

.boxTime {
  width: 230px;
  font-size: 32px;
  margin: 0 15px;
  color: rgb(255, 255, 255);
  background-image: linear-gradient(rgb(100, 166, 255) 29.81%, rgb(255, 255, 255) 84.17%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: bold;
  display: block;
  font-family: 'YouSheBiaoTiHei-2' !important;
}

.boxDate {
  font-size: 14px;
  white-space: nowrap;
}


.nav-container {
  .title-item {
    width: 220px !important;

    span {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  >.left,
  >.right {
    display: flex;
    position: absolute;
    top: 30px;
    z-index: 1100;
    width: 460px;
  }

  >.left {
    left: 50%;
    transform: translateX(-600px);

    .title-item {
      background: url("@/assets/images/card-l.png") no-repeat;

      &:nth-child(2) {
        transform: translateX(-30px);
      }

      &:hover {
        background: url("@/assets/images/card-l-h.png") no-repeat;

      }
    }
  }

  >.right {
    right: 50%;
    transform: translateX(600px);
    // 倒序
    flex-direction: row-reverse;

    .title-item {
      background: url(@/assets/images/card-r.png) no-repeat;

      &:nth-child(2) {
        transform: translateX(30px);
      }

      &:hover {
        background: url(@/assets/images/card-r-h.png) no-repeat;
      }
    }
  }
}

.title-item {
  text-align: center;
  font-size: 22px !important;
  line-height: 60px !important;
  width: 320px !important;
  height: 60px !important;
  background-size: 100% 100% !important;
  color: rgba(201, 237, 255, 0.5);
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    color: #fff;
  }

  &.mode-active-btn {
    color: #00f0ff !important;
    text-shadow: 0 0 16px rgba(0, 240, 255, 0.8) !important;
    filter: drop-shadow(0 0 8px rgba(0, 229, 255, 0.6));
  }
}

.fine_svg__cls-1 {
  fill: #fff100
}

.nav-container {
  position: relative;

  .nav-left {
    position: absolute;
    left: 20px;
    top: 25px;
    height: 50px;
    transform: scale(1.2);
  }

  .nav-right {
    position: absolute;
    right: 20px;
    top: 25px;
    height: 50px;
    transform: rotateY(180deg) scale(1.2);
  }
}

.weather {
  position: absolute;
  right: -80px;
  top: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 180px;
  font-size: 30px;
  font-family: 'YouSheBiaoTiHei-2' !important;

  .title {
    color: rgb(201, 236, 255);
    // 强制单行
    white-space: nowrap !important;
    text-shadow: 0 0 10px #666;
  }

  svg {
    width: 80px;
  }

  .text {
    z-index: 999 !important;
    right: 200px;
  }
}

.faulttext {
  position: absolute;
}

.faulttext_fault {
  position: absolute;
  top: 50%;
  user-select: none;

  &::after,
  &::before {
    content: "红钢城街城市运行综合管理平台";
    position: absolute;
    left: 0;
    top: 0;
    mix-blend-mode: screen;
  }

  &::after {
    color: #ff0000;
    transform: translateX(2%);
  }

  &::before {
    color: #0000ff;
    transform: translateX(-2%);
  }
}

.settings {
  width: 60px;
  height: 60px;
  text-align: center;
  cursor: pointer;
  color: #3f91ec;
  display: block;
  position: absolute;
  font-size: 66px;
  z-index: 1200 !important;
  right: 220px;
  text-shadow: 0 0 2rem #3f91ec;
}

.setting {
  font-size: 32px !important;
}

.config {
  span {
    width: 100%;
    text-align: center;
    cursor: pointer;

    &:hover {
      background-color: #fff;
      color: #3f91ec;
    }
  }
}

.head-mode-switcher {
  position: absolute;
  bottom: -22px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(4, 16, 38, 0.85);
  border: 1px solid rgba(0, 229, 255, 0.35);
  border-radius: 20px;
  padding: 2px 8px;
  backdrop-filter: blur(8px);
  z-index: 100;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.6);

  .mode-tab {
    cursor: pointer;
    font-size: 12px;
    padding: 2px 10px;
    border-radius: 12px;
    color: #8cbbe8;
    transition: all 0.3s;
    user-select: none;
    white-space: nowrap;

    &:hover {
      color: #00f0ff;
      background: rgba(0, 229, 255, 0.15);
    }

    &.active {
      color: #ffffff;
      background: linear-gradient(90deg, #0096ff 0%, #00e5ff 100%);
      font-weight: bold;
      box-shadow: 0 0 10px rgba(0, 229, 255, 0.7);
    }
  }
}
</style>