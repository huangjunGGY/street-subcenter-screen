import axios from 'axios'

export const GETNOBASE = async (url) => {
  const fullUrl = url.startsWith('/') ? url : `/${url}`
  const res = await axios.get(fullUrl)
  return res.data
}

export const currentGET = async (apiName, params = {}) => {
  if (apiName === 'leftTop') {
    return {
      success: true,
      data: {
        alarmNum: 759,
        offlineNum: 44,
        onlineNum: 654,
        totalNum: 698
      }
    }
  }

  if (apiName === 'leftCenter') {
    return {
      success: true,
      data: {
        lockNum: 120,
        offlineNum: 44,
        onlineNum: 654,
        totalNum: 818,
        alarmNum: 759
      }
    }
  }

  if (apiName === 'leftBottom') {
    return {
      success: true,
      data: {
        list: [
          { gatewayno: 'GW-QS-8801', createTime: '2026-10-05 16:45:12', onlineState: 1, provinceName: '湖北省', cityName: '武汉市', countyName: '青山区红钢城街道' },
          { gatewayno: 'GW-QS-8802', createTime: '2026-10-05 16:42:30', onlineState: 0, provinceName: '湖北省', cityName: '武汉市', countyName: '青山区红卫路街道' },
          { gatewayno: 'GW-QS-8803', createTime: '2026-10-05 16:38:05', onlineState: 1, provinceName: '湖北省', cityName: '武汉市', countyName: '青山区新沟桥街道' },
          { gatewayno: 'GW-QS-8804', createTime: '2026-10-05 16:31:22', onlineState: 1, provinceName: '湖北省', cityName: '武汉市', countyName: '青山区冶金街道' },
          { gatewayno: 'GW-QS-8805', createTime: '2026-10-05 16:25:40', onlineState: 0, provinceName: '湖北省', cityName: '武汉市', countyName: '青山区钢花村街道' },
          { gatewayno: 'GW-QS-8806', createTime: '2026-10-05 16:19:15', onlineState: 1, provinceName: '湖北省', cityName: '武汉市', countyName: '青山区工人村街道' },
          { gatewayno: 'GW-QS-8807', createTime: '2026-10-05 16:10:08', onlineState: 1, provinceName: '湖北省', cityName: '武汉市', countyName: '青山区青山镇街道' },
          { gatewayno: 'GW-QS-8808', createTime: '2026-10-05 16:02:49', onlineState: 1, provinceName: '湖北省', cityName: '武汉市', countyName: '青山区白玉山街道' },
        ]
      }
    }
  }

  if (apiName === 'centerMap') {
    return {
      success: true,
      data: {
        regionCode: params.regionCode || 'china',
        dataList: [
          { name: '北京', value: 890 },
          { name: '天津', value: 340 },
          { name: '河北', value: 680 },
          { name: '山西', value: 420 },
          { name: '上海', value: 920 },
          { name: '江苏', value: 1150 },
          { name: '浙江', value: 1080 },
          { name: '安徽', value: 610 },
          { name: '湖北', value: 1480 },
          { name: '湖南', value: 720 },
          { name: '广东', value: 1390 },
          { name: '四川', value: 850 },
          { name: '重庆', value: 560 },
          { name: '陕西', value: 510 },
          { name: '山东', value: 990 },
          { name: '河南', value: 830 },
          { name: '江西', value: 540 },
          { name: '福建', value: 760 },
        ]
      }
    }
  }

  if (apiName === 'centerBottom') {
    return {
      success: true,
      data: {
        category: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        barData: [120, 150, 180, 210, 260, 310, 380, 420, 490, 530, 580, 620],
        lineData: [100, 130, 160, 190, 240, 290, 350, 400, 460, 510, 560, 600],
        rateData: [83.3, 86.7, 88.9, 90.5, 92.3, 93.5, 92.1, 95.2, 93.9, 96.2, 96.6, 96.8]
      }
    }
  }

  if (apiName === 'rightTop') {
    return {
      success: true,
      data: {
        dateList: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'],
        numList: [12, 18, 9, 35, 48, 62, 53, 31],
        numList2: [8, 11, 6, 22, 33, 45, 36, 20]
      }
    }
  }

  if (apiName === 'rightCenter') {
    return {
      success: true,
      data: [
        { name: "烟感报警", value: 167 },
        { name: "红外入侵", value: 123 },
        { name: "燃气泄露", value: 98 },
        { name: "井盖移位", value: 75 },
        { name: "水浸告警", value: 66 },
        { name: "消防占道", value: 52 },
        { name: "周界破损", value: 41 },
        { name: "高空抛物", value: 33 }
      ]
    }
  }

  return { success: true, data: {} }
}
