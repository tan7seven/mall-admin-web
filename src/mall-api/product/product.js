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
// 修改商品
export function updateProduct(data) {
  return request({
    url:'/product/update',
    method:'post',
    data:data
  })
}
// 删除商品
export function deleteProduct(data) {
  return request({
    url:'/product/delete',
    method:'delete',
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