import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettingStore = defineStore('bigscreenSetting', () => {
  const defaultOption = ref({
    step: 0.5,
    singleHeight: 256,
    limitScrollNum: 4,
    hover: true,
    singleWaitTime: 2000,
    wheel: true,
  })

  const indexConfig = ref({
    leftBottomSwiper: true,
    rightTopType: 'line',
  })

  const isScale = ref(true)

  return {
    defaultOption,
    indexConfig,
    isScale,
  }
})
