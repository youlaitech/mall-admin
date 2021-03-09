/**
 * 登录记录
 */
import request from '@/utils/request'

export function list(queryParams) {
  return request({
    url: '/youlai-admin/api.admin/v1/records/login',
    method: 'get',
    params: queryParams
  })
}


export function del(ids) {
  return request({
    url: '/youlai-admin/api.admin/v1/records/login/' + ids,
    method: 'delete'
  })
}


