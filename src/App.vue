<template>
  <div class="app" v-if="search">
    <!-- 全域一体化街区GIS与物联网态势智能协同云平台（100%单页三维一体化，极度丝滑） -->
    <div class="main-view-block">
      <v-scale-screen width="1920" height="1080">
        <index v-loading="loading" :element-loading-text="loadText" :currentView="currentView" @switchView="changeView" />
      </v-scale-screen>
      <div class="mapbox-maps">
        <div id="map"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import VScaleScreen from 'v-scale-screen'
import index from "@/components/index.vue";
import constants from "@/constants";

// init
import '@/assets/css/normalize.css'
import '@/assets/css/reset.css'

//icon
import '@/assets/icon/iconfont.js'

const loading = ref(true)
const loadText = ref(constants.loading)
const search = ref(true)
const currentView = ref('gis') // 'gis' | 'iot' | 'twin'

const changeView = (view) => {
  currentView.value = view
  if (view === 'gis') {
    setTimeout(resize, 100)
  }
}

const resize = () => {
  loading.value = false
  // 重新渲染地图
  if (window.map && typeof window.map.resize === 'function') {
    window.map.resize()
  }
}

onMounted(() => {
  if (!window.location.search) {
    const defaultSearch = '?name=' + encodeURIComponent('红卫路街')
    window.history.replaceState(null, '', defaultSearch)
    search.value = true
  } else {
    search.value = true
  }

  window.onload = function () {
    // 每次页面重新渲染都触发scale事件
    resize()
  }

  if (document.readyState === 'complete') {
    setTimeout(resize, 300)
  }

  // 当页面重新渲染时，触发resize事件
  window.onresize = function () {
    loading.value = true
    resize()
  }
})
</script>
<style lang="scss">
@font-face {
  font-family: 'YouSheBiaoTiHei-2';
  src: url('./assets/font/YouSheBiaoTiHei-2.ttf') format('truetype');
}

#app {
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, #2d6082 20%, #273964 80%);
  // background: #020a17;
  font-size: 16px;
}

.app {
  // font-family: 'YouSheBiaoTiHei-2' !important;
  color: #e6f5fe;
}

.body {
  overflow: hidden;

  .app {
    overflow: hidden;
  }
}

.v-screen-box {
  position: relative !important;
  pointer-events: none !important;
}

.screen-wrapper {
  overflow: hidden !important;
  pointer-events: none !important;
}

.el-overlay-dialog {
  overflow: hidden !important;
}

.el-overlay {
  position: absolute !important;
  height: 10000px !important;
}

.el-dialog {
  z-index: 9999 !important;
}

.main-view-block {
  width: 100%;
  height: 100%;
  position: relative;
}

.sub-screen-view {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2000;
  background: #03050c;
  overflow: hidden;
}
</style>
