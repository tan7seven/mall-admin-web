import request from '@/utils/request'

// 分页查询
export function getPage(params) {
  return request({
    url:'/product/page/get',
    method:'get',
    params:params
  })
}
// 创建商品
export function createProduct(data) {
  return request({
    url:'/product/create',
    method:'post',
    data:data
  })
}
//修改上下架状态
export function updateIsPutaway(data) {
  return request({
    url:'/product/putaway/update',
    method:'post',
    data:data
  })
}
// 根据ID获取详情
export function getProductById(id) {
  return request({
    url:'/product/detail/get/'+id,
    method:'get',
  })
}

export function updateProduct(id,data) {
  return request({
    url:'/product/update.do/'+id,
    method:'post',
    data:data
  })
}





export function getProductByName(name) {
  return request({
    url:'/product/findProductByName.do',
    method:'post',
    params:{name:name}
  })
}
export function deleteProduct(params) {
  return request({
    url:'/product/delete.do',
    method:'post',
    params:params
  })
}


export  function deletePic(picUrl){
  return request({
    url:'/product/deletePic.do',
    method:'post',
    params:{picUrl:picUrl}
  })
}
