import Cookies from 'js-cookie'

const TokenKey = 'loginToken'

export function getToken() {
  console.info(Cookies.get(TokenKey)+"getToken")
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  console.info(token+"set")
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  console.info(TokenKey+"remove")
  return Cookies.remove(TokenKey)
}
