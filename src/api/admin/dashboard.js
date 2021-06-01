/**
 * 控制台首页
 */
import request from '@/utils/request'

/**
 * 获取登录统计数据
 * @returns {AxiosPromise}
 */
export function getData() {
  return request({
    url: '/youlai-admin/dashboard',
    method: 'get'
  })
}




