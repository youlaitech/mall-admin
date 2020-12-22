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



export function attrCategoryList(queryParams) {
  return request({
    url: '/mall-pms/admin-api/v1/attr-categories',
    method: 'get',
    params: queryParams
  })
}

export function saveAttrCategoryBatch(data) {
  return request({
    url: '/mall-pms/admin-api/v1/attr-categories',
    method: 'post',
    data: data
  })
}

export function specCategoryList(queryParams) {
  return request({
    url: '/mall-pms/admin-api/v1/spec-categories',
    method: 'get',
    params: queryParams
  })
}


export function saveSpecCategoryBatch(data) {
  return request({
    url: '/mall-pms/admin-api/v1/spec-categories',
    method: 'post',
    data: data
  })
}

