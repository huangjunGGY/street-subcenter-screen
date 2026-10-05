import axios from "@/request/index.js"

export const apiKey = process.env.INSCODE_API_KEY;

// 街道街道基础信息
export const asystreet = (params) => {
    return axios({
        url: '/admin/screen/two/basics',
        method: 'get',
        params
    })
}

// 街道人口变化数据
export const asyscreen = (params) => {
    return axios({
        url: '/admin/screen/two/man',
        method: 'get',
        params
    })
}

// 街道房屋数据
export const asyhouse = (params) => {
    return axios({
        url: '/admin/screen/two/house',
        method: 'get',
        params
    })
}

// 街道房屋数据
export const asyhard = (params) => {
    return axios({
        url: '/admin/screen/two/hard',
        method: 'get',
        params
    })
}

// 公共服务信息表-医疗卫生资源
export const asyhospital = (params) => {
    return axios({
        url: '/admin/screen/two/hospital',
        method: 'get',
        params
    })
}

// 公共服务信息表-教育资源
export const asyeducation = (params) => {
    return axios({
        url: '/admin/screen/two/education',
        method: 'get',
        params
    })
}

// 网格服务信息管理
export const asyparty = (params) => {
    return axios({
        url: '/admin/screen/two/party',
        method: 'get',
        params
    })
}

// 网格服务信息管理
export const asygrid = (params) => {
    return axios({
        url: '/admin/screen/two/grid',
        method: 'get',
        params
    })
}

// 环境卫生信息管理
export const asysurround = (params) => {
    return axios({
        url: '/admin/screen/two/surround',
        method: 'get',
        params
    })
}
// 环境类型统计管理
export const asywork = (params) => {
    return axios({
        url: '/admin/screen/two/work',
        method: 'get',
        params
    })
}

// 地图事件信息管理
export const asyevent = (params) => {
    return axios({
        url: '/admin/screen/two/event',
        method: 'get',
        params
    })
}


// 树形
export const asytree = (params) => {
    return axios({
        url: '/admin/org/dept/tree/dept',
        method: 'get',
        params
    })
}


export const asytable = (params) => {
    return axios({
        url: '/admin/org/dept/street',
        method: 'get',
        params
    })
}


// 获取当前街道经纬度
export const asyxy = (params) => {
    return axios({
        url: '/admin/public/community',
        method: 'get',
        params
    })
}


// 公共服务信息
export const asypublic = (params) => {
    return axios({
        url: '/admin/screen/two/education',
        method: 'get',
        params
    })
}


// 值班信息
export const asyduty = (params) => {
    return axios({
        url: '/admin/duty/page',
        method: 'get',
        params
    })
}


// 值班详情
export const asydutydetail = (params) => {
    return axios({
        url: '/admin/',
        method: 'get',
        params
    })
}

// 天气查询
export const asyweather = (params) => {
    return axios({
        url: '/admin/screen/two/weather',
        method: 'get',
        params
    })
}


// 网格详情
export const asygriddetail = (params) => {
    return axios({
        url: '/admin/public/grid',
        method: 'get',
        params
    })
}

// 街道服务力量
export const asyforce = (params) => {
    return axios({
        url: '/admin/screen/two/grid',
        method: 'get',
        params
    })
}


// 新增值班信息
export const asydutyadd = (params) => {
    return axios({
        method: 'post',
        url: '/admin/duty/add/batch',
        headers: {
            'Content-type': 'application/json',
        },
        data: JSON.stringify(params)
    })
}

// 修改值班信息
export const asydutyupdate = (params) => {
    return axios({
        method: 'post',
        url: '/admin/duty/update',
        headers: {
            'Content-type': 'application/json',
        },
        data: JSON.stringify(params)
    })
}

// 删除值班信息
export const asydutydelete = (params) => {
    return axios({
        method: 'post',
        url: '/admin/duty/remove',
        headers: {
            'Content-type': 'application/json',
        },
        data: JSON.stringify(params)
    })
}

// 群众投诉信息管理
export const asycomplain = (params) => {
    return axios({
        url: '/admin/screen/two/complain',
        method: 'get',
        params
    })
}

// 逾期通知
export const asyinform = (params) => {
    return axios({
        url: '/admin/screen/two/inform',
        method: 'get',
        params
    })
}

// 值班列表查询
export const asydutylist = (params) => {
    return axios({
        url: '/admin/duty/list',
        method: 'get',
        params
    })
}


// 摄像头
export const asysxt = (params) => {
    return axios({
        url: '/admin/video/rtspURL',
        method: 'get',
        params
    })
}


// 摄像头组信息
export const asyvideogroup = (params) => {
    return axios({
        url: '/admin/video/group',
        method: 'get',
        params
    })
}


// 摄像头列表
export const asyvideolist = (params) => {
    return axios({
        url: '/admin/video/page',
        method: 'get',
        params
    })
}


// 配置摄像头
export const asyvideadd = (params) => {
    return axios({
        method: 'post',
        url: '/admin/video/add',
        headers: {
            'Content-type': 'application/json',
        },
        data: JSON.stringify(params)
    })
}


// 值班信息导出
export const asydutyexport = (params) => {
    // 拿到接口域名
    const baseURL = axios.defaults.baseURL
    // 拼接接口地址
    const url = baseURL + '/admin/duty/export2?streetName=' + params.streetName
    return url
}


// 值班信息导入
export const asydutyimport = (params) => {
    return axios({
        method: 'post',
        url: '/admin/duty/import2',
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        data: params
    })
}

export const getmuban = () => {
    // 拿到接口域名
    const baseURL = axios.defaults.baseURL
    // 拼接接口地址
    const url = baseURL + '/admin/sys-file/local/file/streetDuty.xlsx'
    return url
}

// 天气预警
export const asywarning = (params) => {
    return axios({
        url: '/admin/screen/two/weather/alarm',
        method: 'get',
        params
    })
}