import request from '@/utils/request'



export function list(params) {
  return request({
    url: '/mall-pms/attributes',
    method: 'get',
    params: params
  })
}

export function saveBatch(data) {
  return request({
    url: '/mall-pms/attributes',
    method: 'post',
    data: data
  })
}


