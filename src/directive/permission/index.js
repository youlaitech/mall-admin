import permission from './permission'
import hasPermission from './hasPermission'

const install = function(Vue) {
  Vue.directive('permission', permission)
  Vue.directive('hasPermission', hasPermission)
}

if (window.Vue) {
  window['permission'] = permission
  window['hasPermission'] = hasPermission
  Vue.use(install); // eslint-disable-line
}

permission.install = install
export default permission
