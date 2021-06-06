const getters = {
  sidebar: state => state.app.sidebar,
  language: state => state.app.language,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  permission_routes: state => state.permission.routes,
  errorLogs: state => state.errorLog.logs,
  nickname: state => state.user.nickname,
  avatar: state => state.user.avatar,
  roles: state => state.user.roles,
  perms: state => state.user.perms
}
export default getters
