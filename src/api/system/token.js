/**
 * 令牌操作
 */
import request from '@/utils/request'

// 主动让token失效，加入黑名单
export function invalidToken(token) {
  return request({
    url: '/youlai-admin/api/v1/tokens/'+token+'/_invalidate',
    method: 'post'
  })
}
