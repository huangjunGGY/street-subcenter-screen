
<template>
    <div class="right">
        <!-- <Weather/> -->
        <Duty />
        <Power />
        <ScrollPlay />
        <Event/>
    </div>
</template>

<script setup>
import Power from "./power.vue";
import Duty from "./duty.vue";
import ScrollPlay from "./scroll-play.vue";
import Weather from "./weather.vue";
import Event from "./event.vue";
</script>

<style lang="less" scoped>
.right {
    width: 100%;
    height: 949px;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
</style>