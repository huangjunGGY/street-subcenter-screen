<template>
  <div id="street" v-if="streetShow">
    <p>{{ streetName }}</p>
    <p>{{ streetName_pinyin }}</p>
  </div>

  <BorderBox10 class="video-dock" style="height: 120px;">
    <div class="videos">
      <div class="video" v-loading="loading[0]" :element-loading-text="loadText">
        <video id="test_video0" autoplay @click="watchVideo(0)"></video>
      </div>
      <div class="video" v-loading="loading[1]" :element-loading-text="loadText">
        <video id="test_video1" autoplay @click="watchVideo(1)"></video>
      </div>
      <div class="video" v-loading="loading[2]" :element-loading-text="loadText">
        <video id="test_video2" autoplay @click="watchVideo(2)"></video>
      </div>
      <div class="video" v-loading="loading[3]" :element-loading-text="loadText">
        <video id="test_video3" autoplay @click="watchVideo(3)"></video>
      </div>
    </div>
  </BorderBox10>

  <popup v-model="centerDialogVisible" title="监控情况" class="panel video-panel">
    <video id="video_info" autoplay></video>
  </popup>

  <!-- 街区资源与社区快速检索浮动控制坞（置于地图左上角，专业GIS控制台布局） -->
  <div class="map-filter-dock">
    <div class="dock-badge">
      <span class="dock-dot"></span>
      <span class="dock-title">辖区快控</span>
    </div>
    <el-select
      v-model="shequSelect"
      placeholder="选择社区定位"
      size="default"
      style="width: 165px"
      class="filter-select"
      clearable
      @clear="jdclear"
    >
      <el-option
        v-for="item in jdlist"
        :key="item.orgName"
        :label="item.orgName"
        :value="item.orgName"
        @click="jump(item)"
      />
    </el-select>

    <div class="filter-divider"></div>

    <el-select
      v-model="ziyuanSelect"
      multiple
      placeholder="图层要素筛选"
      size="default"
      class="filter-select"
      style="width: 235px"
    >
      <el-option v-for="item in ziyuan" :key="item.value" :label="item.label" :value="item.value">
        <div style="display: flex; align-items: center; gap: 8px;">
          <img :src="item.icon" style="width: 18px; height: 18px; object-fit: contain;" />
          <span>{{ item.label }}</span>
        </div>
      </el-option>
    </el-select>
  </div>
</template>

<script setup>

import $ from "jquery";
import axios from 'axios'
import tools from './tools'
import constants from "@/constants";

import gsap from 'gsap'
import pinyin from 'chinese-to-pinyin'

import AnimatedPopup from 'mapbox-gl-animated-popup';

// import "lib/polyfill.min.js"
import "lib/streamedian.min.js"

import { asyxy, asygriddetail, asysxt, asyhospital, asypublic } from '@/api'

import 'lib/mapbox-gl-enhance'
// 一定要引入样式， 否则有些东西显示不出来(比如导航控制条)
import 'lib/mapbox-gl-enhance.css'
import '@/data/bjData' // 边界数据
import '@/data/jd' // 街道
import '@/data/sq'
import '@/data/wg'


import { useInfoStore } from 'hooks/info'
import { useSettingStore } from 'hooks/setting';

import { useDataStore } from 'hooks/data'

const { drag } = tools;

// 遍历window.jd.features拿到所有的properties.SSJ并对应上整个item 生成一个键值对对象
const jdObj = {}
if (typeof window !== 'undefined' && window.jd && window.jd.features) {
  window.jd.features.forEach(item => {
    if (item && item.properties && item.properties.SSJ) {
      jdObj[item.properties.SSJ] = item
    }
  })
}

let streetName = '红卫路街'
if (typeof window !== 'undefined' && window.location && window.location.search) {
  const parts = window.location.search.split("=")
  if (parts.length > 1 && parts[1]) {
    try {
      streetName = decodeURI(parts[1])
    } catch (e) {
      console.warn('Decode streetName failed', e)
    }
  }
}
if (!jdObj[streetName]) {
  const firstKey = Object.keys(jdObj)[0]
  if (firstKey) {
    streetName = firstKey
  }
}
let streetName_pinyin = pinyin(streetName)

let map = null

const getStreetCenter = (name) => {
  if (jdObj[name] && jdObj[name].properties && jdObj[name].properties.CenterX && jdObj[name].properties.CenterY) {
    return [jdObj[name].properties.CenterX, jdObj[name].properties.CenterY]
  }
  return [114.43039655685425, 30.634164111151716]
}

const player = ref(null)
const jdlist = ref([])
const checkList = ref(['医疗卫生资源', '教育资源'])
const centerDialogVisible = ref(false)
const ws_url = ref('')
const vlist = ref([])
const loading = ref([true, true, true, true])
const loadText = ref(constants.loading_video)
const xqd = ref({})
const streetShow = ref(true)
const ziyuan = ref([{
  value: '教育',
  label: '教育资源',
  icon: '/assets/images/school.svg',
}, {
  value: '医疗卫生',
  label: '医疗卫生',
  icon: '/assets/images/hosp.svg',
}])
const shequSelect = ref("")
const ziyuanSelect = ref(['教育', '医疗卫生'])


// 街道下的社区列表
const getjdlist = async () => {
  await asyxy({
    streetName
  }).then(function (res) {
    console.log(res.data, 'jdlist');

    jdlist.value = res.data
    console.log("jdlist")
    console.log(jdlist.value)
  })
}

const jdclear = () => {
  // 清空选择后重置地图
  map.flyTo({
    center: getStreetCenter(streetName),
    zoom: 14,
    pitch: 60,
  });
}

