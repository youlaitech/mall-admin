import request from '@/utils/request'



export function listAttribute(params) {
  return request({
    url: '/mall-pms/api/v1/attributes',
    method: 'get',
    params: params
  })
}

export function saveBatch(data) {
  return request({
    url: '/mall-pms/api/v1/attributes/batch',
    method: 'post',
    data: data
  })
}


