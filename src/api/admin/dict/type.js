import request from '@/utils/request'

export function list(queryParams) {
  return request({
    url: '/youlai-admin/dict-types',
    method: 'get',
    params: queryParams
  })
}

export function detail(id) {
  return request({
    url: '/youlai-admin/dict-types/' + id,
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: '/youlai-admin/dict-types',
    method: 'post',
    data: data
  })
}

export function update(id, data) {
  return request({
    url: '/youlai-admin/dict-types/' + id,
    method: 'put',
    data: data
  })
}

export function del(ids) {
  return request({
    url: '/youlai-admin/dict-types',
    method: 'delete',
    params: { ids: ids }
  })
}

export function patch(id, data) {
  return request({
    url: '/youlai-admin/dict-types/' + id,
    method: 'patch',
    data: data
  })
}
