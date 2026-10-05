<template>
  <BorderBox11 title="街道服务力量" style="height: 200px;" :color="['#3f91ec','rgb(33, 57, 101)']" backgroundColor="rgba(33, 57, 101,.2)">
    <div class="jdfwll flex flex-wrap">

      <div class="item flex flex-wrap justify-center" @click="showDialog('gridCenterManList')">
        <div>{{ power.gridCenter }}</div>
        <div class="num">{{ power.gridCenterManNum }}</div>
      </div>

      <div class="item flex flex-wrap justify-center" @click="showDialog('lawEnforcementCenterManList')">
        <div>{{ power.lawEnforcementCenter }}</div>
        <div class="num">{{ power.lawEnforcementCenterManNum }}</div>
      </div>

      <div class="item flex flex-wrap justify-center" @click="showDialog('partyMassServiceCenterManList')">
        <div>{{ power.partyMassServiceCenter }}</div>
        <div class="num">{{ power.partyMassServiceCenterManNum }}</div>
      </div>

      <div class="item flex flex-wrap justify-center" @click="showDialog('publicAdministrationOfficeManList')">
        <div>{{ power.publicAdministrationOffice }}</div>
        <div class="num">{{ power.publicAdministrationOfficeManNum }}</div>
      </div>

      <div class="item flex flex-wrap justify-center" @click="showDialog('publicSecurityOfficeManList')">
        <div>{{ power.publicSecurityOffice }}</div>
        <div class="num">{{ power.publicSecurityOfficeManNum }}</div>
      </div>

      <div class="item flex flex-wrap justify-center" @click="showDialog('publicServiceOfficeManList')">
        <div>{{ power.publicServiceOffice }}</div>
        <div class="num">{{ power.publicServiceOfficeManNum }}</div>
      </div>
    </div>
  </BorderBox11>
  <popup v-model="centerDialogVisible" title="街道服务力量" class="fwll">
    <el-descriptions :title="item.name" v-for="(item, index) in s" :key="index">
      <el-descriptions-item label="手机号">{{ item.telephone }}</el-descriptions-item>
      <el-descriptions-item label="地址">{{ item.orgNamePath }}</el-descriptions-item>
      <el-descriptions-item label="所属">{{ item.orgName }}</el-descriptions-item>
    </el-descriptions>
  </popup>
</template>

<script setup>
import { asyforce } from '@/api'
import popup from 'components/popup.vue'

let streetName = ''
if (window.location.search) {
  streetName = decodeURI(window.location.search.split("=")[1])
}

const s = ref({})
const centerDialogVisible = ref(false)

const showDialog = (selector) => {
  centerDialogVisible.value = true
  s.value = power.value[selector]
  console.log(power.value[selector], "66666666");
}

const power = ref({})
const getasypower = async () => {
  const res = await asyforce({
    streetName
  })
  power.value = res.data
  console.log(res.data, 'power');
}
getasypower()

</script>

<style lang="less" scoped>
.jdfwll {
  padding-top: 70px;
  padding-bottom: 20px;

  .item {
    width: calc(100% / 3);
    cursor: pointer;
    margin-bottom: 10px;

    div {
      width: 100%;
      text-align: center;
    }
  }
}

.num {
  font-size: 30px;
  line-height: 30px;
}

.fwll {
  .el-descriptions {
    margin: 20px 0;
  }
}
</style>
