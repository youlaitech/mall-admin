const accessTokenKey = 'YOULAI_ACCESS_TOKEN'
const refreshTokenKey = 'YOULAI_REFRESH_TOKEN'

export function getToken() {
  return window.localStorage.getItem(accessTokenKey)
}

export function setToken(token) {
  window.localStorage.setItem(accessTokenKey, token)
}

export function removeToken() {
  return window.localStorage.removeItem(accessTokenKey)
}


export function getRefreshToken() {
  return window.localStorage.getItem(refreshTokenKey)
}

export function setRefreshToken(token) {
  window.localStorage.setItem(refreshTokenKey, token)
}

export function removeRefreshToken() {
  return window.localStorage.removeItem(refreshTokenKey)
}

