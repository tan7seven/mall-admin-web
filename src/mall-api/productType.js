import request from '@/utils/request'
export function getPage(parentId,params) {
  return request({
    url:'/productType/getPage.do/'+parentId,
    method:'get',
    params:params
  })
}
export function deleteProductType(id) {
  return request({
    url:'/productType/delete.do/'+id,
    method:'get'
  })
}

export function createProductType(data) {
  return request({
    url:'/productType/create.do',
    method:'post',
    data:data
  })
}

export function updateProductType(typeId,data) {
  return request({
    url:'/productType/updateProductType.do/'+typeId,
    method:'post',
    data:data
  })
}

export function getProductType(id) {
  return request({
    url:'/productType/getById.do/'+id,
    method:'get',
  })
}

export function getProductTypeProperty(id) {
  return request({
    url:'/productType/getProductTypeProperty.do/'+id,
    method:'get',
  })
}

export function updateStatus(data) {
  return request({
    url:'/productType/update/status.do',
    method:'post',
    data:data
  })
}

export function updateNavigationBar(data) {
  return request({
    url:'/productType/update/isNavigationBar.do',
    method:'post',
    data:data
  })
}

export function getProductTypeCascader() {
  return request({
    url:'/productType/getProductTypeCascader.do',
    method:'get'
  })
}
