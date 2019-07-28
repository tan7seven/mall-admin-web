import request from '@/utils/request'
export function getOrdersSetting() {
  return request({
    url:'/ordersSettingController/getSetting.do',
    method:'post'
  })
}
export function updateOrdersSetting(id, params) {
  return request({
    url:'/ordersSettingController/updateOrdersSetting.do/'+id,
    method:'post',
    params:params
  })
}

