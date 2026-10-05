
<!-- 实现一个滚动播放的组件，四个一排，向上滑动 -->
<template>
    <div class="scroll-play">
        <div class="scroll-play__wrapper">
            <div class="scroll-play__content" @mouseenter="stopScroll" @mouseleave="startScroll">
                <BorderBox11 title="事件处理" style="height: 160px; padding-top: 50px; padding-left: 15px;" :color="['#3f91ec','rgb(33, 57, 101)']" backgroundColor="rgba(33, 57, 101,.2)">
                    <div class="scroll-play__item" v-for="(item, index) in state.list" :key="index"
                        @click="click_item(index)">
                        <p class="scroll-play__item-name"><el-icon color="#fff" size="24"><WarnTriangleFilled /></el-icon>&nbsp;{{ item }}</p>
                    </div>
                </BorderBox11>
            </div>
        </div>
    </div>
    <popup v-model="centerDialogVisible" title="事件详情" class="scroll">
        <el-descriptions>
            <el-descriptions-item label="办理类型id">{{ type(detail.allocateMark) }}</el-descriptions-item>
            <el-descriptions-item label="派发时间">{{ detail.allocateTime }}</el-descriptions-item>
            <el-descriptions-item label="案件公文号">{{ detail.caseNumber }}</el-descriptions-item>
            <el-descriptions-item label="案件状态">{{ detail.caseState }}</el-descriptions-item>
            <el-descriptions-item label="录入时间">{{ detail.createTime }}</el-descriptions-item>
            <el-descriptions-item label="第三方评价员满意度">{{ detail.evaluatorSatisfied }}</el-descriptions-item>
            <el-descriptions-item label="详细地址">{{ detail.eventAddress }}</el-descriptions-item>
            <el-descriptions-item label="案件来话内容">{{ detail.eventContent }}</el-descriptions-item>
            <el-descriptions-item label="案件小类">{{ detail.eventTypeName }}</el-descriptions-item>
            <el-descriptions-item label="案件大类">{{ detail.eventTypeTreeName }}</el-descriptions-item>
            <el-descriptions-item label="科室名称">{{ detail.handleDeptName }}</el-descriptions-item>
            <el-descriptions-item label="经办人">{{ detail.handleName }}</el-descriptions-item>
            <el-descriptions-item label="实际完成时间">{{ detail.handleTime }}</el-descriptions-item>
            <el-descriptions-item label="纬度">{{ detail.latitude }}</el-descriptions-item>
            <el-descriptions-item label="经度">{{ detail.longitude }}</el-descriptions-item>
            <el-descriptions-item label="处理结果">{{ detail.message }}</el-descriptions-item>
            <el-descriptions-item label="群众满意度">{{ detail.peopleSatisfied }}</el-descriptions-item>
            <el-descriptions-item label="部门名称">{{ detail.receiverDeptName }}</el-descriptions-item>
            <el-descriptions-item label="规定完成时间">{{ detail.regulationTime }}</el-descriptions-item>
            <el-descriptions-item label="数据来源id">{{ detail.source }}</el-descriptions-item>
        </el-descriptions>
    </popup>
</template>

<script setup>
import { asyinform } from '@/api'

import { WarnTriangleFilled } from '@element-plus/icons-vue'

let streetName = ''
if (window.location.search) {
    streetName = decodeURI(window.location.search.split("=")[1])
}

const centerDialogVisible = ref(false)

const detail = ref({})

const defaultEvents = [
    { title: "建设一路与和平大道交汇处绿化养护工单", allocateMark: "1", allocateTime: "2024-03-15 09:20", caseNumber: "QS-20240315-01", caseState: "处理中", handleDeptName: "园林绿化科", handleName: "张建国", message: "已派遣养护人员前往现场修剪补种", peopleSatisfied: "非常满意" },
    { title: "和平大道红卫路段市政照明设施维护巡检", allocateMark: "2", allocateTime: "2024-03-15 10:15", caseNumber: "QS-20240315-02", caseState: "已完结", handleDeptName: "市政工程科", handleName: "李明", message: "路灯供电线路检修完毕，恢复正常照明", peopleSatisfied: "满意" },
    { title: "工业四路社区便民设施日常例行安全排查", allocateMark: "3", allocateTime: "2024-03-15 11:30", caseNumber: "QS-20240315-03", caseState: "进行中", handleDeptName: "网格治理中心", handleName: "王芳", message: "已协调网格员协同完成3个单元设施巡检", peopleSatisfied: "满意" },
    { title: "建设七路青年街段市容环境巡查及整治", allocateMark: "1", allocateTime: "2024-03-15 14:05", caseNumber: "QS-20240315-04", caseState: "处理中", handleDeptName: "综合执法中队", handleName: "陈伟", message: "巡查发现占道堆放已当场督促清理完毕", peopleSatisfied: "非常满意" }
];

const state = reactive({
    list: defaultEvents.map(e => e.title),
    detail: [...defaultEvents]
})

const getasyinform = async () => {
    try {
        const res = await asyinform({
            streetName
        })
        console.log(res?.data, 'inform');
        if (res && res.data && typeof res.data === 'object' && Object.keys(res.data).length > 0) {
            state.list = Object.keys(res.data)
            state.detail = Object.values(res.data)
        }
    } catch (e) {
        console.warn('asyinform error:', e)
    }
}

getasyinform()


const type = (str) => {
    const num = Number(str)
    if(num === 1) return "投诉类"
    if(num === 2) return "咨询类"
    if(num === 3) return "求助类"
    if(num === 4) return "建议类"
    if(num === 5) return "表扬类"
    return "综合类"
}


const click_item = (i) => {
    if (state.detail && state.detail[i]) {
        console.log(state.detail[i], 'scroll_detail');
        centerDialogVisible.value = true
        detail.value = state.detail[i]
    }
}


const scrollInterval = ref(null);

const startScroll = () => {
    if (scrollInterval.value) {
        clearInterval(scrollInterval.value)
    }
    // 定时滚动 3个为上限
    scrollInterval.value = setInterval(() => {
        if (Array.isArray(state?.list) && state.list.length > 1) {
            const first = state.list.shift()
            if (first !== undefined) {
                state.list.push(first)
            }
        }
    }, 2000)
};

const stopScroll = () => {
    clearInterval(scrollInterval.value);
};

onMounted(() => {
    startScroll();
})

onUnmounted(() => {
    clearInterval(scrollInterval.value);
});

</script>

<style lang="less" scoped>
.scroll-play {
    width: 100%;
    overflow: hidden;

    .scroll-play__wrapper {
        width: 100%;

        .scroll-play__content {
            width: 100%;
            height: 165px;
            overflow: hidden;
            display: flex;
            flex-wrap: wrap;
            padding: 10px 0;

            .scroll-play__item {
                width: 100%;
                box-sizing: border-box;
                padding: 2px 15px;
                line-height: 24px;
                // text-align: center;

                .scroll-play__item-name {
                    font-size: 18px;
                    color: #fff;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    cursor: pointer;
                }
            }
        }
    }
}
</style>