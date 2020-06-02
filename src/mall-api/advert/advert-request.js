import request from '@/utils/request'

export default {
    // 分页查询
    getPage(params) {
        return request({
          url:'/advert/list',
          method:'GET',
          params:params
        })
    },
    // 类型列表
    getTypeEnumList(){
      return request({
        url:'/advert/type-enum/list',
        method:'GET'
      })
    },
    // 广告详情
    getAdvertInfo(id){
      return request({
        url:'/advert/detail/'+id,
        method:'GET'
      })
    },
    // 添加广告
    createAdvert(data){
      return request({
        url:'/advert/create',
        method:'POST',
        data:data
      })
    },
    // 修改广告
    modifyAdvert(data){
      return request({
        url:'/advert/modify',
        method:'POST',
        data:data
      })
    },
    // 删除广告
    removeAdvert(id){
      return request({
        url:'/advert/delete/'+id,
        method:'DELETE',
      })
    },
};