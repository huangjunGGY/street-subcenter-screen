<template>
  <div class="center-container">
    <BorderBox8 :reverse="true" :key="borderKey" style="width: 860px; height: 949px; margin: 0 auto;">
      <div class="map-inner">
        <Map></Map>
      </div>
    </BorderBox8>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { BorderBox8 } from '@kjgl77/datav-vue3';
import Map from "./map.vue";
import "@/assets/css/reset.css"

const borderKey = ref(0);

onMounted(() => {
  // 确保 DOM 稳定后强制触发 DataV SVG 尺寸精确重绘，保障右侧线框完整渲染
  setTimeout(() => {
    borderKey.value++;
  }, 100);
});
</script>
<style lang="less" scoped>
.center-container {
  width: 100%;
  height: 100%;
  position: relative;
  box-sizing: border-box;

  .map-inner {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    box-sizing: border-box;
    overflow: hidden;
  }
}

.hl-panel {
  color: #6F8EA8;
}
</style>
  