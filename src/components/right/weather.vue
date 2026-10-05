
<template>
    <BorderBox11 title="生态环境" style="height: 200px;" :color="['#3f91ec','rgb(33, 57, 101)']" backgroundColor="rgba(33, 57, 101,.2)">
        <div class="sthj">
            <div>{{ weather.limitnumber }}</div>

        </div>
    </BorderBox11>
</template>
  
<script setup>
import { asypublic } from "@/api"
import { useStore } from 'hooks/weather'

let streetName = ''
if (window.location.search) {
    streetName = decodeURI(window.location.search.split("=")[1])
}

const pub = ref({})

const getPublic = async () => {
    const res = await asypublic({
        streetName
    })
    console.log(res.data, 'public');
    pub.value = res.data
}

getPublic()

const weather = ref({})
setTimeout(() => {
    const store = useStore();
    console.log(store.value, 'value');
    weather.value = store.value
})

</script>
  
<style scoped>
.sthj {
    padding-top: 70px;
    padding-bottom: 20px;
}
</style>
  