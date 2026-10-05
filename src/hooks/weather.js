import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useStore = defineStore('counter', () => {
  const value = ref({})
  function fn(newValue) {
    value.value = newValue
  }

  const change = ref(()=>{})
  function setChange(newValue) {
    change.value = newValue
  }

  return { value, fn, change, setChange }
})
