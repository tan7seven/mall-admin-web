import request from '@/utils/request'
export function getPage(params) {
  return request({
    url:'/menuController/getPage.do',
    method:'post',
    params:params
  })
}
export function getMenuListById(params) {
  return request({
    url:'/menuController/getMenuListById.do',
    method:'post',
    params:params
  })
}
export function updateMenu(id, data) {
  return request({
    url:'/menuController/updateMenu.do/'+id,
    method:'post',
    data:data
  })
}

export function createMenu(data) {
  return request({
    url:'/menuController/createMenu.do',
    method:'post',
    data:data
  })
}

export function getMenuInfo(id) {
  return request({
    url:'/menuController/getMenuInfo.do/'+id,
    method:'get',
  })
}
export function deleteMenu(params) {
  return request({
    url:'/menuController/deleteMenu.do',
    method:'post',
    params:params
  })
}
export function updateIsHidden(data) {
  return request({
    url:'/menuController/updateIsHidden.do',
    method:'post',
    data:data
  })
}
export function getMenuList(id, data) {
  return request({
    url:'/menuController/getMenuList.do/'+id,
    method:'post',
    data:data
  })
}

export function getMenuTree(params) {
  params?params:{};
  return request({
    url:'/menuController/getMenuTree.do',
    method:'get',
    params:params,
  })
}

export function getButtonList(params) {
  return request({
    url:'/menuController/getButtonList.do',
    method:'post',
    params:params,
  })
}
