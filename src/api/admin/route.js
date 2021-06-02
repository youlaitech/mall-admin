import request from '@/utils/request'

export function list(queryParams) {
  return request({
    url: '/youlai-admin/v1/routes',
    method: 'get',
    params: queryParams
  })
}
