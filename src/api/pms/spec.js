import request from '@/utils/request'

export function list(params) {
  return request({
    url: '/mall-pms/api/v1/specs',
    method: 'get',
    params: params
  })
}


export function saveBatch(data) {
  return request({
    url: '/mall-pms/api/v1/specs',
    method: 'post',
    data: data
  })
}

