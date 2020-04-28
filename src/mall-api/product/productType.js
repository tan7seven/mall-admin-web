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
//获取详情
export function getDetail(id) {
  return request({
    url:'/product-type/detail/get/'+id,
    method:'get',
  })
}
//创建
export function createProductType(data) {
  return request({
    url:'/product-type/create',
    method:'post',
    data:data
  })
}
//修改
export function updateProductType(typeId,data) {
  return request({
    url:'/product-type/modify',
    method:'post',
    data:data
  })
}
//删除
export function deleteProductType(id) {
  return request({
    url:'/product-type/delete/'+id,
    method:'get'
  })
}
// 获取类目下拉框
export function getProductTypeCascader() {
  return request({
    url:'/product-type/cascader/get',
    method:'get'
  })
}









