import {asyncRoutes, constantRoutes} from '@/router'
import Layout from '@/layout'
import {getMenuRouteList} from '@/api/admin/menu'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  // 超级管理员放行
  if (roles.includes('ROOT')) {
    return true
  }
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []
  routes.forEach(route => {
    const tmp = {...route}
    if (hasPermission(roles, tmp)) {
      const component = tmp.component
      if (route.component) {
        if (component == 'Layout') {
          tmp.component = Layout
        } else {
          tmp.component = (resolve) => require([`@/views/${component}`], resolve)
        }
        if (tmp.children) {
          tmp.children = filterAsyncRoutes(tmp.children, roles)
        }
      }
      res.push(tmp)
    }
  })
  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({commit}, roles) {
    return new Promise(resolve => {
      getMenuRouteList().then(response => {
        let accessedRoutes = filterAsyncRoutes(response.data, roles)
        commit('SET_ROUTES', accessedRoutes)
        resolve(accessedRoutes)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
