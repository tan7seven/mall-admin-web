import request from '@/utils/request'
export function getPage(params) {
  return request({
    url:'/productSkuController/getPage.do',
    method:'get',
    params:params
  })
}

export function findById(id) {
  return request({
    url:'/productSkuController/findById.do/'+id,
    method:'get'
  })
}
export function updateProductSku(id, data) {
  return request({
    url:'/productSkuController/update.do/'+id,
    method:'post',
    data:data
  })
}
export function createProductSku(data) {
  return request({
    url:'/productSkuController/create.do',
    method:'post',
    data:data
  })
}

export function deleteSku(id ){
  return request({
    url:'/productSkuController/delete.do/'+id,
    method:'get'
  })
}

