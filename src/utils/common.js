import request from '@/utils/request'
export function getPage(params) {
  return request({
    url:'/productController/getPage.do',
    method:'get',
    params:params
  })
}
