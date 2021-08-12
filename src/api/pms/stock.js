import request from '@/utils/request'

export function list(queryParams) {
  return request({
    url: '/mall-pms/api/v1/skus',
    method: 'get',
    params: queryParams
  })
}

export function detail(id) {
  return request({
    url: '/mall-pms/api/v1/skus/' + id,
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: '/mall-pms/api/v1/skus',
    method: 'post',
    data: data
  })
}

export function update(id, data) {
  return request({
    url: '/mall-pms/api/v1/skus/' + id,
    method: 'put',
    data: data
  })
}

export function del(ids) {
  return request({
    url: '/mall-pms/api/v1/skus',
    method: 'delete',
    params: {ids: ids}
  })
}

export function patch(id, data) {
  return request({
    url: '/mall-pms/api/v1/skus/' + id,
    method: 'patch',
    data: data
  })
}


