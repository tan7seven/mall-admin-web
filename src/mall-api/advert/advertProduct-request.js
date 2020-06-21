import request from '@/utils/request'

export default {
  // 分页查询
  getPage(params) {
    return request({
      url:'/advert-product/list',
      method:'GET',
      params:params
    })
  },
  // 类型列表
  getTypeEnumList(){
    return request({
      url:'/advert-product/type-enum/list',
      method:'GET'
    })
  },
  // 广告详情
  getAdvertInfo(id){
    return request({
      url:'/advert-product/detail/'+id,
      method:'GET'
    })
  },
  // 添加广告
  createAdvert(data){
    return request({
      url:'/advert-product/create',
      method:'POST',
      data:data
    })
  },
  // 修改广告
  modifyAdvert(data){
    return request({
      url:'/advert-product/modify',
      method:'POST',
      data:data
    })
  },
  // 删除广告
  removeAdvert(id){
    return request({
      url:'/advert-product/delete/'+id,
      method:'DELETE',
    })
  },
};
