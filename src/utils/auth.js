const TokenKey = 'Youlai-Token'

export function getToken() {
  return window.localStorage.getItem(TokenKey)
}

export function setToken(token) {
  window.localStorage.setItem(TokenKey, token)
}

export function removeToken() {
  return window.localStorage.removeItem(TokenKey)
}