const initMap = async () => {
  // 标注
  let QingShanJieDao_PT = {
    "type": "FeatureCollection",
    "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
    "features": [
    ]
  }
  let JDmarkerArr = []

  const darkMapStyle = {
    version: 8,
    sources: {
      'esri-dark': {
        type: 'raster',
        tiles: [
          'https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}'
        ],
        tileSize: 256
      },
      'esri-ref': {
        type: 'raster',
        tiles: [
          'https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}'
        ],
        tileSize: 256
      }
    },
    layers: [
      {
        id: 'esri-dark-layer',
        type: 'raster',
        source: 'esri-dark',
        minzoom: 0,
        maxzoom: 22
      },
      {
        id: 'esri-ref-layer',
        type: 'raster',
        source: 'esri-ref',
        minzoom: 0,
        maxzoom: 22
      }
    ]
  };

  map = new mapboxgl.Map({
    container: 'map',
    style: darkMapStyle,
    antialias: true,
    center: getStreetCenter(streetName), // 经纬度
    zoom: 14,
    pitch: 60,
    bearing: 0,
    essential: true
  });

  window.map = map

  // map.addControl(new mapboxgl.NavigationControl(), 'top-left');

  map.on('load', async function () {
    // 1. 全区所有街道划分图层（画块画线，直观呈现青山区各街道辖区边界）
    if (window.jd && window.jd.features) {
      map.addSource("all-streets", {
        type: "geojson",
        data: window.jd
      });

      // 街道区块填充：当前选中街道高亮显示，其余街道微透蓝紫科技色
      map.addLayer({
        id: "all-streets-fill",
        type: "fill",
        source: "all-streets",
        paint: {
          "fill-color": [
            "case",
            ["==", ["get", "SSJ"], streetName],
            "rgba(0, 229, 255, 0.22)",
            "rgba(14, 40, 80, 0.28)"
          ],
          "fill-opacity": 0.85
        }
      });

      // 街道外发光辉光线
      map.addLayer({
        id: "all-streets-glow",
        type: "line",
        source: "all-streets",
        paint: {
          "line-color": [
            "case",
            ["==", ["get", "SSJ"], streetName],
            "#00f0ff",
            "rgba(0, 160, 255, 0.4)"
          ],
          "line-width": [
            "case",
            ["==", ["get", "SSJ"], streetName],
            7,
            3
          ],
          "line-blur": 3,
          "line-opacity": 0.7
        }
      });

      // 街道精准边界线（科技亮边）
      map.addLayer({
        id: "all-streets-stroke",
        type: "line",
        source: "all-streets",
        paint: {
          "line-color": [
            "case",
            ["==", ["get", "SSJ"], streetName],
            "#ffffff",
            "#00d2ff"
          ],
          "line-width": [
            "case",
            ["==", ["get", "SSJ"], streetName],
            3,
            1.5
          ]
        }
      });

      // 悬停交互与点击快速定位
      map.on('mouseenter', 'all-streets-fill', () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', 'all-streets-fill', () => {
        map.getCanvas().style.cursor = '';
      });
      map.on('click', 'all-streets-fill', (e) => {
        if (e.features && e.features.length > 0) {
          const feat = e.features[0];
          const sName = feat.properties?.SSJ;
          if (sName) {
            const center = [feat.properties.CenterX, feat.properties.CenterY];
            map.flyTo({ center, zoom: 14.5, pitch: 60, duration: 1500 });
          }
        }
      });
    }

    // 2. 社区细分边界（虚线科技划分，层级12.5-16.5显示）
    map.addLayer({
      id: "sqbjLayer1",
      type: "line",
      minzoom: 12.5,
      maxzoom: 16.5,
      source: {
        type: 'geojson',
        data: window.sq || sqbjData
      },
      paint: {
        "line-color": "#40a9ff",
        "line-width": 1.5,
        "line-dasharray": [4, 2],
        "line-opacity": 0.8
      }
    });

    // 3. 网格细分边界（高层级15以上显示细致微网格）
    map.addLayer({
      id: "wgbjLayer1",
      type: "line",
      minzoom: 15,
      source: {
        type: 'geojson',
        data: window.wg
      },
      paint: {
        "line-color": "#00ffc4",
        "line-width": 1.2,
        "line-opacity": 0.75
      }
    });

    // 4. 青山区外围轮廓边界线（醒目科技辉光外圈）
    map.addLayer({
      id: "qbjLayer1",
      type: "line",
      source: {
        type: 'geojson',
        data: window.jd
      },
      paint: {
        "line-color": "#00f0ff",
        "line-width": 4,
        "line-opacity": 0.85
      }
    });


    // 将window.wg的features里的properties里的WGBM对应相关的geometry
    const obj = {}
    window.wg.features.forEach(ele => {
      obj[ele.properties.WGBM] = ele
    })

    // 选中网格 显示详情
    // 网格区块
    map.addLayer({
      type: "fill",
      source: {
        'type': 'geojson',
        'data': window.wg
      },
      id: "wgbjLayer2",
      paint: {
        // 'fill-color': 'blue',
        'fill-opacity': 0
      },
      layout: {}
    });

    // wgbjLayer2悬浮变色
    map.on('mousemove', function (e) {

      if (map.getZoom() < 16) return

      // 如果有wgbjLayer3则清除
      if (map.getLayer('wgbjLayer3')) {
        map.removeLayer('wgbjLayer3')
        map.removeSource('wgbjLayer3')
      }

      let features = map.queryRenderedFeatures(e.point, {
        layers: ['wgbjLayer2']
      });
      map.getCanvas().style.cursor = 'pointer';
      // 选中的那块区域变色
      map.addLayer({
        type: "fill",
        source: {
          'type': 'geojson',
          'data': obj[features[0].properties.WGBM]
        },
        id: "wgbjLayer3",
        paint: {
          'fill-color': 'green',
          'fill-opacity': 0.5
        },
        layout: {}
      });
    });
    map.on('mouseleave', function (e) {
      if (map.getZoom() < 16) return

      map.getCanvas().style.cursor = '';
    });
    // 网格详情
    map.on('click', 'wgbjLayer2', function (e) {
      // 仅有当zoom大于等于16时才会触发
      if (map.getZoom() < 16) return

      const features = map.queryRenderedFeatures(e.point, {
        layers: ['wgbjLayer2']
      });
      if (features.length > 0) {
        const feature = features[0];
        const properties = feature.properties;
        // alert(JSON.stringify(properties, null, 2));


        // 清除所有现有弹框
        if (document.querySelector('.mapboxgl-popup')) {
          document.querySelector('.mapboxgl-popup').remove()
        }

        if (map.getLayer('wgbjLayer-active')) {
          map.removeLayer('wgbjLayer-active')
          map.removeSource('wgbjLayer-active')
        }

        map.addLayer({
          type: "fill",
          source: {
            'type': 'geojson',
            'data': obj[features[0].properties.WGBM]
          },
          id: "wgbjLayer-active",
          paint: {
            'fill-color': 'green',
            'fill-opacity': 0.5
          },
          layout: {}
        });

        const getasygriddetail = async () => {
          const res = await asygriddetail({
            gridId: properties.WGBM,
            gridName: properties.WGQC
          })
          console.log(res.data, 'grid_detail');

          makePopup(e, res, properties)
        }
        getasygriddetail()
      }
    });

    // 监听地图缩放事件
    map.on('zoomend', function () {
      // 如果zoom小于16则清除wgbjLayer3及wgbjLayer-activie
      if (map.getZoom() < 16) {
        if (map.getLayer('wgbjLayer3')) {
          map.removeLayer('wgbjLayer3')
          map.removeSource('wgbjLayer3')
        }
        if (map.getLayer('wgbjLayer-active')) {
          map.removeLayer('wgbjLayer-active')
          map.removeSource('wgbjLayer-active')
        }
      }
    });

    setBaimo()

    // 房屋反光
    map.setLight({
      "anchor": "viewport",
      "color": "#fff",
      "intensity": 1,
      "position": [
        10.5,
        140,
        45
      ]
    });

    // 渲染全区所有街道名称直观立体标牌
    if (window.jd && window.jd.features) {
      window.jd.features.forEach(feat => {
        const p = feat.properties || {};
        if (p.SSJ && p.CenterX && p.CenterY) {
          const isCurrent = p.SSJ === streetName;
          const el = document.createElement('div');
          el.className = `street-tag-badge ${isCurrent ? 'active' : ''}`;
          el.innerHTML = `
            <div class="badge-dot"></div>
            <div class="badge-text">${p.SSJ}</div>
            ${isCurrent ? '<div class="badge-status">当前辖区</div>' : ''}
          `;
          el.onclick = (ev) => {
            ev.stopPropagation();
            map.flyTo({
              center: [p.CenterX, p.CenterY],
              zoom: 14.8,
              pitch: 60,
              duration: 1200
            });
          };

          const marker = new mapboxgl.Marker({ element: el, anchor: 'center' })
            .setLngLat([p.CenterX, p.CenterY])
            .addTo(map);
          JDmarkerArr.push(marker);
        }
      });
    }

    if (map.getLayer("roads_1@QingShanQu_poi86#3(0_24)")) {
      map.setLayoutProperty("roads_1@QingShanQu_poi86#3(0_24)", "text-size", 14);
    }

    $("#hide").on("click", function (e) {
      map.flyTo({
        center: [114.387186, 30.644265],
        zoom: 15,
        pitch: 60,
        bearing: 0,
      })
    });

    await Promise.all([
      makeImg('/assets/images/hosp.svg', 'pulsing-dot'),
      makeImg('/assets/images/school.svg', 'pulsing-dot2')
    ])

    await getpoi('医疗')
    await getpoi('学校')

    await xdqchange()
  });
}

