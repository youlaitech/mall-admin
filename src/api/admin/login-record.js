import request from "@/utils/request";

export function listLoginRecord(queryParams) {
  return request({
    url: '/youlai-admin/login-records',
    method: 'get',
    params: queryParams
  })
}


export function del(data) {
  return request({
    url: '/youlai-admin/login-records',
    method: 'delete',
    data:data
  })
}
