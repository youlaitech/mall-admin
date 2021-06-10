import request from '@/utils/request'

export function recharge(data) {
  return request({
    url: '/mall-ums/api/v1/recharge_orders',
    method: 'post',
    data: data
  })
}


export function rechargeResult(id) {
  return request({
    url: '/mall-ums/api/v1/recharge_orders/' + id,
    method: 'get'
  })
}
