import request from '@/utils/request'

export function getPage(params) {
  return request({
    url:'/ordersReturnApplyController/getPage.do',
    method:'post',
    params:params
  })
}
export function deleteApply(data) {
  return request({
    url:'/ordersReturnApplyController/deleteApply.do',
    method:'post',
    data:data
  })
}
export function getApplyById(id) {
  return request({
    url:'/ordersReturnApplyController/getApplyById.do/'+id,
    method:'get',
  })
}
export function updateApplyStatus(params) {
  return request({
    url:'/ordersReturnApplyController/updateApplyStatus.do',
    method:'post',
    params:params
  })
}


