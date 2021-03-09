/**
 * 登录记录
 */
import request from '@/utils/request'

export function list(queryParams) {
  return request({
    url: '/youlai-admin/api.admin/v1/login_records',
    method: 'get',
    params: queryParams
  })
}


export function del(data) {
  return request({
    url: '/youlai-admin/api.admin/v1/login_records',
    method: 'delete',
    data:data
  })
}


