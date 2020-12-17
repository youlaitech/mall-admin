import request from '@/utils/request'

export function list(queryParams) {
  return request({
    url: '/mall-pms/products',
    method: 'get',
    params: queryParams
  })
}

export function detail(id) {
  return request({
    url: '/mall-pms/products/' + id,
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: '/mall-pms/products',
    method: 'post',
    data: data
  })
}

export function update(id, data) {
  return request({
    url: '/mall-pms/products/' + id,
    method: 'put',
    data: data
  })
}

export function del(ids) {
  console.log('删除开始',ids)
  return request({
    url: '/mall-pms/products/'+ids,
    method: 'delete'
  })
}

export function patch(id, data) {
  return request({
    url: '/mall-pms/products/' + id,
    method: 'patch',
    data: data
  })
}
