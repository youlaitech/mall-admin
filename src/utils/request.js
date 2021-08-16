import axios from 'axios'
import {MessageBox, Message} from 'element-ui'
import store from '@/store'
import {getToken, getRefreshToken} from '@/utils/auth'

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 50000
})

service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['Authorization'] = getToken()
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

let refreshing = false,// 正在刷新标识，避免重复刷新
  waitQueue = [] // 请求等待队列

service.interceptors.response.use(
  ({data}) => {
    const {code, msg} = data
    if (code === '00000') {
      return data
    } else {
      Message({
        message: msg || '系统出错',
        type: 'error'
      })
      return Promise.reject(new Error(msg || 'Error'))
    }
  },
  error => {
    let config = error.config
    const {code, msg} = error.response.data
    if (code === 'A0230') { // access_token过期，尝试续期token
      if (refreshing == false) {
        refreshing = true  // 切换正在刷新标识，其他请求先进请求等待队列中
        const refreshToken = getRefreshToken()
        return store.dispatch('user/refreshToken', refreshToken).then((token) => {
          config.headers['Authorization'] = token
          config.baseURL = '' // 请求重试时，url已包含baseURL
          waitQueue.forEach(callback => callback(token)) // 已成功刷新token，队列中的所有请求重试
          waitQueue = []
          return service(config)
        }).catch(() => {  // token续期失败
          MessageBox.confirm(
            '当前页面已失效，请重新登录', '确认退出', {
              confirmButtonText: '重新登录',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
            store.dispatch('user/resetToken').then(() => {
              location.reload()
            })
          })
        }).finally(() => {
          refreshing = false
        })
      } else {
        return new Promise((resolve => {
          waitQueue.push((token) => {
            config.headers['Authorization'] = token
            config.baseURL = ''
            resolve(service(config))
          })
        }))
      }
    } else if (code === 'A0231') { // token被禁止访问，添加到黑名单，跳转至登录页
      Message({
        message: '很不辛，您已被管理员强制下线',
        type: 'error'
      })
      store.dispatch('user/resetToken').then(() => {
        location.reload()
      })
    } else {
      Message({
        message: msg || '系统出错',
        type: 'error'
      })
      return Promise.reject(new Error(msg || 'Error'))
    }
  }
)
export default service
