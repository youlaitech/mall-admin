import request from '@/utils/request'

export function pageList(queryParams) {
  return request({
    url: '/youlai-admin/dicts',
    method: 'get',
    params: queryParams
  })
}

export function detail(id) {
  return request({
    url: '/youlai-admin/dicts/' + id,
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: '/youlai-admin/dicts',
    method: 'post',
    data: data
  })
}

export function update(id, data) {
  return request({
    url: '/youlai-admin/dicts/' + id,
    method: 'put',
    data: data
  })
}

export function del(ids) {
  return request({
    url: '/youlai-admin/dicts',
    method: 'delete',
    params: { ids: ids }
  })
}

export function patch(id, data) {
  return request({
    url: '/youlai-admin/dicts/' + id,
    method: 'patch',
    data: data
  })
}
