import request from '@/utils/request'
export function getPage(params) {
  return request({
    url:'/admin/page',
    method:'get',
    params:params
  })
}

export function updateAdmin(id, data) {
  return request({
    url:'/admin/updateAdmin.do/'+id,
    method:'post',
    data:data
  })
}

export function createAdmin(data) {
  return request({
    url:'/admin/createAdmin.do',
    method:'post',
    data:data
  })
}

export function getAdminInfo(id) {
  return request({
    url:'/admin/getAdminInfo.do/'+id,
    method:'get',
  })
}
export function deleteAdmin(params) {
  return request({
    url:'/admin/deleteAdmin.do',
    method:'post',
    params:params
  })
}
export function updateIsUsable(data) {
  return request({
    url:'/admin/updateIsUsable.do',
    method:'post',
    data:data
  })
}
export function menuAuthorityConfirm(data) {
  return request({
    url:'/admin/menuAuthorityConfirm.do',
    method:'post',
    data:data
  })
}
export function buttonAuthorityConfirm(data) {
  return request({
    url:'/admin/buttonAuthorityConfirm.do',
    method:'post',
    data:data
  })
}
export function getAdminMenuAuthority(id) {
  return request({
    url:'/admin/getAdminMenuAuthority.do/'+id,
    method:'get',
  })
}
