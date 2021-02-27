import request from '@/utils/request'

export function list(params) {
  return request({
    url: '/mall-pms/api.admin/v1/specifications',
    method: 'get',
    params: params
  })
}


export function saveBatch(data) {
  return request({
    url: '/mall-pms/api.admin/v1/specifications',
    method: 'post',
    data: data
  })
}

