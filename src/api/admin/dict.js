import request from '@/utils/request'

export function list(queryParams) {
  return request({
    url: '/youlai-admin/api.admin/v1/dicts',
    method: 'get',
    params: queryParams
  })
}

export function listByTypeCode(typeCode) {
  return request({
    url: '/youlai-admin/api.admin/v1/dicts',
    method: 'get',
    params: {'typeCode': typeCode}
  })
}


export function detail(id) {
  return request({
    url: '/youlai-admin/api.admin/v1/dicts/' + id,
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: '/youlai-admin/api.admin/v1/dicts',
    method: 'post',
    data: data
  })
}

export function update(id, data) {
  return request({
    url: '/youlai-admin/api.admin/v1/dicts/' + id,
    method: 'put',
    data: data
  })
}

export function del(ids) {
  return request({
    url: '/youlai-admin/api.admin/v1/dicts/'+ids,
    method: 'delete'
  })
}

export function patch(id, data) {
  return request({
    url: '/youlai-admin/api.admin/v1/dicts/' + id,
    method: 'patch',
    data: data
  })
}
