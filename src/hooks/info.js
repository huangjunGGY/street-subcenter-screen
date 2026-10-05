import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

// 接口拿到以后的全局信息收集对象

export const useInfoStore = defineStore('info', () => {
  const info = ref({})
  function update(newObj) {
    info.value = Object.assign({}, info.value, newObj)
  }

  const videoPopup = ref(false)
  function openVideoPopup() {
    videoPopup.value = true
  }
  function closeVideoPopup() {
    videoPopup.value = false
  }

  return { info, update, videoPopup, openVideoPopup, closeVideoPopup }
})
