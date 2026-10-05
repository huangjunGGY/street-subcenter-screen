
<template>
  <BorderBox11 title="值班信息" style="height: 140px;" :color="['#3f91ec','rgb(33, 57, 101)']" backgroundColor="rgba(33, 57, 101,.2)">
    <div class="zbxx">
      <!-- <div class="flex justify-between items-center">
        <span>{{ duty.streetDutyDate }}</span>
        <el-button type="primary" @click="all">查看全部</el-button>
      </div> -->
      <div class="flex justify-between">
        <span>值班负责人：{{ duty.streetPrincipal || '暂无' }}</span>
        <span>电话：{{ duty.streetPrincipalPhone || '暂无' }}</span>
      </div>
      <div class="flex justify-between">
        <span>值班人员：{{ duty.streetWatchkeeperName || '暂无' }}</span>
        <span>电话：{{ duty.streetWatchkeeperPhone || '暂无' }}</span>
      </div>
    </div>
  </BorderBox11>
  <popup v-model="centerDialogVisible" title="值班列表" class="duty-list">
    <el-table :data="list" style="width: 100%">
      <el-table-column prop="streetDutyDate" label="街道值班日期" />
      <el-table-column prop="streetPrincipal" label="街道负责人" />
      <el-table-column prop="streetPrincipalPhone" label="街道负责人电话" />
      <el-table-column prop="streetWatchkeeperName" label="街道值班人姓名" />
      <el-table-column prop="streetWatchkeeperPhone" label="街道值班人电话" />
    </el-table>
  </popup>
</template>

<script setup>
import { asyduty, asydutylist } from '@/api'

let streetName = ''
if (window.location.search) {
  streetName = decodeURI(window.location.search.split("=")[1])
}

const duty = ref({});
const getasyduty = async () => {
  const res = await asyduty({
    streetName
  })
  duty.value = res.data || {}
  console.log(res.data, 'duty');
}
getasyduty()


const centerDialogVisible = ref(false)
const list = ref([])

const all = () => {
  centerDialogVisible.value = true

  const getdutylist = async () => {
    const res = await asydutylist({
      streetName
    })
    list.value = res.data.records
    console.log(res.data, 'list');
  }
  getdutylist()
}

// asydutydelete
// {
//   ids: []
// }

</script>

<style lang="less">
.zbxx {
  padding: 0 30px;
  padding-top: 70px;
  position: relative;

  span {
    width: 50%;
  }
}
</style>
