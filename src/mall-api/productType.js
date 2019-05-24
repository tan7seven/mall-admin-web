import request from '@/utils/request'
export function getList(parentId,params) {
  return request({
    url:'/productType/getList.do/'+parentId,
    method:'get',
    params:params
  })
}
export function deleteProductType(id) {
  return request({
    url:'/productCategory/delete/'+id,
    method:'post'
  })
}

export function createProductType(data) {
  return request({
    url:'/productType/create.do',
    method:'post',
    data:data
  })
}

export function updateProductType(id,data) {
  return request({
    url:'/productCategory/update/'+id,
    method:'post',
    data:data
  })
}

export function getProductType(id) {
  return request({
    url:'/productCategory/'+id,
    method:'get',
  })
}

export function updateShowStatus(data) {
  return request({
    url:'/productCategory/update/showStatus',
    method:'post',
    data:data
  })
}

export function updateNavStatus(data) {
  return request({
    url:'/productCategory/update/navStatus',
    method:'post',
    data:data
  })
}

export function fetchListWithChildren() {
  return request({
    url:'/productCategory/list/withChildren',
    method:'get'
  })
}
