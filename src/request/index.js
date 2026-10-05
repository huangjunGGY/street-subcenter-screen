import axios from 'axios'
import { mockDataMap } from '@@/mock'

const request = axios.create({
  // 走本地 Vite 代理 /admin，避免跨域报错
  baseURL: '',
  timeout: 15000, // 请求超时时间(毫秒)
  withCredentials: true, // 异步请求携带cookie
})

// 根据 URL 与参数获取 src/mock 的精准对应数据
export function getMockDataByUrl(url, params = {}) {
  if (!url) return null
  if (url.includes('/admin/screen/two/basics')) return mockDataMap.basics
  if (url.includes('/admin/screen/two/man')) return mockDataMap.man
  if (url.includes('/admin/screen/two/house')) return mockDataMap.house
  if (url.includes('/admin/screen/two/hard')) return mockDataMap.hard
  if (url.includes('/admin/screen/two/hospital')) return mockDataMap.hospital
  if (url.includes('/admin/screen/two/education')) return mockDataMap.education
  if (url.includes('/admin/screen/two/party')) return mockDataMap.party
  if (url.includes('/admin/screen/two/grid')) return mockDataMap.grid
  if (url.includes('/admin/public/grid')) return mockDataMap.grid
  if (url.includes('/admin/screen/two/weather/alarm')) return mockDataMap.weatherAlarm
  if (url.includes('/admin/screen/two/weather')) return mockDataMap.weather
  if (url.includes('/admin/screen/two/complain')) return mockDataMap.complain
  if (url.includes('/admin/screen/two/inform')) return mockDataMap.inform
  if (url.includes('/admin/public/community')) return mockDataMap.community
  if (url.includes('/admin/org/dept/tree/dept')) return mockDataMap.deptTree
  if (url.includes('/admin/org/dept/street')) {
    const id = params?.id
    if (id && mockDataMap.deptStreet[id]) return mockDataMap.deptStreet[id]
    const keys = Object.keys(mockDataMap.deptStreet)
    for (const k of keys) {
      if (mockDataMap.deptStreet[k]?.data?.length) {
        return mockDataMap.deptStreet[k]
      }
    }
    return mockDataMap.deptStreet[keys[0]]
  }
  if (url.includes('/admin/duty/page')) return mockDataMap.dutyPage
  if (url.includes('/admin/duty/list')) return mockDataMap.dutyList
  if (url.includes('/admin/video/group')) return mockDataMap.videoGroup
  if (url.includes('/admin/video/page')) return mockDataMap.videoPage
  if (url.includes('/admin/video/rtspURL')) return mockDataMap.rtspURL
  return null
}

// request拦截器
request.interceptors.request.use(
  config => {
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// response 拦截器
request.interceptors.response.use(
  response => {
    const data = response.data
    // 如果响应来自于代理兜底（远端服务未开启），则直接注入 src/mock 中对应的真实数据
    if (data && typeof data === 'object' && data.msg && String(data.msg).includes('Proxy Fallback')) {
      const mockResult = getMockDataByUrl(response.config?.url, response.config?.params)
      if (mockResult) {
        return mockResult
      }
    }
    return data || {}
  },
  error => {
    console.warn('API network error, fallback to src/mock data:', error.config?.url, error.message)
    const mockResult = getMockDataByUrl(error.config?.url, error.config?.params)
    if (mockResult) {
      return Promise.resolve(mockResult)
    }
    return Promise.resolve({
      code: 0,
      data: {},
      records: [],
      success: true,
      msg: 'offline fallback'
    })
  }
)

export default request