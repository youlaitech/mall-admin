import request from '@/utils/request'

export function login(data) {
  return request({
    // url: '/vue-element-admin/user/login',
    url: '/youlai-auth/oauth/token',
    method: 'post',
    params: data,
    headers: {
      'Authorization': 'Basic eW91bGFpLWFkbWluOjEyMzQ1Ng==' // 客户端信息加密摘要认证，明文：youlai-admin:123456
    }
  })
}

export function getInfo() {
  return request({
    // url: '/vue-element-admin/user/info',
    url: '/youlai-admin/v1/users/me',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/youlai-auth/oauth/logout',
    method: 'delete'
  })
}

