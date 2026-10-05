<template>
  <div class="iot-left-container">
    <ItemWrap class="iot-card-item" title="设备总览">
      <LeftTop />
    </ItemWrap>
    
    <ItemWrap class="iot-card-item" title="用户总览">
      <LeftCenter />
    </ItemWrap>

    <ItemWrap class="iot-card-item alert-card" title="实时设备提醒" style="padding: 0 10px 10px 10px">
      <LeftBottom />
    </ItemWrap>
  </div>
</template>

<script setup>
import ItemWrap from "components-vue/data/item-wrap.vue";
import LeftTop from "bigscreen/left/top.vue";
import LeftCenter from "bigscreen/left/center.vue";
import LeftBottom from "bigscreen/left/bottom.vue";
</script>

<style scoped lang="scss">
.iot-left-container {
  width: 100%;
  height: 949px;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;

  .iot-card-item {
    height: 304px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.65), 0 0 15px rgba(0, 229, 255, 0.12) inset;

    &.alert-card {
      height: 315px;
    }
  }
}
</style>
