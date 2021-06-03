import request from '@/utils/request'

export function list(queryParams) {
  return request({
    url: '/youlai-admin/api/v1/routes',
    method: 'get',
    params: queryParams
  })
}
