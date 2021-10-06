import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/youlai-auth/oauth/token',
    method: 'post',
    params: data,
    headers: {
      'Authorization': 'Basic bWFsbC1hZG1pbi13ZWI6MTIzNDU2' // 客户端信息加密摘要认证，明文：mall-admin-web:123456
    }
  })
}

export function getUserInfo() {
  return request({
    // url: '/vue-element-admin/user/info',
    url: '/youlai-admin/api/v1/users/me',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/youlai-auth/oauth/logout',
    method: 'delete'
  })
}

export function getValidateCode() {
  return request({
    url: '/validate-code',
    method: 'get'
  })
}
