import request from '@/utils/request'

export function list(queryParams) {
  return request({
    url: '/mall-ums/api.admin/v1/members',
    method: 'get',
    params: queryParams
  })
}

export function detail(id) {
  return request({
    url: '/mall-ums/api.admin/v1/members/' + id,
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: '/mall-ums/api.admin/v1/members',
    method: 'post',
    data: data
  })
}

export function update(id, data) {
  return request({
    url: '/mall-ums/api.admin/v1/members/' + id,
    method: 'put',
    data: data
  })
}

export function del(ids) {
  return request({
    url: '/mall-ums/api.admin/v1/members',
    method: 'delete',
    params: { ids: ids }
  })
}

export function patch(id, data) {
  return request({
    url: '/mall-ums/api.admin/v1/members/' + id,
    method: 'patch',
    data: data
  })
}
