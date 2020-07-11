import request from '@/utils/request'
export function getMenuListByParentId(parentId) {
  return request({
    url:'/menu/sub-list/'+parentId,
    method:'get'
  })
  
}
export function updateMenu(id, data) {
  return request({
    url:'/menu/updateMenu.do/'+id,
    method:'post',
    data:data
  })
}

export function createMenu(data) {
  return request({
    url:'/menu/createMenu.do',
    method:'post',
    data:data
  })
}

export function getMenuInfo(id) {
  return request({
    url:'/menu/detail/'+id,
    method:'get',
  })
}
export function deleteMenu(params) {
  return request({
    url:'/menu/deleteMenu.do',
    method:'post',
    params:params
  })
}
export function updateIsHidden(data) {
  return request({
    url:'/menu/updateIsHidden.do',
    method:'post',
    data:data
  })
}
export function getMenuList(id, data) {
  return request({
    url:'/menu/getMenuList.do/'+id,
    method:'post',
    data:data
  })
}

export function getMenuTree(params) {
  params?params:{};
  return request({
    url:'/menu/getMenuTree.do',
    method:'get',
    params:params,
  })
}

export function getButtonList(params) {
  return request({
    url:'/menu/getButtonList.do',
    method:'post',
    params:params,
  })
}
