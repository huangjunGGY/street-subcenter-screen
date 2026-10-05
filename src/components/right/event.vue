
<template>
    <BorderBox11 title="本月事件概览" style="height: 460px; padding-top: 70px;" :color="['#3f91ec','rgb(33, 57, 101)']" backgroundColor="rgba(33, 57, 101,.2)">
        <el-date-picker v-model="selectedMonth" type="month" :teleported="false"></el-date-picker>
        <list pop class="flex-wrap event" pclass="event-p" empty="" title="本月事件概览" :data="data" :simple="{
            'content': 'num',
            'name': ''
        }" :detail="{
            handleName: '经办人',
            caseState: '案件状态',
            eventAddress: '详细地址',
            eventContent: '案件来话内容',
            eventTypeTreeName: '案件大类',
            handleDeptName: '科室名称',
            handleTime: '实际完成时间',
            message: '处理结果',
            receiverDeptName: '部门名称',
            rksj: '入库时间',
            sfasbj: '是否按时结办',
            source: '数据来源id',
            updateTime: '更新时间'
        }" :short="['handleName', 'receiverDeptName', 'eventTypeTreeName', 'rksj', 'sfasbj', 'updateTime']"></list>
        <Pie :rank="rank" />
    </BorderBox11>
</template>

<script setup>
import Pie from "./pie.vue";
import { asycomplain } from '@/api'

let streetName = ''
if (window.location.search) {
    streetName = decodeURI(window.location.search.split("=")[1])
}

const data = ref([])

const rank = ref([])


// 当前日期转换为 2023-12 格式
const formatDate = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    return `${year}-${month}`
}
// 监听selectedMonth的变化 重新请求数据
const selectedMonth = ref(formatDate(new Date()))
watch(() => selectedMonth.value, (newValue) => {
    getasycomplain(formatDate(newValue))
});

const getasycomplain = async (month) => {
    const res = await asycomplain({
        streetName,
        month
    })
    console.log(res.data, 'tousu');
    data.value = [{
        name: "事件总数",
        content: res.data.totalEvent,
        list: res.data.totalEventList,
    }, {
        name: "已结案事件数",
        content: res.data.closedCasesNum,
        list: res.data.closedCasesList
    }, {
        name: "未结案事件数",
        content: res.data.unsolvedMatterNum,
        list: res.data.unsolvedMatterList,
    }, {
        name: "结案率",
        content: res.data.closingRate,
        list: res.data.closingRateList,
    }, {
        name: "超期率",
        content: res.data.overdueRate,
        list: res.data.overdueRateList,
    }, {
        name: "满意率",
        content: res.data.satisfactionRate,
        list: res.data.satisfactionRateList,
    }]

    rank.value = res.data.streetEventRankingList
}
getasycomplain(selectedMonth.value)

</script>

<style lang="less">
.event {
    .item {
        width: 33.3%;
        margin-top: 10px;

        .num {
            font-size: 30px;
            line-height: 30px;
            font-weight: 900;
        }
    }
}

.event-p {
    .el-descriptions {
        margin-bottom: 50px !important;
    }
}

.el-date-editor.el-input {
    margin-top: 20px;
    margin-left: 20px;
}
</style>