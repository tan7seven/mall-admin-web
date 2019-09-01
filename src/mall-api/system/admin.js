import request from '@/utils/request'
export function getPage(params) {
  return request({
    url:'/adminController/getPage.do',
    method:'post',
    params:params
  })
}

export function updateAdmin(id, data) {
  return request({
    url:'/adminController/updateAdmin.do/'+id,
    method:'post',
    data:data
  })
}

export function createAdmin(data) {
  return request({
    url:'/adminController/createAdmin.do',
    method:'post',
    data:data
  })
}

export function getAdminInfo(id) {
  return request({
    url:'/adminController/getAdminInfo.do/'+id,
    method:'get',
  })
}
export function deleteAdmin(params) {
  return request({
    url:'/adminController/deleteAdmin.do',
    method:'post',
    params:params
  })
}
export function updateIsUsable(data) {
  return request({
    url:'/adminController/updateIsUsable.do',
    method:'post',
    data:data
  })
}
export function menuAuthorityConfirm(data) {
  return request({
    url:'/adminController/menuAuthorityConfirm.do',
    method:'post',
    data:data
  })
}
export function buttonAuthorityConfirm(data) {
  return request({
    url:'/adminController/buttonAuthorityConfirm.do',
    method:'post',
    data:data
  })
}
export function getAdminMenuAuthority(id) {
  return request({
    url:'/adminController/getAdminMenuAuthority.do/'+id,
    method:'get',
  })
}
