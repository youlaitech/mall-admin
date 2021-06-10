import request from '@/utils/request'

export function list(queryParams) {
  return request({
    url: '/mall-oms/api/v1/orders',
    method: 'get',
    params: queryParams
  })
}

export function detail(id) {
  return request({
    url: '/mall-oms/api/v1/orders/' + id,
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: '/mall-oms/api/v1/orders',
    method: 'post',
    data: data
  })
}

export function update(id, data) {
  return request({
    url: '/mall-oms/api/v1/orders/' + id,
    method: 'put',
    data: data
  })
}

export function del(ids) {
  return request({
    url: '/mall-oms/api/v1/orders',
    method: 'delete',
    params: {ids: ids}
  })
}

export function patch(id, data) {
  return request({
    url: '/mall-oms/api/v1/orders/' + id,
    method: 'patch',
    data: data
  })
}


// Seata实验室
export function submit(params) {
  return request({
    url: '/mall-oms/api/v1/orders/submit',
    method: 'post',
    params: params
  })
}

export function orderDetail(id) {
  return request({
    url: '/mall-oms/api/v1/orders/' + id + '/detail',
    method: 'get'
  })
}
