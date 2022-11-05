import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { LoginForm, LoginResult, VerifyCode } from './types';

/**
 *
 * @param data {LoginForm}
 * @returns
 */
export function loginApi(data: LoginForm): AxiosPromise<LoginResult> {
  return request({
    url: '/youlai-auth/oauth/token',
    method: 'post',
    params: data,
    headers: {
      Authorization: 'Basic bWFsbC1hZG1pbjoxMjM0NTY=', // 客户端信息Base64明文：mall-admin:123456
    },
  });
}

/**
 * 注销
 */
export function logoutApi() {
  return request({
    url: '/youlai-auth/oauth/logout',
    method: 'delete',
  });
}

/**
 * 获取图片验证码
 */
export function getCaptcha(): AxiosPromise<VerifyCode> {
  return request({
    url: '/captcha?t=' + new Date().getTime().toString(),
    method: 'get',
  });
}
