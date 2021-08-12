import request from '@/utils/request'

export function page(queryParams) {
  return request({
    url: '/mall-pms/api/v1/goods/page',
    method: 'get',
    params: queryParams
  })
}

export function detail(id) {
  return request({
    url: '/mall-pms/api/v1/goods/' + id,
    method: 'get'
  })
}

export function addGoods(data) {
  return request({
    url: '/mall-pms/api/v1/goods',
    method: 'post',
    data: data
  })
}

export function updateGoods(id, data) {
  return request({
    url: '/mall-pms/api/v1/goods/' + id,
    method: 'put',
    data: data
  })
}

export function removeGoods(ids) {
  return request({
    url: '/mall-pms/api/v1/goods/'+ids,
    method: 'delete'
  })
}

export function patch(id, data) {
  return request({
    url: '/mall-pms/api/v1/goods/' + id,
    method: 'patch',
    data: data
  })
}
