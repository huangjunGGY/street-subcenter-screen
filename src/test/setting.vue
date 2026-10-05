<template>
  <div class="bigscreen-setting-btn" @click="visible = true">
    <span>⚙ 配置</span>
  </div>

  <el-drawer
    v-model="visible"
    title="大屏显示与滚动配置"
    direction="rtl"
    size="320px"
    class="setting-drawer"
  >
    <div class="setting-form">
      <div class="setting-row">
        <span>自适应等比缩放：</span>
        <el-switch v-model="settingStore.isScale" />
      </div>
      <div class="setting-row">
        <span>告警列表无缝轮播：</span>
        <el-switch v-model="settingStore.indexConfig.leftBottomSwiper" />
      </div>
      <div class="setting-row">
        <span>轮播滚动步长：</span>
        <el-slider v-model="settingStore.defaultOption.step" :min="0.2" :max="2" :step="0.1" />
      </div>
    </div>
  </el-drawer>
</template>

<script setup>
import { ref } from 'vue'
import { useSettingStore } from '@/test/stores/setting'

const visible = ref(false)
const settingStore = useSettingStore()
</script>

<style scoped lang="scss">
.bigscreen-setting-btn {
  position: fixed;
  bottom: 8px;
  right: 8px;
  z-index: 999;
  background: rgba(0, 22, 50, 0.65);
  border: 1px solid rgba(0, 229, 255, 0.35);
  color: #79caff;
  padding: 4px 10px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 11px;
  backdrop-filter: blur(8px);
  opacity: 0.6;
  transition: all 0.3s;
  user-select: none;

  &:hover {
    opacity: 1;
    color: #00f0ff;
    border-color: #00f0ff;
    background: rgba(0, 35, 80, 0.85);
    box-shadow: 0 0 12px rgba(0, 229, 255, 0.5);
  }
}

.setting-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  color: #fff;

  .setting-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
  }
}
</style>
