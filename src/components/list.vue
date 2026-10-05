<template lang="pug">
div(:class="p.class", class="flex", v-loading="loading")
    div.item.flex.justify-center.items-center(v-for="(item, index) in p.data", @click="showDialog(index)")
        component(:is="item.icon" v-if="item.icon")
        div.flex.flex-wrap
            div(:class="value", v-for="(value, key) in p.simple", :key="key") {{ item[key] || p.empty }}

popup(v-model="centerDialogVisible", :title="p.title", :class="p.pclass", v-if="p.pop")
    //- el-descriptions(title="", v-for="(item, index) in s.list", :key="index")
    //-     el-descriptions-item(:label="value", v-for="(value, key) in p.detail", :key="key") {{ item[key] || p.empty }}
    el-table(:data="s.list", height="100%", style="width: 100%", @row-click="rowClick", ref="table")
        el-table-column(type="expand")
            template(#default="props")
                p(:key="key", v-for="(value, key) in p.detail") {{ value + ': ' + format(props.row[key]) }}
        el-table-column(:prop="value", :label="p.detail[value]", v-for="(value, key) in p.short", :key="key")
        //- el-table-column(:prop="key", :label="value", :key="key", v-for="(value, key) in p.detail")

</template>

<script setup>

// 接口返回data有无判断


// 每个元素里包含 isSelected 字段


const props = defineProps({
    title: {
        type: String,
        default: ''
    },
    class: {
        type: String,
        default: ''
    },
    pclass: {
        type: String,
        default: ''
    },
    data: {
        type: [Array, Object],
        required: true,
        default: () => []
    },
    // key为需要的字段索引 value为对应的class
    simple: {
        type: Object,
        default: () => ({})
    },
    // key为需要的字段索引
    detail: {
        type: Object,
        default: () => ({})
    },
    pop: {
        type: Boolean,
        default: false
    },
    empty: {
        type: String,
        default: ''
    },
    icon: {
        type: [Object, String],
        default: ''
    },
    expand: {
        type: String,
        default: ''
    },
    short: {
        type: Array,
        default: () => []
    },
    default: {
        type: Object,
        default: () => ({})
    }
})

const p = ref(props)
const s = ref({}) //点击选取后的单项

const centerDialogVisible = ref(false)

const showDialog = (selector) => {
    console.log(p.value.data, "66666666");
    centerDialogVisible.value = true
    s.value = p.value.data[selector]
    console.log(p.value.data[selector], "66666666");
}

function initListHoverEffect() {
    const items = document.querySelectorAll('.item');
    items.forEach(item => {
        item.addEventListener('mouseover', () => {
            item.classList.add('active');
        });
        item.addEventListener('mouseout', () => {
            item.classList.remove('active');
        });
    });
}

onMounted(() => {
    initListHoverEffect();
});

onUpdated(() => {
    initListHoverEffect();
});

const loading = ref(true)

watch(() => p.value.data, (newValue) => {
    loading.value = false
});

const format = (ctt) => ctt === null ? '' : ctt;

const tableRef = ref(null);
const rowClick = (row, column, event) => {
}

</script>

<style lang="scss" scoped>
.item {
    cursor: pointer;

    div {
        width: 100%;
        text-align: center;
    }
}
</style>
