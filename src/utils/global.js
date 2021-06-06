import Vue from 'vue'

const ROOT_ROLE_CODE = 'ROOT' ; // 超级管理员角色编号
export default {
  install() {
    Vue.prototype.ROOT_ROLE_CODE = ROOT_ROLE_CODE
  }
}