const fly = () => {
  // 初始化飞入位置
  // map.flyTo({
  //   center: [
  //     jdObj[streetName].properties.CenterX,
  //     jdObj[streetName].properties.CenterY
  //   ],//经纬度
  //   zoom: 14,
  //   pitch: 60,
  //   bearing: 0,
  //   essential: true
  // });
}

const jump = (item) => {
  map.flyTo({
    center: [item.jd, item.wd],//经纬度
    zoom: 15, // 15
    pitch: 60,
    bearing: 0,
    essential: true
  });

  // 清除上一个PolygonToggle
  if (map.getLayer('PolygonToggle')) {
    map.removeLayer('PolygonToggle')
    map.removeSource('PolygonToggle')
  }

  // 确保白模图层安全
  if (map && map.getLayer && map.getLayer('3Dbuilding')) {
    // 保留白模图层
  }

  const sqObj = {}
  window.sq.features.forEach(ele => {
    sqObj[ele.properties.SSSQ] = ele
  })
  const data = sqObj[item.orgName]
  map.addSource("PolygonToggle", {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: [
        data
      ]
    }
  });
  map.addLayer({
    type: "fill",
    source: "PolygonToggle",
    id: "PolygonToggle",
    paint: {
      'fill-color': '#f3f506',
      'fill-opacity': 0.5
    },
    layout: {}
    // 图层放到最下面
  })

  setBaimo()

  poi(checkList.value.length)
}

let cachedBuildingsData = null
const loadBuildingsData = async () => {
  if (cachedBuildingsData) return cachedBuildingsData
  try {
    const res = await fetch('/data/buildings.json')
    if (res.ok) {
      cachedBuildingsData = await res.json()
      return cachedBuildingsData
    }
  } catch (e) {
    console.warn('Load buildings.json failed', e)
  }
  return null
}

