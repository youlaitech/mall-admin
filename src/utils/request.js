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
      config.headers['Authorization'] = 'Bearer ' + getToken()
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
  response => {
    const {code, msg, data} = response.data
    if (code !== '00000') {
      if (code === 'A0230') { // access_token过期 使用refresh_token换取access_token
        const config = response.config
        if (refreshing == false) {
          refreshing = true
          const refreshToken = getRefreshToken()
          return store.dispatch('user/refreshToken', refreshToken).then((token) => {
            config.headers['Authorization'] = 'Bearer ' + token
            config.baseURL = '' // 请求重试时，url已包含baseURL
            waitQueue.forEach(callback => callback(token)) // 已刷新token，所有队列中的请求重试
            waitQueue = []
            return service(config)
          }).catch(() => { // refresh_token也过期，直接跳转登录页面重新登录
            MessageBox.confirm('当前页面已失效，请重新登录', '确认退出', {
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
          // 正在刷新token，返回未执行resolve的Promise,刷新token执行回调
          return new Promise((resolve => {
            waitQueue.push((token) => {
              config.headers['Authorization'] = 'Bearer ' + token
              config.baseURL = '' // 请求重试时，url已包含baseURL
              resolve(service(config))
            })
          }))
        }
      } else {
        Message({
          message: msg || '系统出错',
          type: 'error',
          duration: 5 * 1000
        })
      }
    }
    return  response.data
  },
  error => {
    return Promise.reject(error)
  }
)
export default service
