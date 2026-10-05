# street-subcenter-screen

> **全域一体化街区 GIS 与物联网态势智能协同云平台**  
> 基于 Vue 3 + Vite + ECharts + Mapbox GL + Three.js + UnoCSS 构建的新一代数字孪生与智慧城市大屏可视化综合协同系统。

---

## 📖 项目简介

`street-subcenter-screen`（街道分中心大屏）是一套专为智慧街区治理与应急协同指挥打造的工业级数据可视化大屏系统。系统深度整合空间地理信息（GIS）、物联网传感器态势（IoT）与 3D 城市数字孪生（Twin）技术，构建了“宏观统揽、微观精细、虚实联动、无缝切换”的一体化街区治理数字底座。

### 🌟 核心特性

- 🏙️ **三大视界模式常驻无缝切换**：
  - **街区治理 (GIS)**：全域网格分布、实有人口与房屋态势、民政救助、文教卫阵地、视频监控轮巡、12345民呼我应工单流转、街道值班联动。
  - **物联全态感知 (IoT)**：智能协同感知、物联传感设备在线监控、烟感/地磁/井盖等多维指标告警处置。
  - **3D数字孪生 (Twin)**：三维精细化街区模型渲染、空间态势多维透视与立体推演联动。
- ⚡ **内存常驻与丝滑过渡机制**：
  - 核心面板与地图视界常驻内存（`v-show` + 动效过渡），杜绝频繁创建/销毁 DOM 带来的性能抖动与地图底图二次加载闪烁。
- 🖥️ **全终端等比自适应缩放**：
  - 基于 `v-scale-screen` 设定 1920×1080 标准大屏画布，在任意物理分辨率、投影拼接屏与不同长宽比显示器上保持像素级精准还原与无形变缩放。
- 📊 **硬核可视化与科技感美学**：
  - 深度定制 ECharts 5 动态图表、Mapbox GL 高清矢量渲染与动态气泡弹窗、DataV 科技质感边框与流光特效。
- 🔀 **全链路 Mock 与反向代理自由切换**：
  - 内置 Vite 中间件级路由拦截 Mock，支持随时与后端真实 API 代理直连，零依赖即可完整本地离线运行。

---

## 🛠️ 技术栈清单

