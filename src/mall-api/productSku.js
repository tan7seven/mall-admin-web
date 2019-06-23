import request from '@/utils/request'
export function getPage(params) {
  return request({
    url:'/productSkuController/getPage.do',
    method:'get',
    params:params
  })
}

export function create(data) {
  return request({
    url:'/productSkuController/create.do',
    method:'post',
    data:data
  })
}

export function update(id,data) {
  return request({
    url:'/productSkuController/update/'+id,
    method:'post',
    data:data
  })
}



