import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: '/adminController/login.do',
    method: 'post',
    params: {
      username,
      password
    }
  })
}

export function getInfo() {
  return request({
    url: '/adminController/getAdminInfo.do',
    method: 'get',
  })
}

export function logout() {
  return request({
    url: '/adminController/logout.do',
    method: 'post'
  })
}
