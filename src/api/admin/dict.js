import request from '@/utils/request'

export function getDictPageList(queryParams) {
  return request({
    url: '/youlai-admin/api/v1/dicts/page',
    method: 'get',
    params: queryParams
  })
}

export function detail(id) {
  return request({
    url: '/youlai-admin/api/v1/dicts/' + id,
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: '/youlai-admin/api/v1/dicts',
    method: 'post',
    data: data
  })
}

export function update(id, data) {
  return request({
    url: '/youlai-admin/api/v1/dicts/' + id,
    method: 'put',
    data: data
  })
}

export function del(ids) {
  return request({
    url: '/youlai-admin/api/v1/dicts/'+ids,
    method: 'delete'
  })
}

export function patch(id, data) {
  return request({
    url: '/youlai-admin/api/v1/dicts/' + id,
    method: 'patch',
    data: data
  })
}
