import request from '@/utils/request'

export function list(queryParams) {
  return request({
    url: '/youlai-admin/api.admin/v1/roles',
    method: 'get',
    params: queryParams
  })
}

export function detail(id) {
  return request({
    url: '/youlai-admin/api.admin/v1/roles/' + id,
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: '/youlai-admin/api.admin/v1/roles',
    method: 'post',
    data: data
  })
}

export function update(id, data) {
  return request({
    url: '/youlai-admin/api.admin/v1/roles/' + id,
    method: 'put',
    data: data
  })
}

export function del(ids) {
  return request({
    url: '/youlai-admin/api.admin/v1/roles/' + ids,
    method: 'delete'
  })
}

export function patch(id, data) {
  return request({
    url: '/youlai-admin/api.admin/v1/roles/' + id,
    method: 'patch',
    data: data
  })
}
