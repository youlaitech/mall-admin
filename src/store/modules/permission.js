import {asyncRoutes, constantRoutes} from '@/router'
import Layout from '@/layout'
import {list as getRoutes} from '@/api/admin/menu'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

export const loadView = (view) => { // 路由懒加载
  return () => import('@/views/' + view)
}

export const loadView2 = (view) => {
  return (resolve) => require([`@/views/${view}`], resolve)
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
          // tmp.component = resolve => require(['@/view'+ component], resolve)\
          tmp.component = loadView(component)
        }
        if (tmp.children) {
          tmp.children = filterAsyncRoutes(tmp.children, roles)
        }
      }
      res.push(tmp)
    }
  })
  console.log("11233", res)
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
      getRoutes({mode: 3}).then(response => {
        console.log('获取菜单路由', response.data)
        let accessedRoutes = filterAsyncRoutes(response.data, roles)
        commit('SET_ROUTES', accessedRoutes)
        resolve(accessedRoutes)
      })
    })


    /*return new Promise(resolve => {
      let accessedRoutes
      if (roles.includes('admin')) {
        accessedRoutes = asyncRoutes || []
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })*/
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
