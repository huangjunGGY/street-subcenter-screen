<template>
  <div class="iot-right-container">
    <ItemWrap class="iot-card-item trend-card" title="报警次数趋势">
      <RightTop />
    </ItemWrap>

    <ItemWrap class="iot-card-item rank-card" title="报警排名 (TOP8)" style="padding: 0 12px 10px 12px">
      <RightCenter />
    </ItemWrap>
  </div>
</template>

<script setup>
import ItemWrap from "components-vue/data/item-wrap.vue";
import RightTop from "bigscreen/right/top.vue";
import RightCenter from "bigscreen/right/center.vue";
</script>

<style scoped lang="scss">
.iot-right-container {
  width: 100%;
  height: 949px;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;

  .iot-card-item {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.65), 0 0 15px rgba(0, 229, 255, 0.12) inset;

    &.trend-card {
      height: 440px;
    }

    &.rank-card {
      height: 492px;
    }
  }
}
</style>
