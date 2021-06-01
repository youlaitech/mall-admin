import request from '@/utils/request'

export function list(queryParams) {
  return request({
    url: '/youlai-admin/routes',
    method: 'get',
    params: queryParams
  })
}
