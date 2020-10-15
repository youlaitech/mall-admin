import request from '@/utils/request'

export function list(queryParams) {
  return request({
    url: '/youlai-admin/roles',
    method: 'get',
    params: queryParams
  })
}

export function detail(id) {
  return request({
    url: '/youlai-admin/roles/' + id,
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: '/youlai-admin/roles',
    method: 'post',
    data: data
  })
}

export function update(id, data) {
  return request({
    url: '/youlai-admin/roles/' + id,
    method: 'put',
    data: data
  })
}

export function del(ids) {
  return request({
    url: '/youlai-admin/roles',
    method: 'delete',
    params: {ids: ids}
  })
}

export function patch(id, mode, data) {
  return request({
    url: '/youlai-admin/roles/' + id,
    method: 'patch',
    params: {mode: mode},
    data: data
  })
}
