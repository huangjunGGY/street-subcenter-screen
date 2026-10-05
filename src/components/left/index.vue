<template>
    <div class="left">
        <WeatherInfo></WeatherInfo>
        <BaseInfo></BaseInfo>
        <informationSafety></informationSafety>
        <!-- <Population></Population> -->
        <Public></Public>
    </div>
</template>

<script>
import WeatherInfo from './WeatherInfo.vue';
import informationSafety from './informationSafety.vue';
// import Population from './Population.vue';
import Public from './Public.vue';
import BaseInfo from './BaseInfo.vue';
export default {
    components: {
        WeatherInfo,
        informationSafety,
        // Population,
        Public,
        BaseInfo
    }
}
</script>

<style lang="less" scoped>
.left {
    width: 100%;
    height: 949px;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    // background-color: #041628;
}
</style>