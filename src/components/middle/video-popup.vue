
<template>
    <div class="flex">
        <el-tree-v2 :data="d" :props="props" :height="600" style="width: 200px;" @node-click="handleNodeClick"
            v-loading="loading" />

        <el-table ref="multipleTable" :data="tableData.list" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" />
            <el-table-column prop="deviceId" label="设备编号">
            </el-table-column>
            <el-table-column prop="uuid" label="uuid">
            </el-table-column>
            <el-table-column prop="name" label="名称">
            </el-table-column>
            <el-table-column label="所属分组" width="150">
                {{ group }}
            </el-table-column>
            <el-table-column prop="status" label="状态" width="100">
                <template #default="{ row }">
                    {{ row.status === 'STATUS_INIT' ? '初始化' : row.status === 'STATUS_ONLINE' ? '在线' : '离线' }}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
                <!-- 详情 -->
                <template #default="{ row }">
                    <el-button type="text" size="small" @click="handleDetail(row)">详情</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <el-button @click="toggleSelection()">清空选择</el-button>
    <center><el-button style="width: 300px;" @click="add">保存</el-button></center>
</template>

<script setup>
import { asyvideogroup, asyvideolist, asyvideadd } from '@/api'

import { useInfoStore } from 'hooks/info'

const info = useInfoStore()
console.log(info.info);


const loading = ref(true)


const d = ref({})


const getV = async () => {
    const group = await asyvideogroup()

    console.log(group, 'group');

    if (group.data) {
        // group所有子孙节点childrenNode替换
        const replace = (node) => node.map((item) => {
            const { childrenNode, name, ...rest } = item
            return {
                ...rest,
                label: name,
                id: name,
                children: childrenNode ? replace(childrenNode) : undefined,
            }
        })

        const arr = replace(group.data.childrenNode)

        console.log(arr, 'group.data.childrenNode');

        loading.value = false
        d.value = arr
    }
}

getV()


const selection = ref([])
const handleSelectionChange = (val) => {
    selection.value = val
}

const add = async () => {
    // 获取已选择的设备
    console.log(selection.value, 'selection');

    const arr = selection.value.map((item) => ({
        streetName: info.info.streetName,
        cameraUuid: item.uuid,
        zoneUuid: item.parentUuid,
        commandType: "PLAY",
        videoStatus: "1" // 选1禁0
    }))

    const res = await asyvideadd(arr)

    console.log(res, 'res')

    if(res.code === 0) {
        ElMessage.success(res.data)
        toggleSelection() // 清空选择
        // 关闭弹窗
        info.closeVideoPopup()
    }else{
        ElMessage.error(res.data)
    }
}


const tableData = reactive({
    list: []
})

const group = ref("")

const handleNodeClick = async (val) => {
    console.log(val.stationId);

    const parentDeviceId = val.stationId

    const list = await asyvideolist({
        parentDeviceId
    })

    console.log(list.data.records, 'list');

    group.value = val.label
    tableData.list = list.data.records
}

const handleDetail = (row) => {
    console.log(row);
}


const multipleTable = ref()
const toggleSelection = (rows) => {
  if (rows) {
    rows.forEach((row) => {
      multipleTable.value.toggleRowSelection(row, undefined)
    })
  } else {
    multipleTable.value.clearSelection()
  }
}

const props = {
    value: 'id',
    label: 'label',
    children: 'children',
}

</script>
<style>
.el-table__inner-wrapper {
    height: 580px !important;
}
</style>
