import {
    createApp
} from 'vue'
import {
    createPinia
} from 'pinia'
import axios from 'axios'
import $ from 'jquery'
import {
    BorderBox1,
    Decoration8,
    BorderBox11,
    Decoration11,
    Decoration9,
    BorderBox13,
    Decoration4,
    Decoration7,
    BorderBox10,
    BorderBox7,
    Decoration2,
} from '@kjgl77/datav-vue3';

import App from './App.vue'

import * as echarts from "echarts";
import moment from "moment"
import DataVVue3 from '@kjgl77/datav-vue3'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import dayjs from 'dayjs'

import popup from 'components/popup.vue'
import list from 'components/list.vue'

// 添加Fastclick移除移动端点击延迟
import FastClick from 'fastclick'
// FastClick.attach(document.body)

import 'dayjs/locale/zh-cn';
//element-plus 的中文化
import locale from 'element-plus/es/locale/lang/zh-cn';


import { UploadFilled, WarnTriangleFilled } from '@element-plus/icons-vue'

import 'lib/rem'
// import 'amfe-flexible'      //将 1rem 设为 viewWidth/10

import { Toast, Dialog } from 'vant';
import 'vant/es/dialog/style'
import 'vant/es/toast/style'

import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import Antd from "ant-design-vue";
import 'ant-design-vue/dist/reset.css';

import {registerEcharts} from "lib/echarts"

// 引入view-ui-plus
import ViewUIPlus from 'view-ui-plus'
import 'view-ui-plus/dist/styles/viewuiplus.css'

// 引入unocss
import '@unocss/reset/normalize.css'
import 'virtual:uno.css'

//不使用mock 请注释掉
import { mockXHR } from "@@/mock";

mockXHR()


const app = createApp(App)

app.config.globalProperties.dataFormat = (tm) => {
    return moment(tm).format("YYYY-MM-DD HH:mm")
};
app.config.globalProperties.nameFromat = (name) => {
    var newStr;
    if (name.length === 2) {
        newStr = name.substr(0, 1) + '*';
    } else if (name.length > 2) {
        var char = '';
        for (var i = 0, len = name.length - 2; i < len; i++) {
            char += '*';
        }
        newStr = name.substr(0, 1) + char + name.substr(-1, 1);
    } else {
        newStr = name;
    }
    return newStr;
};
app.config.globalProperties.$echarts = echarts;

registerEcharts(app)

// 状态管理
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(pinia)
app.use(DataVVue3)
app.use(ViewUIPlus)
app.use(Antd)
app.use(ElementPlus, { locale })
if (typeof window !== 'undefined' && !window.location.search) {
    window.history.replaceState(null, '', '?name=' + encodeURIComponent('红卫路街'));
}

app.component('UploadFilled', UploadFilled)
app.component('WarnTriangleFilled', WarnTriangleFilled)

app.use(Toast)
app.use(Dialog)

// 全局使用axios和jquery
app.config.globalProperties.axios = axios
app.config.globalProperties.$ = $

app.config.globalProperties.$dayjs = dayjs // 将dayjs挂载到全局属性中

// 注册组件
app.component("BorderBox1", BorderBox1)
app.component("Decoration8", Decoration8)
app.component("BorderBox11", BorderBox11)
app.component("Decoration11", Decoration11)
app.component("Decoration9", Decoration9)
app.component("BorderBox13", BorderBox13)
app.component("Decoration4", Decoration4)
app.component("Decoration7", Decoration7)
app.component("BorderBox10", BorderBox10)
app.component("BorderBox7", BorderBox7)
app.component("Decoration2", Decoration2)


app.component("popup", popup)
app.component("list", list)

app.mount('#app')