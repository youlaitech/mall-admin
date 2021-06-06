import store from '@/store'

// 校验用户是否拥有按钮权限
function hasPermission(el, binding) {
  const roles = store.getters && store.getters.roles
  // 超级管理员拥有所有的按钮权限
  if (roles.includes(this.ROOT_ROLE_CODE)) {
    return true
  }
  const {value} = binding
  const perms = store.getters && store.getters.perms
  if (value && value instanceof Array) {
    if (value.length > 0) {
      const requiredPerms = value
      const hasPermission = perms.some(perm => {
        return requiredPerms.includes(perm)
      })
      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    }
  } else {
    throw new Error(`need perms! Like v-has-permission="['system:user:add','system:user:edit']"`)
  }
}

export default {
  inserted(el, binding) {
    hasPermission(el, binding)
  },
  update(el, binding) {
    hasPermission(el, binding)
  }
}
