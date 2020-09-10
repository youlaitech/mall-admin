import request from '@/utils/request'

export function list(queryParams) {
  return request({
    url: '/youlai-admin/depts',
    method: 'get',
    params: queryParams
  })
}

export function detail(id) {
  return request({
    url: '/youlai-admin/depts/' + id,
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: '/youlai-admin/depts',
    method: 'post',
    data: data
  })
}

export function update(id, data) {
  return request({
    url: '/youlai-admin/depts/' + id,
    method: 'put',
    data: data
  })
}

export function del(ids) {
  return request({
    url: '/youlai-admin/depts',
    method: 'delete',
    params: { ids: ids }
  })
}

export function patch(id, data) {
  return request({
    url: '/youlai-admin/depts/' + id,
    method: 'patch',
    data: data
  })
}
