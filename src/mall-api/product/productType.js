import request from '@/utils/request'
//分页查询
export function getPage(params) {
  return request({
    url:'/product-type/page/query',
    method:'get',
    params:params
  })
}
//是否显示
export function updateShowSattus(data) {
  return request({
    url:'/product-type/show-status/update',
    method:'post',
    data:data
  })
}
//是否可用
export function updateUsable(data) {
  return request({
    url:'/product-type/usable/update',
    method:'post',
    data:data
  })
}
export function deleteProductType(id) {
  return request({
    url:'/product-type/delete.do/'+id,
    method:'get'
  })
}

export function createProductType(data) {
  return request({
    url:'/product-type/create.do',
    method:'post',
    data:data
  })
}

export function updateProductType(typeId,data) {
  return request({
    url:'/product-type/updateProductType.do/'+typeId,
    method:'post',
    data:data
  })
}

export function getProductType(id) {
  return request({
    url:'/product-type/getById.do/'+id,
    method:'get',
  })
}

export function getProductTypeProperty(id) {
  return request({
    url:'/product-type/getProductTypeProperty.do/'+id,
    method:'get',
  })
}




export function getProductTypeCascader() {
  return request({
    url:'/product-type/getProductTypeCascader.do',
    method:'get'
  })
}
