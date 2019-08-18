import request from '@/utils/request'
/*params紧跟url后面，data设置form表单里，需要加@RequestBody*/
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

export function updateProductProperty(id, data){
  return request({
    url:'/productPropertyController/update.do/'+id,
    method :"post",
    data:data
  })
}
export function createProductProperty(data){
  return request({
    url:'/productPropertyController/create.do/',
    method :"post",
    data:data
  })
}
export function updateIsSale(data){
  return request({
    url:'/productPropertyController/updateIsSale.do/',
    method :"post",
    data:data
  })
}
export function updateIsShow(data){
  return request({
    url:'/productPropertyController/updateIsShow.do/',
    method :"post",
    data:data
  })
}
export function updateIsUsable(data){
  return request({
    url:'/productPropertyController/updateIsUsable.do/',
    method :"post",
    data:data
  })
}
