import request from '@/utils/request'

export function list(queryParams) {
  return request({
    url: '/mall-pms/categories',
    method: 'get',
    params: queryParams
  })
}

export function detail(id) {
  return request({
    url: '/mall-pms/categories/' + id,
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: '/mall-pms/categories',
    method: 'post',
    data: data
  })
}

export function update(id, data) {
  return request({
    url: '/mall-pms/categories/' + id,
    method: 'put',
    data: data
  })
}

export function del(ids) {
  return request({
    url: '/mall-pms/categories',
    method: 'delete',
    params: {ids: ids}
  })
}

export function patch(id, data) {
  return request({
    url: '/mall-pms/categories/' + id,
    method: 'patch',
    data: data
  })
}



export function attrList(queryParams) {
  return request({
    url: '/mall-pms/admin-api/v1/attrs',
    method: 'get',
    params: queryParams
  })
}

export function saveAttrs(data) {
  return request({
    url: '/mall-pms/admin-api/v1/attrs',
    method: 'post',
    data: data
  })
}

export function specList(queryParams) {
  return request({
    url: '/mall-pms/admin-api/v1/specs',
    method: 'get',
    params: queryParams
  })
}


export function saveSpecs(data) {
  return request({
    url: '/mall-pms/admin-api/v1/specs',
    method: 'post',
    data: data
  })
}

