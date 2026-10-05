<template>
    <el-button @click="exporter">导出</el-button>
    <el-button @click="imp = true">导入</el-button>
    <div class="duty-popup flex justify-between items-center">
        <el-calendar class="calendar" ref="calendar">
            <template #date-cell="{ data }">

                <p v-show="false" class="true-day">{{ data.day }}</p>
                <p>
                    {{ data.day.split('-').slice(1)[1] }}
                </p>

                <el-popover placement="top-start" :title="obj[data.day]?.streetPrincipal + '的联系电话'" :width="200"
                    trigger="hover" :content="obj[data.day]?.streetPrincipalPhone">
                    <template #reference>
                        <p>{{ obj[data.day]?.streetPrincipal }}</p>
                    </template>
                </el-popover>

                <el-popover placement="top-start" :title="obj[data.day]?.streetWatchkeeperName + '的联系电话'" :width="200"
                    trigger="hover" :content="obj[data.day]?.streetWatchkeeperPhone">
                    <template #reference>
                        <p>{{ obj[data.day]?.streetWatchkeeperName }}</p>
                    </template>
                </el-popover>

                <el-result icon="success" title="已填完毕" class="result"
                    v-if="unsubdata[data.day]?.streetPrincipal && unsubdata[data.day]?.streetPrincipalPhone && unsubdata[data.day]?.streetWatchkeeperName && unsubdata[data.day]?.streetWatchkeeperPhone"></el-result>
                <el-result icon="error" title="信息缺失" class="result"
                    v-if="(unsubdata[data.day]?.streetPrincipal || unsubdata[data.day]?.streetPrincipalPhone || unsubdata[data.day]?.streetWatchkeeperName || unsubdata[data.day]?.streetWatchkeeperPhone) && (!unsubdata[data.day]?.streetPrincipal || !unsubdata[data.day]?.streetPrincipalPhone || !unsubdata[data.day]?.streetWatchkeeperName || !unsubdata[data.day]?.streetWatchkeeperPhone)"></el-result>
            </template>
        </el-calendar>
        <el-form :model="unsubdata[day]" label-width="120px" style="flex: 1">
            <el-form-item label="负责人">
                <el-input v-model="unsubdata[day].streetPrincipal"></el-input>
            </el-form-item>
            <el-form-item label="联系方式">
                <el-input v-model="unsubdata[day].streetPrincipalPhone"></el-input>
            </el-form-item>
            <el-form-item label="值班人员">
                <el-input v-model="unsubdata[day].streetWatchkeeperName"></el-input>
            </el-form-item>
            <el-form-item label="联系方式">
                <el-input v-model="unsubdata[day].streetWatchkeeperPhone"></el-input>
            </el-form-item>
            <el-form-item label="值班备注">
                <el-input type="textarea" v-model="unsubdata[day].dutyDes"></el-input>
            </el-form-item>
            <el-form-item>
                <div class="submit">
                    <el-button type="primary" @click="submit">提交</el-button>
                </div>
            </el-form-item>
        </el-form>
    </div>
    <popup title="值班导入" v-model="imp" align-center>
        <el-upload v-model:file-list="fileList" class="upload-demo" accept="xlxs" drag :on-progress="handleProgress">
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
                拖拽文件到此处或 <em>点击上传</em>
            </div>
            <template #tip>
                <div class="el-upload__tip">
                    仅支持xlxs格式文件
                </div>
                <div class="flex justify-center">
                    <el-button @click="open">模板下载</el-button>
                </div>
            </template>
        </el-upload>
        <el-button type="primary" @click="handleExceed">确认上传</el-button>
    </popup>
</template>

<script setup>
import $ from 'jquery'
import { asydutyadd, asydutylist, asydutyexport, asydutyimport, getmuban } from '@/api'

import { useInfoStore } from 'hooks/info'


const fileList = ref([])

const handleProgress = (info, file) => {
    fileList.value.push(file)
}

const open = () => {
    window.open(getmuban(), '_blank')
}

const info = useInfoStore()
console.log(info.info);


const day = ref("")
const unsubdata = reactive({
    [day.value]: {
        streetPrincipal: '',
        streetPrincipalPhone: '',
        streetWatchkeeperName: '',
        streetWatchkeeperPhone: '',
        streetDutyDate: null,
        dutyDes: '',
        streetDutyDate: day.value,
        streetName: info.info.streetName
    }
})


