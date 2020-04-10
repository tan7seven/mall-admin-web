import request from '@/utils/request'

// 分页查询
export function getPage(params) {
  return request({
    url:'/product-sku/page/get',
    method:'get',
    params:params
  })
}
// 创建
export function createProductSku(data) {
  return request({
    url:'/product-sku/create',
    method:'post',
    data:data
  })
}
// 根据商品ID获取SKU列表
export function findByProductId(params){
  return request({
    url:'/product-sku/product-id/get',
    method:'get',
    params:params
  })
}
