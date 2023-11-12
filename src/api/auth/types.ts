/**
 * 登录请求参数
 */
export interface LoginData {
  /**
   * 用户名
   */
  username: string;
  /**
   * 密码
   */
  password: string;

  grant_type?: string;
  /**
   * 验证码Code
   */
  verifyCode?: string;
  /**
   * 验证码Code服务端缓存key(UUID)
   */
  verifyCodeKey?: string;
}

/**
 * 登录响应
 */
export interface LoginResult {
  /**
   * 访问token
   */
  access_token?: string;
  /**
   * 过期时间(单位：毫秒)
   */
  expires?: number;
  /**
   * 刷新token
   */
  refresh_token?: string;
  /**
   * token 类型
   */
  token_type?: string;
}

/**
 * 验证码响应
 */
export interface CaptchaResult {
  /**
   * 验证码缓存key
   */
  verifyCodeKey: string;
  /**
   * 验证码图片Base64字符串
   */
  captchaImgBase64: string;
}