| 分类 | 核心技术 / 依赖 |
| :--- | :--- |
| **基础底座** | [Vue 3.3+](https://vuejs.org/) (Composition API, `<script setup>`), [Vite 4](https://vitejs.dev/) |
| **状态管理** | [Pinia 3](https://pinia.vuejs.org/) + `pinia-plugin-persistedstate` (持久化缓存) |
| **可视化图表** | [ECharts 5.6](https://echarts.apache.org/) + `vue-echarts`, `@kjgl77/datav-vue3` |
| **空间与三维** | [Mapbox GL](https://docs.mapbox.com/mapbox-gl-js/) + `mapbox-gl-animated-popup`, [Three.js](https://threejs.org/) |
| **大屏适配** | `v-scale-screen` (1920×1080 响应式等比缩放) |
| **UI 体系** | [Element Plus](https://element-plus.org/) (默认中文), [Ant Design Vue 4](https://antdv.com/), [Vant 4](https://vant-ui.github.io/vant/), [View UI Plus](https://www.iviewui.com/) |
| **样式与原子化** | [UnoCSS](https://unocss.dev/), Sass / SCSS, Less, `@unocss/reset/normalize.css` |
| **工具库** | Axios, Day.js, Moment.js, jQuery, Chinese-to-pinyin, GSAP, FastClick |

---

## 📁 目录结构

```text
street-subcenter-screen/
├── public/                 # 静态公共资源（SVG图标、图层文件、地图资源）
├── src/
│   ├── api/                # 后端数据接口请求封装
│   ├── assets/             # 静态素材（CSS重置样式、科技字体、Iconfont、图片背景）
│   ├── bigscreen/          # 大屏专有分栏面板与视界模块
│   │   ├── center/         # 中部核心视界（GIS 地图层、IoT 中心联动、Twin 3D视图）
│   │   ├── left/           # 左侧业务指标面板（基础态势、民政救助、人口房屋等）
│   │   └── right/          # 右侧业务指标面板（告警处置、网格工单、值班排班等）
│   ├── components/         # 全局通用业务组件
│   │   ├── head.vue        # 大屏顶部科技导航栏与视界切换控制器
│   │   ├── index.vue       # 主屏面板装配与过渡分发中枢
│   │   ├── list.vue        # 通用大屏列表与表格联动钻取组件
│   │   ├── popup.vue       # 大屏科技弹窗与模态对话框封装
│   │   └── weather.vue     # 实时天气与气象预警组件
│   ├── components-vue/     # 辅助业务组件
│   ├── constants.js        # 系统全局静态常量与文案配置
│   ├── data/               # 离线地图 GeoJSON 与空间坐标定义
│   ├── hooks/              # 自定义组合式 API (Vue Composables)
│   ├── lib/                # 核心库封装（rem 换算、echarts 统一注册等）
│   ├── mock/               # 离线模拟数据源（基础体征、人口、网格、视频、工单等）
│   ├── request/            # Axios 请求实例与拦截器配置
│   ├── services/           # 业务服务层抽象
│   ├── App.vue             # 根组件（大屏容器、全局视口缩放与地图底座宿主）
│   └── main.js             # 入口文件（全局组件挂载、样式注入、Mock 开启）
├── .env.dev                # 开发环境变量配置
├── .env.prod               # 生产环境变量配置
├── uno.config.js           # UnoCSS 原子化规则配置
├── vite.config.js          # Vite 构建配置、路径别名与本地 Mock 中间件
└── package.json            # 依赖清单与运行脚本
```

---

## 🚀 快速上手

### 1. 环境准备
- 推荐使用 Node.js 18+ 或 Bun 环境。

### 2. 安装依赖
```bash
# 使用 npm
npm install

# 或使用 pnpm / bun
bun install
```

### 3. 本地开发与启动
```bash
npm run dev
# 或
bun run dev
```
启动后在浏览器打开终端提示的地址（如 `http://localhost:5173/`）。  
> **说明**：系统会自动在 URL 附加街道参数（默认 `?name=红卫路街`）以定位空间与业务数据集。

### 4. 生产打包与构建
```bash
npm run build
```
打包生成文件将输出至 `dist/` 目录。

### 5. 本地预览构建产物
```bash
npm run preview
```

---

## 🌐 在线演示与 GitHub Pages 部署

本项目已预置自动部署工作流（[deploy.yml](file:///.github/workflows/deploy.yml)）与资源相对路径适配（`base: './'`），可零成本开启 GitHub Pages 在线实时预览：

- **在线预览地址**：`https://huangjunGGY.github.io/street-subcenter-screen/`
- **自动部署流程**：
  1. 将代码 push 到 GitHub `main` 分支；
  2. 在 GitHub 仓库页面点击 **Settings** -> **Pages**；
  3. 在 **Build and deployment** 下方的 **Source** 选择 **GitHub Actions**；
  4. 随后每次 push 代码，GitHub Actions 将全自动构建并发布到 GitHub Pages。

---

## ⚙️ 环境配置说明

项目通过环境变量文件进行环境差异化管理：

### `.env.dev`（开发环境）
```ini
NODE_ENV=development
VUE_APP_API_BASE_URL=/api
VITE_APP_NAME=jxstjh
# 后端代理真实服务地址（若后端服务地址变动可在此直接指定）
VITE_PROXY_TARGET=http://192.168.1.138:9999
```

### `.env.prod`（生产环境）
```ini
NODE_ENV=production
VUE_APP_API_BASE_URL=/api
VITE_APP_NAME=screen-of-street
```

> **Mock 机制提示**：在 `vite.config.js` 中内置了代理拦截机制，未联调时自动拦截 `/admin/*` 路径并返回 `src/mock/` 目录下的高保真真实模拟数据；关闭 mock 即可无缝穿透代理至后端真实服务。

---

## 🧩 核心业务公共组件使用指南

### 1. 通用弹窗组件 `<popup>`

基于 Element Plus `el-dialog` 深度美化定制，已全局注册为 `<popup>`，自动适配大屏层级与拖拽特性。

#### 使用示例
```vue
<template>
  <button @click="visible = true">打开详情弹窗</button>

  <popup v-model="visible" title="告警处置详情" w="65%" :mask="true">
    <div class="dialog-content">
      <p>当前事件：{{ detailData.name }}</p>
      <p>上报时间：{{ detailData.time }}</p>
    </div>
  </popup>
</template>

<script setup>
import { ref } from 'vue'

const visible = ref(false)
const detailData = ref({
  name: '智慧井盖异动告警',
  time: '2026-10-05 14:30:00'
})
</script>
```

#### Props 参数说明
| 属性名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| `modelValue` | `Boolean` | `false` | 控制弹窗显示隐藏（支持 `v-model`） |
| `title` | `String` | `''` | 弹窗顶部标题 |
| `w` | `String` | `'70%'` | 弹窗宽度 |
| `drag` | `Boolean` | `false` | 是否开启可拖拽模式 |
| `mask` | `Boolean` | `false` | 是否显示背景遮罩层 |
| `destroy` | `Boolean` | `false` | 关闭时是否销毁内部 DOM |
| `z` | `Number` | `2000` | 弹窗 `z-index` 层级 |

---

### 2. 态势列表与数据钻取组件 `<list>`

已全局注册为 `<list>`，支持列表展示、字段映射提取、点击条目自动弹出详细表格并支持折叠展开查看明细。

#### 基础用法
```vue
<template>
  <list
    class="flex-wrap"
    title="网格责任人列表"
    :data="gridList"
    :pop="true"
    :simple="{
      content: 'grid-num-highlight',
      name: 'grid-name-label'
    }"
    :short="['name', 'phone', 'gridName']"
    :detail="{
      name: '网格员姓名',
      phone: '联系电话',
      gridName: '负责网格',
      remark: '责任区备注'
    }"
  />
</template>

<script setup>
import { ref } from 'vue'

const gridList = ref([
  { name: '张三', phone: '13800000000', gridName: '第一网格', content: '网格长', remark: '常态化巡查中' },
  { name: '李四', phone: '13900000000', gridName: '第二网格', content: '专职网格员', remark: '日常走访中' }
])
</script>
```

#### 动态监听异步请求更新渲染
```vue
<script setup>
import { ref, watch } from 'vue'

const currentMonth = ref('2026-10')
const dataList = ref([])

const fetchReportData = async (month) => {
  const res = await queryStreetStats({ month })
  dataList.value = res.data || []
}

// 监听月份切换重新请求
watch(() => currentMonth.value, (newMonth) => {
  fetchReportData(newMonth)
}, { immediate: true })
</script>
```

---

## 🖥️ 大屏自适应适配与注意事项

1. **基准分辨率**：系统默认以 **1920 × 1080** 为标准设计稿基准，通过 `v-scale-screen` 自动计算当前视口并等比缩放居中展示。
2. **地图窗口重置**：切换三大视界模式（GIS / IoT / Twin）或触发窗口 resize 时，系统会自动调用 `window.map.resize()` 保持底图投影视口同步，避免三维或瓦片地图出现黑边。
3. **字体渲染**：项目默认引入并配置了科技风格展示字体 `YouSheBiaoTiHei-2`，确保大屏主标题与指标数值保持高冲击力视觉效果。

---

## 📄 授权与维护

- **项目名称**：`street-subcenter-screen` (街道分中心大屏)
- **维护团队**：智慧城市前端研发团队
- **适用场景**：智慧街道指挥大屏 / 城市运营中心 (IOC) / 数字孪生应急调度
