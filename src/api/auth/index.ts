import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { CaptchaResult, LoginData, LoginResult } from "./types";

/**
 * 登录API
 *
 * @param data {LoginData}
 * @returns
 */
export function loginApi(data: LoginData): AxiosPromise<LoginResult> {
  const formData = new FormData();
  formData.append("username", data.username);
  formData.append("password", data.password);
  formData.append("verifyCodeKey", data.verifyCodeKey || "");
  formData.append("verifyCode", data.verifyCode || "");
  formData.append("grant_type", "captcha");
  return request({
    url: "/youlai-auth/oauth/token",
    method: "post",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: "Basic bWFsbC1hZG1pbjoxMjM0NTY=", // 客户端信息Base64明文：mall-admin:123456
    },
  });
}

/**
 * 注销API
 */
export function logoutApi() {
  return request({
    url: "/youlai-auth/oauth/logout",
    method: "delete",
  });
}

/**
 * 获取验证码
 */
export function getCaptchaApi(): AxiosPromise<CaptchaResult> {
  return request({
    url: "/captcha",
    method: "get",
  });
}
