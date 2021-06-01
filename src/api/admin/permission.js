import request from '@/utils/request'

export function list(queryParams) {
  return request({
    url: '/youlai-admin/permissions',
    method: 'get',
    params: queryParams
  })
}

export function detail(id) {
  return request({
    url: '/youlai-admin/permissions/' + id,
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: '/youlai-admin/permissions',
    method: 'post',
    data: data
  })
}

export function update(id, data) {
  return request({
    url: '/youlai-admin/permissions/' + id,
    method: 'put',
    data: data
  })
}

export function del(ids) {
  return request({
    url: '/youlai-admin/permissions/'+ids,
    method: 'delete'
  })
}

export function patch(id, data) {
  return request({
    url: '/youlai-admin/permissions/' + id,
    method: 'patch',
    data: data
  })
}
