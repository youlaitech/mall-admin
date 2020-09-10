import request from '@/utils/request'

export function login(data) {
  return request({
<<<<<<< HEAD
    url: '/vue-element-admin/user/login',
=======
    // url: '/vue-element-admin/user/login',
    url: '/youlai-auth/oauth/token',
>>>>>>> i18n
    method: 'post',
    params: data
  })
}

export function getInfo() {
  return request({
<<<<<<< HEAD
    url: '/vue-element-admin/user/info',
    method: 'get',
    params: { token }
=======
    // url: '/vue-element-admin/user/info',
    url: '/youlai-admin/users/current',
    method: 'get'
>>>>>>> i18n
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}

