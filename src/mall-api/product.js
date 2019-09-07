import request from '@/utils/request'
export function getPage(params) {
  return request({
    url:'/productController/getPage.do',
    method:'get',
    params:params
  })
}

export function createProduct(data) {
  return request({
    url:'/productController/create.do',
    method:'post',
    data:data
  })
}

export function updateProduct(id,data) {
  return request({
    url:'/productController/update.do/'+id,
    method:'post',
    data:data
  })
}

export function getProduct(id) {
  return request({
    url:'/productController/getProduct.do/'+id,
    method:'get',
  })
}

export function getProductByName(name) {
  return request({
    url:'/productController/findProductByName.do',
    method:'post',
    params:{name:name}
  })
}
export function deleteProduct(params) {
  return request({
    url:'/productController/delete.do',
    method:'post',
    params:params
  })
}
export function updateIsPutaway(params) {
  return request({
    url:'/productController/updateIsPutaway.do',
    method:'post',
    params:params
  })
}

export  function deletePic(picUrl){
  return request({
    url:'/productController/deletePic.do',
    method:'post',
    params:{picUrl:picUrl}
  })
}
