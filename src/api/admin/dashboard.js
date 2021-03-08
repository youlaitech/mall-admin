/**
 * 控制台首页
 */
import request from '@/utils/request'

/**
 * 获取登录统计数据
 * @returns {AxiosPromise}
 */
export function getLoginCounts() {
  return request({
    url: '/youlai-admin/api.admin/v1/dashboard/login_counts',
    method: 'get'
  })
}

