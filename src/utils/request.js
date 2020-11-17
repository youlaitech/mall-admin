import axios from 'axios'
import {MessageBox, Message} from 'element-ui'
import store from '@/store'
import {getToken, getRefreshToken} from '@/utils/auth'

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  // withCredentials: true,
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

service.interceptors.response.use(
  response => {
    const {code, msg, data} = response.data
    if (code !== '00000') {
      Message({
        message: msg || '系统出错',
        type: 'error',
        duration: 5 * 1000
      })
      if (code === 'A0230') { // refresh_token过期
        MessageBox.confirm('当前页面已失效，请重新登录', '确认退出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
    }
    return {code, msg, data}
  },
  error => {
    const {config, response: {status, data: {code}}} = error
    if (config && status === 401 && code == 'A0230') { // assess_token过期刷新
      const refreshToken = getRefreshToken()
      if (refreshToken) {
        return store.dispatch('user/refreshToken', refreshToken).then((token) => {
          config.headers['Authorization'] = 'Bearer ' + token
          config.url = config.url.replace(process.env.VUE_APP_BASE_API, '')
          return axios.request(config)
        })
      }
    } else {
      Message({
        message: error.message,
        type: 'error',
        duration: 5 * 1000
      })
    }
    return Promise.reject(error)
  }
)
export default service
