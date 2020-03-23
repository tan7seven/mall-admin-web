import request from '@/utils/request'

export function getCompanyAddressList(params) {
  return request({
    url:'/companyAddressController/getCompanyAddressList.do',
    method:'post',
    params:params
  })
}