const submit = async () => {
    // 去除空值项
    Object.keys(unsubdata).forEach(key => {
        if (!unsubdata[key].streetPrincipal && !unsubdata[key].streetPrincipalPhone && !unsubdata[key].streetWatchkeeperName && !unsubdata[key].streetWatchkeeperPhone && !unsubdata[key].dutyDes) {
            delete unsubdata[key]
        }
    });

    const res = await asydutyadd(Object.values(unsubdata));
    if (res.data) {
        ElMessage.success('提交成功');
        // 清空表单
        Object.keys(unsubdata).forEach(key => {
            unsubdata[key] = {
                streetPrincipal: '',
                streetPrincipalPhone: '',
                streetWatchkeeperName: '',
                streetWatchkeeperPhone: '',
                streetDutyDate: null,
                dutyDes: '',
                streetDutyDate: day.value,
                streetName: info.info.streetName
            };
        });
        // 重新获取列表
        getdutylist();
    } else {
        ElMessage.error(res.msg);
    }
}


const list = ref([])
const obj = reactive({})
const getdutylist = async () => {
    const res = await asydutylist({
        streetName: info.info.streetName
    })
    list.value = res.data.records
    res.data.records.forEach(item => {
        obj[item.streetDutyDate] = item
    })
    console.log(res.data, 'list');
}
getdutylist()


onMounted(() => {
    $('td').click(function (e) {
        const trueDay = e.target.parentNode.querySelector('.true-day').innerText;
        day.value = trueDay

        console.log(obj)
        if (obj[trueDay]) {
            ElMessage.error("已有数据");
        }

        if (!unsubdata[day.value] && !obj[day.value]) {
            unsubdata[day.value] = {
                streetPrincipal: '',
                streetPrincipalPhone: '',
                streetWatchkeeperName: '',
                streetWatchkeeperPhone: '',
                streetDutyDate: null,
                dutyDes: '',
                streetDutyDate: day.value,
                streetName: info.info.streetName
            }
        }
        console.log(unsubdata);
    })

    day.value = $('.is-today').find('.true-day').text()
    unsubdata[day.value] = {
        streetPrincipal: '',
        streetPrincipalPhone: '',
        streetWatchkeeperName: '',
        streetWatchkeeperPhone: '',
        streetDutyDate: null,
        dutyDes: '',
        streetDutyDate: day.value,
        streetName: info.info.streetName
    }
    // 清除key为空
    Object.keys(unsubdata).forEach(key => {
        if (!key) {
            delete unsubdata[key]
        }
    });
})

const exporter = () => {
    window.open(asydutyexport({
        streetName: info.info.streetName
    }))
}


const imp = ref(false)


const handleExceed = async () => {
    // console.log(JSON.stringify(files));

    if (fileList.value[0].raw.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        ElMessage.error('仅支持xlxs格式文件')
        return
    }

    const file = fileList.value[0].raw
    const formData = new FormData()
    formData.append('file', file)
    formData.append('streetName', info.info.streetName)

    const res = await asydutyimport(formData)

    if (res.data.code === 200) {
        ElMessage.success('导入成功')
        fileList.value = []
        getdutylist()
    } else {
        ElMessage.error(res.data.msg)
    }
}

const calendar = ref(null)
// calendar非当前选中月份的日期不可选


</script>

<style lang="less">
.duty-popup {
}

.submit {
    width: 100%;
    text-align: center;
}

.calendar {
    width: 60% !important;
}

.is-selected {
    color: #000;
    position: relative;

    p {
        color: #000 !important;
    }
}

.el-calendar-table .el-calendar-day:hover {
    color: #000 !important;

    p {
        color: #000 !important;
    }
}

.result {
    width: 60px;
    padding: 0 !important;

    .el-result__icon,
    svg {
        width: 30px !important;
    }

    .el-result__title {
        margin-top: 0 !important;

        p {
            font-size: 12px !important;
        }
    }
}

.upload-demo {
    * {
        font-size: 22px !important;
    }

    .el-upload__tip {
        text-align: center;
    }
}
</style>
