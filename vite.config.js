import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import UnoCSS from 'unocss/vite'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import http from 'http'

// 导入 src/mock 原始数据（严禁修改 src/mock 目录）
import basics from './src/mock/basics.js'
import man from './src/mock/man.js'
import house from './src/mock/house.js'
import hospital from './src/mock/hospital.js'
import education from './src/mock/education.js'
import party from './src/mock/party.js'
import grid from './src/mock/grid.js'
import weather from './src/mock/weather.js'
import weatherAlarm from './src/mock/weather/alarm.js'
import complain from './src/mock/complain.js'
import inform from './src/mock/inform.js'
import community from './src/mock/community.js'
import deptTree from './src/mock/dept/tree.js'
import deptStreet from './src/mock/dept/street.js'
import dutyPage from './src/mock/duty/page.js'
import dutyList from './src/mock/duty/list.js'
import videoGroup from './src/mock/video/group.js'
import videoPage from './src/mock/video/page.js'

function matchMockData(url) {
  if (!url) return null
  if (url.includes('/admin/screen/two/basics')) return basics
  if (url.includes('/admin/screen/two/man')) return man
  if (url.includes('/admin/screen/two/house')) return house
  if (url.includes('/admin/screen/two/hard')) return { code: 0, msg: null, data: { cjr: 186, db: 92, kc: 235, tk: 48, gg: 31, ls: 16 } }
  if (url.includes('/admin/screen/two/hospital')) return hospital
  if (url.includes('/admin/screen/two/education')) return education
  if (url.includes('/admin/screen/two/party')) return party
  if (url.includes('/admin/screen/two/grid') || url.includes('/admin/public/grid')) return grid
  if (url.includes('/admin/screen/two/weather/alarm')) return weatherAlarm
  if (url.includes('/admin/screen/two/weather')) return weather
  if (url.includes('/admin/screen/two/complain')) return complain
  if (url.includes('/admin/screen/two/inform')) return inform
  if (url.includes('/admin/public/community')) return community
  if (url.includes('/admin/org/dept/tree/dept')) return deptTree
  if (url.includes('/admin/org/dept/street')) {
    const m = url.match(/[?&]id=([^&]+)/)
    const id = m ? m[1] : null
    if (id && deptStreet[id]) return deptStreet[id]
    const keys = Object.keys(deptStreet)
    for (const k of keys) {
      if (deptStreet[k]?.data?.length) return deptStreet[k]
    }
    return deptStreet[keys[0]]
  }
  if (url.includes('/admin/duty/page')) return dutyPage
  if (url.includes('/admin/duty/list')) return dutyList
  if (url.includes('/admin/video/group')) return videoGroup
  if (url.includes('/admin/video/page')) return videoPage
  if (url.includes('/admin/video/rtspURL')) return { code: 0, msg: null, data: [{ url: 'live1', ws: '/ws/live1', token: 'mock' }] }
  return null
}

// 代理后端健康检测与熔断状态
let isBackendAvailable = true
let lastCheckTime = 0
let isProbing = false

function probeBackend(targetUrl) {
  if (isProbing || (lastCheckTime > 0 && Date.now() - lastCheckTime < 15000)) return
  isProbing = true
  try {
    const url = new URL(targetUrl)
    const req = http.request(
      {
        hostname: url.hostname,
        port: url.port || 80,
        path: '/',
        method: 'HEAD',
        timeout: 1500,
      },
      () => {
        if (!isBackendAvailable) {
          console.log(`\x1b[32m[Vite Proxy] 后端服务 (${targetUrl}) 已恢复连接，自动切回代理。\x1b[0m`)
        }
        isBackendAvailable = true
        lastCheckTime = Date.now()
        isProbing = false
      }
    )

    req.on('error', () => {
      isBackendAvailable = false
      lastCheckTime = Date.now()
      isProbing = false
    })

    req.on('timeout', () => {
      req.destroy()
      isBackendAvailable = false
      lastCheckTime = Date.now()
      isProbing = false
    })

    req.end()
  } catch (e) {
    isBackendAvailable = false
    isProbing = false
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const proxyTarget = env.VITE_PROXY_TARGET || process.env.VITE_PROXY_TARGET || 'http://192.168.1.138:9999'

  // 初始化探活一次
  probeBackend(proxyTarget)

  return {
    plugins: [
      vue(),
      vueJsx(),
      UnoCSS(),
      {
        name: 'vite-plugin-glsl-raw',
        transform(src, id) {
          if (/\.(glsl|vs|fs)$/.test(id)) {
            return {
              code: `export default ${JSON.stringify(src)};`,
              map: null
            }
          }
        }
      },
      AutoImport({
        imports: ['vue', 'vue-router'],
        resolvers: [ElementPlusResolver()],
        dts: 'src/auto-imports.d.ts',
      }),
      Components({
        resolvers: [ElementPlusResolver()],
        dts: 'src/components.d.ts',
      }),
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        'components': resolve(__dirname, 'src/components'),
        'components-vue': resolve(__dirname, 'src/components-vue'),
        '@/test': resolve(__dirname, 'src/test'),
        'bigscreen': resolve(__dirname, 'src/bigscreen'),
        'lib': resolve(__dirname, 'src/lib'),
        'hooks': resolve(__dirname, 'src/hooks'),
        'resource': resolve(__dirname, 'src/assets'),
        '@@/mock': resolve(__dirname, 'src/services/mock.js'),
        '@@': resolve(__dirname, 'src'),
      },
    },
    server: {
      host: true,
      proxy: {
        '/admin': {
          target: proxyTarget,
          changeOrigin: true,
          timeout: 3000,
          proxyTimeout: 3000,
          bypass: (req, res) => {
            // 全面运用 src/mock 数据：凡是匹配到 mock 数据的接口，直接 0ms 秒级响应
            const mockData = matchMockData(req.url)
            if (mockData) {
              res.writeHead(200, {
                'Content-Type': 'application/json; charset=utf-8',
              })
              res.end(JSON.stringify(mockData))
              return true
            }
          },
          configure: (proxy) => {
            proxy.on('error', (err, req, res) => {
              if (isBackendAvailable) {
                console.warn(
                  `\x1b[33m[Vite Proxy] ⚠️ 目标后端服务 (${proxyTarget}) 无法连接 (${err.message})，已开启离线数据安全兜底。\x1b[0m`
                )
              }
              isBackendAvailable = false
              lastCheckTime = Date.now()
              probeBackend(proxyTarget)

              if (res && !res.headersSent) {
                const mockData = matchMockData(req?.url)
                res.writeHead(200, {
                  'Content-Type': 'application/json; charset=utf-8',
                })
                res.end(
                  JSON.stringify(
                    mockData || {
                      code: 0,
                      success: true,
                      msg: `[Proxy Fallback] 远端服务不可达: ${err.message}`,
                      data: {},
                      records: [],
                      rows: [],
                      total: 0,
                    }
                  )
                )
              }
            })
          },
        },
      },
    },
    define: {
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          // 抑制 Dart Sass 2.0.0 legacy-js-api 废弃警告
          silenceDeprecations: ['legacy-js-api'],
        },
      },
    },
  }
})
