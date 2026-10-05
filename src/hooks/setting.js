import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useSettingStore = defineStore('setting', () => {
  const setting = ref({
    openBaimo: true
  })
  function update(newObj) {
    setting.value = Object.assign({}, setting.value, newObj)
  }

  return { setting, update }
})
