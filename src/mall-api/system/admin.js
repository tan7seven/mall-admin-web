import request from '@/utils/request'
export function getPage(params) {
  return request({
    url:'/adminController/getPage.do',
    method:'post',
    params:params
  })
}