const setBaimo = async () => {
  const s = useSettingStore();
  if (!map) return;

  if (s.setting.openBaimo === false) {
    if (map.getLayer('3Dbuilding')) {
      map.setLayoutProperty('3Dbuilding', 'visibility', 'none');
    }
    return;
  }

  if (map.getLayer('3Dbuilding')) {
    map.setLayoutProperty('3Dbuilding', 'visibility', 'visible');
    return;
  }

  const data = await loadBuildingsData();
  if (!data || !map) return;

  if (!map.getSource('3Dbuilding-source')) {
    map.addSource('3Dbuilding-source', {
      type: 'geojson',
      data: data
    });
  }

  if (!map.getLayer('3Dbuilding')) {
    map.addLayer({
      id: '3Dbuilding',
      type: 'fill-extrusion',
      source: '3Dbuilding-source',
      layout: {
        visibility: s.setting.openBaimo !== false ? 'visible' : 'none'
      },
      paint: {
        'fill-extrusion-height': ['coalesce', ['get', 'Height'], 25],
        'fill-extrusion-base': ['coalesce', ['get', 'BaseHeight'], 0],
        'fill-extrusion-opacity': 0.88,
        'fill-extrusion-color': [
          'interpolate',
          ['linear'],
          ['coalesce', ['get', 'Height'], 20],
          0, '#102a45',
          25, '#0090ff',
          60, '#00e5ff',
          100, '#43cbff',
          180, '#8f79fa'
        ],
        'fill-extrusion-vertical-gradient': true
      }
    });

    // 建筑交互事件
    map.on('mouseenter', '3Dbuilding', () => {
      map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', '3Dbuilding', () => {
      map.getCanvas().style.cursor = '';
    });
    map.on('click', '3Dbuilding', (e) => {
      if (e.features && e.features.length > 0) {
        const feat = e.features[0];
        const p = feat.properties || {};
        new mapboxgl.Popup({ offset: [0, -10], className: 'building-popup' })
          .setLngLat(e.lngLat)
          .setHTML(`
            <div style="padding: 10px 14px; background: rgba(10, 25, 50, 0.92); border: 1px solid #00f0ff; border-radius: 6px; color: #fff; font-family: sans-serif; box-shadow: 0 0 15px rgba(0, 240, 255, 0.4);">
              <div style="font-size: 15px; font-weight: bold; color: #00f0ff; margin-bottom: 6px;">🏢 ${p.name || '建筑白模'}</div>
              <div style="font-size: 12px; line-height: 1.6; color: #d0e4ff;">
                <div>所属街道：<span style="color: #fff;">${p.street || streetName}</span></div>
                <div>建筑类型：<span style="color: #50e3c2;">${p.type || '城市建筑'}</span></div>
                <div>建筑高度：<span style="color: #ffb830; font-weight: bold;">${p.Height || 20} 米</span></div>
                <div>建筑层数：<span style="color: #fff;">${p.floors || Math.ceil((p.Height || 20) / 3)} 层</span></div>
              </div>
            </div>
          `)
          .addTo(map);
      }
    });
  } else {
    map.setLayoutProperty('3Dbuilding', 'visibility', 'visible');
  }
}

const watchVideo = (id) => {
  centerDialogVisible.value = true

  setTimeout(() => {
    player.value.destroy()
    player.value = Streamedian.player('video_info', {
      socket: ws_url.value,
    });
    player.value.setSource(vlist.value[id], "rtsp");
  })
}

// 闪烁动画
const blink = () => {
  let size = window.innerWidth / 3;
  let pulsingDot = {
    width: size,
    height: size,
    data: new Uint8Array(size * size * 4),

    onAdd: function () {
      let canvas = document.createElement('canvas');
      canvas.width = this.width;
      canvas.height = this.height;
      this.context = canvas.getContext('2d');
    },

    render: function () {
      let duration = 1000;
      let t = (performance.now() % duration) / duration;

      let radius = size / 2 * 0.3;
      let outerRadius = size / 2 * 0.7 * t + radius;
      let context = this.context;

      //画外部的圆
      context.clearRect(0, 0, this.width, this.height);
      context.beginPath();
      context.arc(this.width / 2, this.height / 2, outerRadius, 0, Math.PI * 2);
      context.fillStyle = 'rgba(255, 200, 200,' + (1 - t) + ')';
      context.fill();

      //画里面的小圆
      context.beginPath();
      context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2);
      context.fillStyle = 'rgba(255, 100, 100, 1)';
      context.strokeStyle = 'white';
      context.lineWidth = 2 + 4 * (1 - t);
      context.fill();
      context.stroke();//描边

      // update this image's data with data from the canvas
      this.data = context.getImageData(0, 0, this.width, this.height).data;

      // keep the map repainting
      map.triggerRepaint();
      return true;
    }
  };
  // map.addImage('pulsing-dot', pulsingDot, { pixelRatio: 6 });
}

