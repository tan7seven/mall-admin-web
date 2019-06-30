import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: '/admin/login.do',
    method: 'post',
    params: {
      username,
      password
    }
  })
}

export function getInfo() {
  return request({
    url: '/admin/getAdminInfo.do',
    method: 'get',
  })
}

export function logout() {
  return request({
    url: '/admin/logout',
    method: 'post'
  })
}
