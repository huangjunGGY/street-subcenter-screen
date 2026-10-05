import Mock from 'mockjs'

// 从 src/mock 导入所有原始真实数据（注意：严禁修改 src/mock 目录）
import basics from '../mock/basics.js'
import community from '../mock/community.js'
import complain from '../mock/complain.js'
import deptStreet from '../mock/dept/street.js'
import deptTree from '../mock/dept/tree.js'
import dutyList from '../mock/duty/list.js'
import dutyPage from '../mock/duty/page.js'
import education from '../mock/education.js'
import grid from '../mock/grid.js'
import hospital from '../mock/hospital.js'
import house from '../mock/house.js'
import inform from '../mock/inform.js'
import man from '../mock/man.js'
import party from '../mock/party.js'
import videoGroup from '../mock/video/group.js'
import videoPage from '../mock/video/page.js'
import weather from '../mock/weather.js'
import weatherAlarm from '../mock/weather/alarm.js'

// 辅助解析 URL 查询参数
function getQueryParams(url) {
  const params = {}
  if (!url || url.indexOf('?') === -1) return params
  const queryString = url.split('?')[1]
  const pairs = queryString.split('&')
  for (const pair of pairs) {
    const [k, v] = pair.split('=')
    if (k) {
      try {
        params[decodeURIComponent(k)] = decodeURIComponent(v || '')
      } catch (e) {
        params[k] = v || ''
      }
    }
  }
  return params
}

// 导出所有的 mock 数据字典，供全局调用或兜底适配
export const mockDataMap = {
  basics,
  community,
  complain,
  deptStreet,
  deptTree,
  dutyList,
  dutyPage,
  education,
  grid,
  hospital,
  house,
  inform,
  man,
  party,
  videoGroup,
  videoPage,
  weather,
  weatherAlarm,
  hard: {
    code: 0,
    msg: null,
    data: {
      cjr: 186,
      db: 92,
      kc: 235,
      tk: 48,
      gg: 31,
      ls: 16,
    },
  },
  rtspURL: {
    code: 0,
    msg: null,
    data: [
      {
        url: 'live_stream_01',
        ws: '/ws/live_stream_01',
        token: 'mock_jwt_token_01',
        name: '红钢城一街点位',
      },
      {
        url: 'live_stream_02',
        ws: '/ws/live_stream_02',
        token: 'mock_jwt_token_02',
        name: '建设一路点位',
      },
    ],
  },
}

export function mockXHR() {
  // 设置响应延时，更加逼真平滑
  Mock.setup({
    timeout: '50-200',
  })

  // 1. 街道基础信息
  Mock.mock(new RegExp('.*\\/admin\\/screen\\/two\\/basics'), 'get', () => basics)

  // 2. 街道人口变化数据
  Mock.mock(new RegExp('.*\\/admin\\/screen\\/two\\/man'), 'get', () => man)

  // 3. 街道房屋数据
  Mock.mock(new RegExp('.*\\/admin\\/screen\\/two\\/house'), 'get', () => house)

  // 4. 街道困难群体人数
  Mock.mock(new RegExp('.*\\/admin\\/screen\\/two\\/hard'), 'get', () => mockDataMap.hard)

  // 5. 医疗卫生资源
  Mock.mock(new RegExp('.*\\/admin\\/screen\\/two\\/hospital'), 'get', () => hospital)

  // 6. 教育资源
  Mock.mock(new RegExp('.*\\/admin\\/screen\\/two\\/education'), 'get', () => education)

  // 7. 党建与党员情况
  Mock.mock(new RegExp('.*\\/admin\\/screen\\/two\\/party'), 'get', () => party)

  // 8. 网格管理与街道服务力量
  Mock.mock(new RegExp('.*\\/admin\\/screen\\/two\\/grid'), 'get', () => grid)

  // 9. 网格详情查询
  Mock.mock(new RegExp('.*\\/admin\\/public\\/grid'), 'get', () => grid)

  // 10. 天气数据
  Mock.mock(new RegExp('.*\\/admin\\/screen\\/two\\/weather(\\?.*)?$'), 'get', () => weather)

  // 11. 天气预警数据
  Mock.mock(new RegExp('.*\\/admin\\/screen\\/two\\/weather\\/alarm'), 'get', () => weatherAlarm)

  // 12. 群众投诉与事件统计概览
  Mock.mock(new RegExp('.*\\/admin\\/screen\\/two\\/complain'), 'get', () => complain)

  // 13. 逾期通知与事件列表
  Mock.mock(new RegExp('.*\\/admin\\/screen\\/two\\/inform'), 'get', () => inform)

  // 14. 社区列表与点位经纬度
  Mock.mock(new RegExp('.*\\/admin\\/public\\/community'), 'get', () => community)

  // 15. 组织部门树形结构
  Mock.mock(new RegExp('.*\\/admin\\/org\\/dept\\/tree\\/dept'), 'get', () => deptTree)

  // 16. 部门人员列表（支持通过 id 查询人员，找不到时自动匹配有效人员数据）
  Mock.mock(new RegExp('.*\\/admin\\/org\\/dept\\/street'), 'get', (options) => {
    const params = getQueryParams(options.url)
    const id = params.id
    if (id && deptStreet[id]) {
      return deptStreet[id]
    }
    // 如果没有具体id或查不到，返回首个有效部门的数据
    const keys = Object.keys(deptStreet)
    for (const k of keys) {
      if (deptStreet[k]?.data && deptStreet[k].data.length > 0) {
        return deptStreet[k]
      }
    }
    return { code: 0, msg: null, data: [] }
  })

  // 17. 当日值班信息
  Mock.mock(new RegExp('.*\\/admin\\/duty\\/page'), 'get', () => dutyPage)

  // 18. 值班历史列表
  Mock.mock(new RegExp('.*\\/admin\\/duty\\/list'), 'get', () => dutyList)

  // 19. 视频摄像头组信息
  Mock.mock(new RegExp('.*\\/admin\\/video\\/group'), 'get', () => videoGroup)

  // 20. 视频摄像头分页列表
  Mock.mock(new RegExp('.*\\/admin\\/video\\/page'), 'get', () => videoPage)

  // 21. 摄像头视频流配置
  Mock.mock(new RegExp('.*\\/admin\\/video\\/rtspURL'), 'get', () => mockDataMap.rtspURL)

  // 22. POST 操作接口（值班增删改、视频新增等）
  Mock.mock(new RegExp('.*\\/admin\\/duty\\/add\\/batch'), 'post', () => ({
    code: 0,
    msg: '批量添加值班信息成功',
    data: true,
  }))
  Mock.mock(new RegExp('.*\\/admin\\/duty\\/update'), 'post', () => ({
    code: 0,
    msg: '修改值班信息成功',
    data: true,
  }))
  Mock.mock(new RegExp('.*\\/admin\\/duty\\/remove'), 'post', () => ({
    code: 0,
    msg: '删除值班信息成功',
    data: true,
  }))
  Mock.mock(new RegExp('.*\\/admin\\/video\\/add'), 'post', () => ({
    code: 0,
    msg: '配置摄像头成功',
    data: true,
  }))

  console.log('[Mock] src/mock 全部 18+ 项数据已成功挂载拦截，大屏已全面运用 mock 数据！')
}