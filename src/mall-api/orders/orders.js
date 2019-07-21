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

