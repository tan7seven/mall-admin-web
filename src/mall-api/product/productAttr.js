import request from '@/utils/request'
/*params紧跟url后面，data设置form表单里，需要加@RequestBody*/
// 分页查询
export function getPage(params) {
  return request({
    url:'/product-attr/page/get',
    method:'get',
    params:params
  })
}
//获取详情
export function getProductAttrDetail(id) {
  return request({
    url:'/product-attr/detail/get/'+id,
    method:'get',
  })
}
//修改
export function updateProductAttr(data){
  return request({
    url:'/product-attr/update',
    method :"post",
    data:data
  })
}
//删除
export function deleteProductAttr(id){
  return request({
    url:'/product-attr/delete/'+id,
    method:'delete'
  })
}
//新增
export function createProductAttr(data){
  return request({
    url:'/product-attr/create/',
    method :"post",
    data:data
  })
}
//修改是否显示
export function updateIsShow(data){
  return request({
    url:'/product-attr/showed/update',
    method :"post",
    data:data
  })
}
//修改是否可用
export function updateIsUsable(data){
  return request({
    url:'/product-attr/usable/update',
    method :"post",
    data:data
  })
}
// 根据类目ID获取属性列表
export function getAttrByTypeId(params) {
  return request({
    url:'/product-attr/type-id/get',
    method:'get',
    params:params
  })
}

// 根据商品ID获取属性值列表
export function getAttrByProductId(params) {
  return request({
    url:'/product-attr/product-id/get',
    method:'get',
    params:params
  })
}
