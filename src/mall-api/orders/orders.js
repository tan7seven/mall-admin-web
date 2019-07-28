import request from '@/utils/request'
export function getPage(data) {
  return request({
    url:'/ordersController/getPage.do',
    method:'post',
    data:data
  })
}
export function getOrdersDetail(id) {
  return request({
    url:'/ordersController/getOrders.do/'+id,
    method:'get'
  })
}
export function updateReceiverInfo(data) {
  return request({
    url:'/ordersController/updateReceiverInfo.do',
    method:'post',
    data:data
  })
}

export function updateMoneyInfo(data) {
  return request({
    url:'/ordersController/updateMoneyInfo.do',
    method:'post',
    data:data
  })
}
export function updateRemarkInfo(params) {
  return request({
    url:'/ordersController/updateRemarkInfo.do',
    method:'post',
    params:params
  })
}
export function closeOrders(params) {
  return request({
    url:'/ordersController/closeOrders.do',
    method:'post',
    params:params
  })
}
export function deleteOrders(params) {
  return request({
    url:'/ordersController/deleteOrders.do',
    method:'post',
    params:params
  })
}
