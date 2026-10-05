<script setup>
import CapsuleChart from "components-vue/data/capsule-chart.vue";
import { currentGET } from "@/test/api";
import { ref } from "vue";

const config = ref({
  showValue: true,
  unit: "次",
});

const data = ref([]);

const getData = () => {
  currentGET("rightCenter").then((res) => {
    if (res && res.success) {
      data.value = res.data;
    } else {
      window["$message"]?.({
        text: res?.msg || "获取排名数据失败",
        type: "warning",
      });
    }
  });
};
getData();
</script>

<template>
  <div class="right_bottom">
    <CapsuleChart :config="config" class="capsule-full" :data="data"/>
  </div>
</template>

<style scoped lang="scss">
.right_bottom {
  box-sizing: border-box;
  padding: 4px 6px;
  width: 100%;
  height: 100%;

  .capsule-full {
    width: 100%;
    height: 100%;
  }
}
</style>
