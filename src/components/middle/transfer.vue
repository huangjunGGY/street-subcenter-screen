<template>
    <div class="content">
        <div class="flex flex-wrap">

            <el-tabs v-model="activeName" class="demo-tabs w-10" @tab-click="handleClick">
                <el-tab-pane label="指挥体系" name="first">
                    <el-input v-model="query" placeholder="请输入部门关键词筛选" @input="onQueryChanged" v-if="d.length > 0" />
                    <el-tree-v2 default-expand-all ref="treeRef" :data="d" :props="defaultProps" :height="600"
                        style="width: 200px;" class="mt-1" highlight-current @node-click="handleNodeClick"
                        v-loading="loading" :filter-method="filterNode" />
                </el-tab-pane>
                <el-tab-pane label="部门" name="second">
                    <span style="font-size: 18px;">部门列表</span>
                </el-tab-pane>
            </el-tabs>
        </div>

        <div class="contacts flex flex-wrap">
            <el-table-v2 :columns="columnsConfig" :data="tableData.list" :width="900" :height="500" class="half">
            </el-table-v2>

            <div class="icons flex">
                <span class="iconfont icon-dianhua" @click="dianhua"></span>
                <span class="iconfont icon-shipin" @click="dianhua"></span>
            </div>
        </div>
        <div class="ml-2" style="width: 150px;">
            <p>已选：</p>
            <el-tag v-for="tag in selection" :key="tag" class="mx-1" closable :disable-transitions="false"
                @close="handleClose(tag)">
                {{ tag?.name }}
            </el-tag>
        </div>
    </div>
</template>

<script lang="jsx" setup>
import { asytree, asytable } from '@/api'
import '@/assets/icon/iconfont.css'
import partment from '@/data/partment'

import {
    ElTag,
    ElCheckbox
} from 'element-plus'

const loading = ref(true)

const d = ref([])

const copy = ref([])

const defaultDeptTree = [
    {
        id: 1,
        label: "青山区指挥中心",
        children: [
            {
                id: 11,
                label: "应急管理指挥部",
                children: [
                    { id: 111, label: "突发事件处置专班" },
                    { id: 112, label: "防汛抗旱应急专班" }
                ]
            },
            {
                id: 12,
                label: "城市综合治理中心",
                children: [
                    { id: 121, label: "网格化综合协调科" },
                    { id: 122, label: "市容市貌巡查督导中队" }
                ]
            },
            {
                id: 13,
                label: "红卫路街综合调度科",
                children: [
                    { id: 131, label: "东区网格联动小组" },
                    { id: 132, label: "西区便民服务站" }
                ]
            }
        ]
    }
]

const getData = async () => {
    try {
        const res = await asytree({
            deptName: "青山区"
        })
        console.log(res?.data, 'tree');

        if (res && res.data && Array.isArray(res.data.children) && res.data.children.length > 0) {
            loading.value = false
            d.value = [...res.data.children]
            copy.value = [...res.data.children]
            return
        }
    } catch (e) {
        console.warn('asytree error:', e)
    }
    loading.value = false
    d.value = defaultDeptTree
    copy.value = defaultDeptTree
}

getData()


const query = ref('')
const treeRef = ref(null)

const onQueryChanged = (query) => {
    treeRef.value.filter(query)
}


// 触发页面显示配置的筛选
const filterNode = (query, node) => {
    return node.label.includes(query)
}



const defaultProps = {
    value: 'id',
    children: 'children',
    label: 'label',
}

const tableData = reactive({
    list: []
})

let table = []

const multipleTable = ref()

const handleNodeClick = (val) => {
    console.log(val);

    const getasytable = async () => {
        try {
            const res = await asytable({
                id: val.id,
                userName: ""
            })
            console.log(res?.data, 'table');
            if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
                tableData.list = res.data
                table = res.data
                return
            }
        } catch (e) {
            console.warn('asytable error', e)
        }
        const mockContacts = [
            { id: val.id * 10 + 1, name: "值班长-张伟", orgName: val.label, sn: "13800138001", telephone: "13800138001" },
            { id: val.id * 10 + 2, name: "协调员-李敏", orgName: val.label, sn: "13900139002", telephone: "13900139002" },
            { id: val.id * 10 + 3, name: "网格员-王建国", orgName: val.label, sn: "13700137003", telephone: "13700137003" }
        ]
        tableData.list = mockContacts
        table = mockContacts
    }
    getasytable()
}

const selection = ref([])

const handleSelectionChange = (selectionArr) => {
    const item = selectionArr[selectionArr.length - 1]
    console.log(JSON.stringify(item));
    console.log(JSON.stringify(tableData.list));
    if (item) {
        selection.value = selectionArr
    }
}

