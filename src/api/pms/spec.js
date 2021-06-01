import request from '@/utils/request'

export function list(params) {
  return request({
    url: '/mall-pms/specs',
    method: 'get',
    params: params
  })
}


export function saveBatch(data) {
  return request({
    url: '/mall-pms/specs',
    method: 'post',
    data: data
  })
}

