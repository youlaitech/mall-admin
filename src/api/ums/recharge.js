import request from '@/utils/request'

export function recharge(data) {
  return request({
    url: '/mall-ums/api.admin/v1/recharge',
    method: 'post',
    data: data
  })
}