const dianhua = () => {
    let str = []
    selection.value.map((item) => {
        // 从tableData.list里匹配id为item的telephone和name
        tableData.list.map((item1) => {
            if (item.id === item1.id) {
                console.log(item1.telephone, item1.name);

                str.push(`${item1.name}|9${item1.telephone}`)
            }
        })
    })

    // 安全获取userName
    let userName = "admin"
    if (document.cookie && document.cookie.includes("userName=")) {
        const parts = document.cookie.split("userName=")
        if (parts.length > 1 && parts[1]) {
            userName = parts[1].slice(0, 11)
        }
    }
    window.open(`https://10.108.84.101:444/qsVedio/meet.html?intercomUserId=${userName}&intercomCalls=${str.join(",")}&intercomTitle=huiyi`)
}


const handleClose = (tag) => {
    selection.value.splice(selection.value.indexOf(tag), 1)
}


const columns = [
    {
        key: 'name',
        title: '用户名',
        dataKey: 'name',
        width: 150,
        align: 'center',
        cellRenderer: ({ cellData: name }) => name,
    }, {
        key: 'orgName',
        title: '组织机构',
        dataKey: 'orgName',
        width: 200,
        align: 'center',
        cellRenderer: ({ cellData: orgName }) => orgName,
    }, {
        key: 'telephone',
        title: '移动端',
        dataKey: 'sn',
        width: 150,
        align: 'center',
        cellRenderer: (obj) => {
            // 如果selection.value里有obj.rowData，就显示选中状态
            let checked = false
            selection.value.map((item) => {
                if (item.id === obj.rowData.id && item.checked) {
                    checked = true
                }
            })
            return <ElCheckbox label={obj.cellData} border onClick={() => hhh(obj)} checked={checked} />
        },
    }, {
        key: 'telephone',
        title: '移动电话',
        dataKey: 'telephone',
        width: 150,
        align: 'center',
        cellRenderer: (obj) => {
            // 如果selection.value里有obj.rowData，就显示选中状态
            let checked = false
            selection.value.map((item) => {
                if (item.id === obj.rowData.id && item.checked2) {
                    checked = true
                }
            })
            return <ElCheckbox label={obj.cellData} border onClick={() => hhh2(obj)} checked={checked} />
        }
    }
]


const columns2 = [
    columns[0],
    columns[3]
]

const columnsConfig = ref(columns)


const hhh = (obj) => {
    if (obj.rowData.checked) {
        obj.rowData.checked = false
        selection.value.splice(selection.value.indexOf(obj.rowData), 1)
    } else {
        obj.rowData.checked = true
        selection.value.push(obj.rowData)
    }
}
const hhh2 = (obj) => {
    if (obj.rowData.checked2) {
        obj.rowData.checked2 = false
        selection.value.splice(selection.value.indexOf(obj.rowData), 1)
    } else {
        obj.rowData.checked2 = true
        selection.value.push(obj.rowData)
    }
}


const activeName = ref('first')

const handleClick = (tab, event) => {
    console.log(tab, event)

    activeName.value = tab.props.name

    // 如果点击的是部门
    if (tab.props.name === 'second') {
        // 采用columns2
        columnsConfig.value = columns2

        tableData.list = [...partment]

    } else {
        // 如果点击的是指挥体系
        tableData.list = []

        columnsConfig.value = columns
    }
}

watch(() => columnsConfig.value, (val) => {
    console.log(val);
})

</script>
<style lang="less">
.content {
    display: flex;

    .el-tabs__content {
        height: 600px;
        overflow-y: scroll !important;
    }
}

.contacts {
    margin-left: 25px;
    width: 100%;
    overflow-y: hidden;
}

.el-table {
    width: 100%;
}

.icons {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    z-index: 999 !important;
}

.iconfont {
    margin-left: 26px;
    width: 70px;
    height: 70px;
    display: block;
    font-size: 32px;
    cursor: pointer;
    text-align: center;
    line-height: 70px;
    border-radius: 50%;
    background: #3f91ec;
}

.el-tree {
    font-size: 20px !important;
}

.el-tag {
    --el-tag-bg-color: #3f91ec !important;
    --el-tag-text-color: #fff !important;
}

.content {
    .el-table__inner-wrapper {
        height: 580px !important;
        overflow-y: scroll !important;
    }
}

.el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
    background-color: #3f91ec !important;
}

.demo-tabs>.el-tabs__content {
    padding: 4px;
    color: #6b778c;
    font-size: 32px;
    font-weight: 600;
}

.half {

    .el-table-v2__header-cell,
    .el-table-v2__row-cell {
        width: 50% !important;
    }
}
</style>