const icon3d = () => {
  //设置地图上一点的坐标为three.js的基点坐标，建立转换坐标系
  const modelOrigin = [114.39832824, 30.648266836];

  const modelAltitude = 0;
  //three.js默认是Y轴向上（Y-up），需要进行一个角度转换
  const modelRotate = [Math.PI / 2, 0, 0];
  const modelAsMercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(modelOrigin, modelAltitude);
  // three.js对象转换成地图位置的转换参数设置（平移、旋转、缩放）

  const modelTransform = {
    translateX: modelAsMercatorCoordinate.x,
    translateY: modelAsMercatorCoordinate.y,
    translateZ: modelAsMercatorCoordinate.z,
    rotateX: modelRotate[0],
    rotateY: modelRotate[1],
    rotateZ: modelRotate[2],
    scale: 1000
  };

  const THREE = window.THREE;
  // configuration of the custom layer for a 3D model per the CustomLayerInterface
  const pulsingDot = {
    id: '3d-model',
    type: 'custom',
    renderingMode: '3d',
    onAdd: function (_map, gl) {

      let canvas = document.createElement('canvas');
      canvas.width = this.width;
      canvas.height = this.height;
      this.context = canvas.getContext('2d');
      this.camera = new THREE.Camera();
      this.scene = new THREE.Scene();

      // create two three.js lights to illuminate the model
      const directionalLight = new THREE.DirectionalLight(0xffffff);
      directionalLight.position.set(0, -70, 100).normalize();
      this.scene.add(directionalLight);

      const directionalLight2 = new THREE.DirectionalLight(0xffffff);
      directionalLight2.position.set(0, 70, 100).normalize();
      this.scene.add(directionalLight2);

      // use the three.js GLTF loader to add the 3D model to the three.js scene
      const loader = new THREE.GLTFLoader();
      loader.load('@/assets/source/34M_17.gltf', (gltf) => {
        this.scene.add(gltf.scene);
      });

      this.map = _map;

      // use the Mapbox GL JS map canvas for three.js
      this.renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        context: gl,
        antialias: true
      });

      this.renderer.autoClear = false;

    },
    render: function (gl, matrix) {
      const rotationX = new THREE.Matrix4().makeRotationAxis(
        new THREE.Vector3(1, 0, 0),
        modelTransform.rotateX
      );
      const rotationY = new THREE.Matrix4().makeRotationAxis(
        new THREE.Vector3(0, 1, 0),
        modelTransform.rotateY
      );
      const rotationZ = new THREE.Matrix4().makeRotationAxis(
        new THREE.Vector3(0, 0, 1),
        modelTransform.rotateZ
      );

      const m = new THREE.Matrix4().fromArray(matrix);
      const l = new THREE.Matrix4()
        .makeTranslation(
          modelTransform.translateX,
          modelTransform.translateY,
          modelTransform.translateZ
        )
        .scale(
          new THREE.Vector3(
            modelTransform.scale,
            -modelTransform.scale,
            modelTransform.scale
          )
        )
        .multiply(rotationX)
        .multiply(rotationY)
        .multiply(rotationZ);

      this.camera.projectionMatrix = m.multiply(l);
      this.renderer.resetState();
      this.renderer.render(this.scene, this.camera);
      this.map.triggerRepaint();

      // return true;
    }
  };
}

const makeImg = (url, name) => {
  return new Promise((resolve) => {
    if (map && map.hasImage && map.hasImage(name)) {
      resolve();
      return;
    }
    const image = new Image();
    const finalUrl = url.startsWith('/') ? url : `/${url}`;
    image.src = finalUrl;
    image.onload = () => {
      try {
        if (map && map.hasImage && !map.hasImage(name)) {
          map.addImage(name, image, { pixelRatio: 2 });
        }
      } catch (err) {
        console.warn(`[makeImg] 添加图标异常: ${name}`, err);
      }
      resolve();
    };
    image.onerror = (err) => {
      console.warn(`[makeImg] 加载图标失败: ${finalUrl}`, err);
      resolve();
    };
  });
}

const makeSource = (id, data) => {
  if (!map || !data || !Array.isArray(data) || data.length === 0) return;
  const isHosp = id === 'places';
  const iconImg = isHosp ? '/assets/images/hosp.svg' : '/assets/images/school.svg';
  const themeColor = isHosp ? '#00e5ff' : '#ffd04b';
  const badgeBg = isHosp ? 'rgba(0, 229, 255, 0.15)' : 'rgba(255, 208, 75, 0.15)';
  const borderCol = isHosp ? 'rgba(0, 229, 255, 0.4)' : 'rgba(255, 208, 75, 0.4)';

  const formattedFeatures = data.map(ele => {
    const title = ele.properties?.name || '未知点位';
    const category = ele.properties?.Class || (isHosp ? '医疗卫生' : '教育资源');
    const address = ele.properties?.address || '青山区辖区内';
    return Object.assign({}, ele, {
      'properties': {
        ...ele.properties,
        'description': `
          <div style="min-width: 180px; padding: 4px;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.15); padding-bottom: 6px;">
              <img src="${iconImg}" style="width: 26px; height: 26px; filter: drop-shadow(0 0 6px ${themeColor}); flex-shrink: 0;" />
              <div>
                <span style="font-size: 11px; padding: 2px 6px; border-radius: 4px; background: ${badgeBg}; color: ${themeColor}; border: 1px solid ${borderCol}; font-weight: bold;">${category}</span>
              </div>
            </div>
            <div style="font-size: 14px; font-weight: bold; color: #fff; line-height: 1.4; margin-bottom: 4px;">${title}</div>
            <div style="font-size: 12px; color: #a0cfff; line-height: 1.3;">📍 ${address}</div>
          </div>
        `,
        'icon': 'theatre'
      }
    });
  });

  if (map.getSource(id)) {
    map.getSource(id).setData({
      'type': 'FeatureCollection',
      'features': formattedFeatures
    });
    return;
  }
  map.addSource(id, {
    'type': 'geojson',
    'data': {
      'type': 'FeatureCollection',
      'features': formattedFeatures
    }
  });
}

const makeLayer = (id, source) => {
  if (!map || map.getLayer(id) || !map.getSource(id)) return;
  map.addLayer({
    'id': id,
    'type': 'symbol',
    'source': id,
    'layout': {
      'icon-image': source,
      'icon-size': 0.65,
      'icon-anchor': 'bottom',
      'icon-allow-overlap': true,
      'icon-ignore-placement': true,
    }
  });
}

const makeEvent = (id) => {
  if (!map) return;
  map.on('click', id, (e) => {
    makePopup(e)
    e.stopPropagation()
  });

  map.on('mouseenter', id, () => {
    map.getCanvas().style.cursor = 'pointer';
  });

  map.on('mouseleave', id, () => {
    map.getCanvas().style.cursor = '';
  });
}

const hosp = () => {
  if (!xqd.value['医疗'] || !xqd.value['医疗'].length) return;
  if (map.getLayer('places')) map.removeLayer('places');
  if (map.getSource('places')) map.removeSource('places');
  makeSource('places', xqd.value['医疗']);
  makeLayer('places', 'pulsing-dot');
  makeEvent('places');
}

