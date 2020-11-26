import request from '@/utils/request'

export function list(queryParams) {
  return request({
    url: '/mall-oms/orders',
    method: 'get',
    params: queryParams
  })
}

export function detail(id) {
  return request({
    url: '/mall-oms/orders/' + id,
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: '/mall-oms/orders',
    method: 'post',
    data: data
  })
}

export function update(id, data) {
  return request({
    url: '/mall-oms/orders/' + id,
    method: 'put',
    data: data
  })
}

export function del(ids) {
  return request({
    url: '/mall-oms/orders',
    method: 'delete',
    params: { ids: ids }
  })
}

export function patch(id, data) {
  return request({
    url: '/mall-oms/orders/' + id,
    method: 'patch',
    data: data
  })
}
