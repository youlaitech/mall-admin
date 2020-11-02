import request from '@/utils/request'

export function list() {
  return request({
    url: '/mall-pms/categories',
    method: 'get'
  })
}

export function detail(id) {
  return request({
    url: '/mall-pms/categories/' + id,
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: '/mall-pms/categories',
    method: 'post',
    data: data
  })
}

export function update(id, data) {
  return request({
    url: '/mall-pms/categories/' + id,
    method: 'put',
    data: data
  })
}

export function del(ids) {
  return request({
    url: '/mall-pms/categories',
    method: 'delete',
    params: { ids: ids }
  })
}

export function patch(id, data) {
  return request({
    url: '/mall-pms/categories/' + id,
    method: 'patch',
    data: data
  })
}