const school = () => {
  if (!xqd.value['学校'] || !xqd.value['学校'].length) return;
  if (map.getLayer('places2')) map.removeLayer('places2');
  if (map.getSource('places2')) map.removeSource('places2');
  makeSource('places2', xqd.value['学校']);
  makeLayer('places2', 'pulsing-dot2');
  makeEvent('places2');
}

const makePopup = async (e, res, properties) => {

  // 如果已经有弹框则清除
  if (document.querySelector('.mapboxgl-popup')) {
    document.querySelector('.mapboxgl-popup').remove();
  }

  const p = new AnimatedPopup({
    closeButton: true,
    closeOnClick: true,
    className: 'animated-popup',
    openingAnimation: {
      duration: 1000,
      easing: 'easeOutElastic',
      transform: 'scale',
    },
    closingAnimation: {
      duration: 300,
      easing: 'easeInBack',
      transform: 'scale',
    },
  })

  if (!e.features) {

    if (!res.data) {
      // 弹出警告
      ElMessage.warning('暂无数据');
      return;
    }

    p.setLngLat(e.lngLat)
      .setHTML(`<div class="grid-detail">
        <strong>网格详情</strong>
        <div class="flex justify-between">
          <span>社区名称</span>
          <span>${properties.SSSQ}</span>
        </div>
        <div class="flex justify-between">
          <span>网格名称</span>
          <span>${res.data.modifyusername}</span>
        </div>
        <div class="flex justify-between">
          <span>网格编码</span>
          <span>${res.data.modifyuserid}</span>
        </div>
        <div class="flex justify-between">
          <span>网格负责人</span>
          <span>${res.data.wgzxm}</span>
        </div>
        <div class="flex justify-between">
          <span>网格员</span>
          <span>${res.data.wgyxm}</span>
        </div>
        <div class="flex justify-between">
          <span>手机电话</span>
          <span>${res.data.sjhm}</span>
        </div>
        <div class="flex justify-between">
          <span>固定电话</span>
          <span>${res.data.gddh}</span>
      </div>`)
  } else {
    const coordinates = e.features[0].geometry.coordinates.slice();
    const description = e.features[0].properties.description;

    p
      .setLngLat(coordinates)
      .setHTML(`
    <div class='poi'>
      ${description}
    </div>
  `)
  }
  p.addTo(map);
}

const getpoi = async (keyword) => {
  if (keyword === '医疗') {
    try {
      const res = await asyhospital({ streetName })
      const features = []
      const data = res?.data || {}
      for (const cat in data) {
        if (Array.isArray(data[cat])) {
          data[cat].forEach(item => {
            const lng = parseFloat(item.streetLog || item.wgs84Log)
            const lat = parseFloat(item.streetLat || item.wgs84Lat)
            if (!isNaN(lng) && !isNaN(lat) && lng > 100 && lat > 20) {
              features.push({
                type: 'Feature',
                geometry: { type: 'Point', coordinates: [lng, lat] },
                properties: {
                  Class: item.medicalClass || item.medicalMidclass || cat || '医疗卫生',
                  name: item.medicalName,
                  address: item.medicalAddress || '青山区辖区内',
                  iconType: 'hospital'
                }
              })
            }
          })
        }
      }
      xqd.value['医疗'] = features
      return features
    } catch (e) {
      console.warn('获取医疗点位失败', e)
    }
  } else if (keyword === '学校') {
    try {
      const res = await asypublic({ streetName })
      const features = []
      const data = res?.data || {}
      const schools = [...(data.zxList || []), ...(data.xxList || []), ...(data.yryList || [])]
      const schoolCoords = {
        '武汉市第四十九初级中学': [114.3995, 30.6432],
        '武汉市第四十九中学': [114.3962, 30.6415],
        '武汉市工业科技学校': [114.4021, 30.6450],
        '武汉市青山区红钢城小学': [114.3912, 30.6385],
        '武汉市青山区钢城第一小学': [114.3850, 30.6350],
        '青山区红钢城第二幼儿园': [114.3945, 30.6398],
        '青山区幼教中心': [114.3980, 30.6420],
      }
      const baseCenter = getStreetCenter(streetName) || [114.388, 30.638]
      schools.forEach((item, index) => {
        let coords = schoolCoords[item.xxmc]
        if (!coords) {
          let lng = parseFloat(item.jd)
          let lat = parseFloat(item.wd)
          if (isNaN(lng) || lng < 114 || lng > 115 || isNaN(lat) || lat < 30 || lat > 31) {
            coords = [baseCenter[0] + (index * 0.003 - 0.006), baseCenter[1] + (index * 0.002 - 0.004)]
          } else {
            coords = [lng, lat]
          }
        }
        features.push({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: coords },
          properties: {
            Class: item.lx || '学校教育',
            name: item.xxmc,
            address: item.dz || '青山区辖区内',
            iconType: 'school'
          }
        })
      })
      xqd.value['学校'] = features
      return features
    } catch (e) {
      console.warn('获取学校点位失败', e)
    }
  }
}

// 兴趣点撒点
const xdqchange = async () => {
  if (!map) return

  const { data } = useDataStore()
  setTimeout(() => {
    console.log(data?.hosp)
    console.log(data?.edu)
  })

  if (map.getLayer('places')) {
    map.removeLayer('places')
    map.removeSource('places')
  }
  if (map.getLayer('places2')) {
    map.removeLayer('places2')
    map.removeSource('places2')
  }

  const selected = ziyuanSelect.value || []
  if (selected.includes('医疗卫生')) {
    hosp()
  }
  if (selected.includes('教育')) {
    school()
  }

  document.querySelector('body')?.addEventListener('mouseover', () => {
    drag()
  })
}

