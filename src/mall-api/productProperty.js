import request from '@/utils/request'
export function getPage(params) {
  return request({
    url:'/productPropertyController/getPage.do/',
    method:'get',
    params:params
  })
}
export function deleteProductProperty(id){
  return request({
    url:'/productPropertyController/delete.do/'+id,
    method:'get'
  })
}

export function getProductProperty(id) {
  return request({
    url:'/productPropertyController/getById.do/'+id,
    method:'get',
  })
}

export function updateProductProperty(id, params){
  return request({
    url:'/productPropertyController/update.do/'+id,
    method :"post",
    params:params
  })
}
export function createProductProperty(params){
  return request({
    url:'/productPropertyController/create.do/',
    method :"post",
    params:params
  })
}
export function updateIsSale(params){
  return request({
    url:'/productPropertyController/updateIsSale.do/',
    method :"post",
    params:params
  })
}
export function updateIsShow(params){
  return request({
    url:'/productPropertyController/updateIsShow.do/',
    method :"post",
    params:params
  })
}
export function updateIsUsable(params){
  return request({
    url:'/productPropertyController/updateIsUsable.do/',
    method :"post",
    params:params
  })
}
