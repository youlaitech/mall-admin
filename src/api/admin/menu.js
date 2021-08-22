import request from '@/utils/request'

export function getMenuTableList(queryParams) {
  return request({
    url: '/youlai-admin/api/v1/menus/table',
    method: 'get',
    params: queryParams
  })
}

export function getMenuSelectList() {
  return request({
    url: '/youlai-admin/api/v1/menus/select',
    method: 'get'
  })
}


export function getMenuRouteList() {
  return request({
    url: '/youlai-admin/api/v1/menus/route',
    method: 'get'
  })
}


export function detail(id) {
  return request({
    url: '/youlai-admin/api/v1/menus/' + id,
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: '/youlai-admin/api/v1/menus',
    method: 'post',
    data: data
  })
}

export function update(id, data) {
  return request({
    url: '/youlai-admin/api/v1/menus/' + id,
    method: 'put',
    data: data
  })
}

export function del(ids) {
  return request({
    url: '/youlai-admin/api/v1/menus/'+ids,
    method: 'delete'
  })
}

export function patch(id, data) {
  return request({
    url: '/youlai-admin/api/v1/menus/' + id,
    method: 'patch',
    data: data
  })
}