// 转换视角及过渡
const pitch = () => {
  map.easeTo({
    pitch: document.getElementById('slider').value
  })
}

const reconnectHandler = (e) => {
  return new Promise((resolve, reject) => {
    document.getElementById('error_msg').innerHTML = `连接错误${e.code}: ${e.msg}`
    document.getElementById('operators').style.display = 'unset'
    document.getElementById('reconnect').addEventListener('click', () => {
      document.getElementById('error_msg').innerHTML = ''
      document.getElementById('operators').style.display = 'none'
      resolve()
    })

    document.getElementById('cancel').addEventListener('click', () => {
      document.getElementById('error_msg').innerHTML = '已断开连接'
      document.getElementById('operators').style.display = 'none'
      reject()
    })
  })
}

onMounted(() => {
  const getV = async () => {
    const getasysxt = await asysxt({
      streetName
    })
    console.log(getasysxt, 'getasysxt');

    const eventArr = []
    getasysxt.data.map((ele, i) => {
      const { url, ws, token } = ele

      const wu = `wss://10.108.88.5:30443${ws}?jwt=${token}`
      ws_url.value = wu

      console.log(wu)
      console.log(`rtsp://10.108.88.5:8554/${url}`)

      const p = Streamedian.player('test_video' + i, {
        socket: wu,
        reconnectHandler: reconnectHandler,
      });

      const rtsp = `rtsp://10.108.88.5:8554/${url}`
      p.setSource(rtsp, "rtsp");

      player.value = p
      vlist.value[i] = rtsp
      loading.value[i] = false
    })

    window.videoLoad = function () {
      eventArr.forEach(ele => ele())
    }

    window.onbeforeunload = function () {
      player.value?.destroy();
      player.value = null;
    }
  }

  getV()


  const info = useInfoStore()
  info.update({ streetName })


  initMap()

  getjdlist()


  // #street在页面加载后淡入淡出动画 持续时间3s
  if (document.querySelector("#street")) {
    gsap.fromTo("#street", { opacity: 0 }, { opacity: 1, duration: 2 });
    setTimeout(() => {
      if (document.querySelector("#street")) {
        gsap.fromTo("#street", { opacity: 1 }, { opacity: 0, duration: 2, onComplete: () => {
          streetShow.value = false
        }});
      } else {
        streetShow.value = false
      }
    }, 5000);
  }
})

watch(() => ziyuanSelect.value, (val) => {
  xdqchange()
})

const settingStore = useSettingStore();
watch(() => settingStore.setting.openBaimo, (val) => {
  if (map && map.getLayer && map.getLayer('3Dbuilding')) {
    map.setLayoutProperty('3Dbuilding', 'visibility', val ? 'visible' : 'none');
  } else if (val) {
    setBaimo();
  }
})

</script>

<style lang="less">
#street {
  position: absolute;
  z-index: 1200 !important;
  color: #fff;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-shadow: 0 0 10px #000;
  text-align: center;

  p:first-child {
    font-size: 62px;
  }

  p:last-child {
    font-size: 32px;
    font-family: 'Microsoft-YaHei' !important;
  }
}

.mapbox-maps {
  // width: 840px;
  // height: 920px;
  width: 100%;
  height: 100%;
  position: absolute !important;
  top: 0;
  z-index: 20 !important;
  overflow: hidden !important;
  // 周边羽化
  filter: opacity(100px);
  -webkit-mask: radial-gradient(closest-side circle, #000 62%, transparent 180%);
  // -webkit-mask: linear-gradient(to right, transparent 0, #000 30%, #000 calc(100% - 30%), transparent 100%);

  #map {
    width: 100%;
    height: 100%;

    .mapboxgl-canvas-container {
      width: 100% !important;
    }

    .mapboxgl-canvas {
      outline: none;
      width: 100% !important;
      height: 100% !important;
    }
  }
}

.video-dock,
.map .dv-border-box-10 {
  position: absolute !important;
  bottom: 20px !important;
  left: 50% !important;
  transform: translateX(-50%) !important;
  width: 820px !important;
  height: 120px !important;
  z-index: 999;
  box-sizing: border-box;
}

.videos {
  width: 100%;
  height: 100%;
  box-shadow: 0 0 20px #000;
  display: flex;
  justify-content: space-between;
  padding: 10px;
  z-index: 999 !important;
  pointer-events: visible !important;

  .video {
    width: 24%;
    height: 100%;
    overflow: hidden;
    background: url("@/assets/images/item.png") no-repeat;
    background-size: 100% 100%;

    img {
      width: 100%;
    }

    video {
      width: 100%;
      cursor: pointer;
    }
  }
}

#container {
  float: left;
}

#video_overlays {
  position: absolute;
  float: left;
  width: 720px;
  z-index: 300000;
}

.rect {
  border: 2px;
  background-color: green;
  width: 100px;
  height: 100px;
}

.map-filter-dock {
  position: absolute;
  top: 20px;
  left: 24px;
  display: flex;
  align-items: center;
  gap: 10px;
  background: linear-gradient(135deg, rgba(4, 18, 45, 0.88), rgba(8, 28, 65, 0.82));
  border: 1px solid rgba(0, 229, 255, 0.5);
  padding: 5px 12px;
  border-radius: 8px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.65), 0 0 10px rgba(0, 229, 255, 0.25) inset;
  z-index: 1000;
  pointer-events: auto !important;

  .dock-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    padding-right: 4px;

    .dock-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #00f0ff;
      box-shadow: 0 0 6px #00f0ff;
    }

    .dock-title {
      font-size: 12px;
      font-weight: 600;
      color: #00f0ff;
      letter-spacing: 0.5px;
      white-space: nowrap;
    }
  }

  .filter-divider {
    width: 1px;
    height: 18px;
    background: rgba(0, 229, 255, 0.35);
  }

  .filter-select {
    pointer-events: auto !important;

    :deep(.el-input__wrapper) {
      background: rgba(0, 18, 45, 0.7) !important;
      box-shadow: 0 0 0 1px rgba(0, 229, 255, 0.3) inset !important;
      border-radius: 4px;
    }

    :deep(.el-input__inner) {
      color: #e6f4ff !important;
      font-size: 13px;
    }

    :deep(.el-tag) {
      background: rgba(0, 140, 255, 0.3) !important;
      border-color: rgba(0, 229, 255, 0.4) !important;
      color: #00f0ff !important;
    }
  }
}

