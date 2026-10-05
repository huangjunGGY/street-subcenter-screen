import {
    defineStore
} from 'pinia'

export const useDataStore = defineStore('data', () => {

    const data = ref({})

    const storeData = (name, value) => {
        data.value[name] = value
    }

    return {
        data,
        storeData,
    }
})
