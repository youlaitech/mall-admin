import request from "@/utils/request";

export function listLoginRecord(queryParams) {
  return request({
    url: '/youlai-admin/api/v1/login-records',
    method: 'get',
    params: queryParams
  })
}


export function del(data) {
  return request({
    url: '/youlai-admin/api/v1/login-records',
    method: 'delete',
    data:data
  })
}