.dv-border-box-7 {
  position: absolute;
  right: 50px;
  bottom: 160px;
}

.jd-item {
  color: #fff;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 3px 0;
}

.mapboxgl-popup-content {
  background: url('@/assets/images/poi.png') no-repeat !important;
  background-size: 100% 100% !important;
  color: #fff;
  cursor: pointer;
  width: 300px;

  strong {
    font-family: 'YouSheBiaoTiHei-2' !important;
    display: block;
    font-size: .3rem !important;
    line-height: .3rem !important;
    margin-left: .4rem;
    margin-bottom: .3rem;
  }
}

.mapboxgl-popup-tip {
  display: none !important;
}

.mapboxgl-popup-close-button {
  background: #132663;
  color: #fff;
  border-radius: 50%;
  width: .3rem;
  height: .3rem;
  transition: all 0.3s;
  font-size: .3rem;

  &:hover {
    background: #631313;
    color: #fff;
  }
}

.legend-item {
  display: flex;
  padding: 16px 20px;
  align-items: center;
  gap: 16px;
  align-self: stretch;
  border-radius: 8px;
  background: rgba(64, 110, 214, 0.15);
  cursor: pointer;
}

.mapboxgl-popup {
  width: 3rem;
  height: 2rem;
  max-width: 99999px !important;
}

.mapboxgl-popup-wrapper {
  width: 3rem;
  height: 2rem;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%) !important;

  .mapboxgl-popup-content {
    width: 100% !important;
    background: url('@/assets/images/alert.png') no-repeat !important;
    background-size: cover !important;
    // background-size: 100% 100% !important;
    padding: 10px 10px 5px !important;

    &::before {
      display: none !important;
    }

    &::after {
      top: -42px !important;
      right: -10px !important;
      width: 80px;
      height: 80px;
    }

    .mapboxgl-popup-close-button {
      z-index: 2000 !important;
    }
  }
}

.video-panel {
  background-color: transparent !important;
  background-size: 100% 100% !important;
  height: 700px;

  .el-dialog__body {
    width: 99% !important;
    overflow: hidden !important;

    video {
      width: 100% !important;
      height: 100% !important;
    }
  }
}

.sxk {
  position: relative;
  z-index: 999;
  pointer-events: visible !important;
}

.poi {
  padding: 0 .1rem;

  span,
  p {
    font-size: .2rem !important;
    line-height: .25rem;
  }
}

.grid-detail {
  padding: 0 .1rem;

  strong {
    font-size: .3rem !important;
    line-height: .3rem !important;
    margin-left: .4rem;
    margin-bottom: .2rem;
  }

  span,
  p {
    font-size: .15rem !important;
    line-height: .2rem;
  }
}

.panel {
  pointer-events: visible !important;
}

.building-popup {
  .mapboxgl-popup-content {
    background: transparent !important;
    padding: 0 !important;
    box-shadow: none !important;
    border-radius: 8px !important;
  }
  .mapboxgl-popup-tip {
    border-top-color: rgba(10, 25, 50, 0.92) !important;
  }
  .mapboxgl-popup-close-button {
    color: #00f0ff !important;
    font-size: 16px !important;
    right: 6px !important;
    top: 6px !important;
  }
}
.street-tag-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  background: linear-gradient(135deg, rgba(8, 28, 62, 0.92), rgba(12, 54, 108, 0.88));
  border: 1px solid rgba(0, 229, 255, 0.75);
  border-radius: 20px;
  box-shadow: 0 0 14px rgba(0, 229, 255, 0.45), inset 0 0 8px rgba(0, 229, 255, 0.2);
  color: #e0f6ff;
  cursor: pointer;
  white-space: nowrap;
  font-size: 13px;
  font-weight: bold;
  user-select: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(6px);
  pointer-events: auto !important;

  .badge-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #00f0ff;
    box-shadow: 0 0 6px #00f0ff;
    flex-shrink: 0;
  }

  .badge-text {
    letter-spacing: 0.5px;
    text-shadow: 0 0 8px rgba(0, 240, 255, 0.85);
  }

  .badge-status {
    font-size: 10px;
    background: rgba(255, 184, 48, 0.25);
    color: #ffb830;
    border: 1px solid rgba(255, 184, 48, 0.8);
    padding: 1px 6px;
    border-radius: 10px;
    margin-left: 2px;
  }

  &:hover {
    transform: scale(1.15) translateY(-3px);
    border-color: #00ffff;
    box-shadow: 0 0 22px rgba(0, 255, 255, 0.8);
  }

  &.active {
    background: linear-gradient(135deg, rgba(16, 48, 96, 0.96), rgba(24, 80, 150, 0.92));
    border: 1.8px solid #ffb830;
    box-shadow: 0 0 18px rgba(255, 184, 48, 0.6), inset 0 0 10px rgba(255, 184, 48, 0.25);
    color: #ffffff;
    font-size: 14px;
    z-index: 100 !important;

    .badge-dot {
      background: #ffb830;
      box-shadow: 0 0 10px #ffb830;
      animation: badge-pulse 1.4s infinite alternate;
    }
  }
}

@keyframes badge-pulse {
  0% { transform: scale(0.85); opacity: 0.6; }
  100% { transform: scale(1.4); opacity: 1; }
}
</style>
