import request from '@/utils/request'

export function list(queryParams) {
  return request({
    url: '/mall-pms/skus',
    method: 'get',
    params: queryParams
  })
}

export function detail(id) {
  return request({
    url: '/mall-pms/skus/' + id,
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: '/mall-pms/skus',
    method: 'post',
    data: data
  })
}

export function update(id, data) {
  return request({
    url: '/mall-pms/skus/' + id,
    method: 'put',
    data: data
  })
}

export function del(ids) {
  return request({
    url: '/mall-pms/skus',
    method: 'delete',
    params: {ids: ids}
  })
}

export function patch(id, data) {
  return request({
    url: '/mall-pms/skus/' + id,
    method: 'patch',
    data: data
  })
}


