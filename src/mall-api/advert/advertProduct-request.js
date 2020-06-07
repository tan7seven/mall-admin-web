import request from '@/utils/request'

export default {
    // 分页查询商品
    getPage(params) {
        return request({
          url:'/advert-product/list',
          method:'GET',
          params:params
        })
    },
    // 添加广告商品
    createAdvert(data){
      return request({
        url:'/advert-product/create',
        method:'POST',
        data:data
      })
    },
    // 修改广告商品
    modifyAdvert(data){
      return request({
        url:'/advert-product/modify',
        method:'POST',
        data:data
      })
    },
    // 删除广告商品
    removeAdvert(id){
      return request({
        url:'/advert-product/delete/'+id,
        method:'DELETE',
      })
    },
};
