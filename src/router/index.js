import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 **/
export const constantRouterMap = [
  {path: '/login', component: () => import('@/views/login/index.vue'), hidden: true},
  {path: '/404', component: () => import('@/views/404'), hidden: true},
  {
    path: '',
    component: Layout,
    redirect: '/home',
    children: [{
      path: 'home',
      name: 'home',
      code:'HOME',
      component: () => import('@/views/home/index.vue'),
      meta: {title: '首页', icon: 'home'}
    }]
  },
  {
    path: '/pms',
    component: Layout,
    redirect: '/pms/product',
    name: 'pms',
    code:'PMS',
    meta: {title: '商品', icon: 'product'},
    children: [{
      path: 'product',
      name: 'product',
      code:'PMS:PRODUCT',
      component: () => import('@/views/product/product/index.vue'),
      meta: {title: '商品列表', icon: 'product-list'}
      },{
        path: 'addProduct',
        name: 'pms:addProduct',
        code:'PMS:ADDPRODUCT',
        component: () => import('@/views/product/product/add'),
        meta: {title: '添加商品', icon: 'product-add'}
      },{
      path: 'updateProduct',
      name: 'updateProduct',
      component: () => import('@/views/product/product/update'),
      meta: {title: '修改商品', hiddenTag:true},
      hidden: true
    },{
        path: 'productSku',
        name: 'pms:productSku',
        code:'PMS:PRODUCTSKU',
        component: () => import('@/views/product/productSku/index.vue'),
        meta: {title: '商品库存', icon: 'product-list'}
      },{
        path: 'addProductSku',
        name: 'addProductSku',
        component: () => import('@/views/product/productSku/add'),
        meta: {title: '添加商品库存', hiddenTag:true},
        hidden: true
      },{
      path: 'updateProductSku',
      name: 'updateProductSku',
      component: () => import('@/views/product/productSku/update'),
      meta: {title: '修改商品库存', hiddenTag:true},
      hidden: true
    },{
        path: 'productType',
        name: 'pms:productType',
        code:'PMS:PRODUCTTYPE',
        component: () => import('@/views/product/productType/index.vue'),
        meta: {title: '商品分类', icon: 'product-cate'}
      },{
        path: 'addProductType',
        name: 'addProductType',
        component: () => import('@/views/product/productType/add'),
        meta: {title: '添加商品分类', hiddenTag:true},
        hidden: true
      }, {
        path: 'updateProductType',
        name: 'updateProductType',
        component: () => import('@/views/product/productType/update'),
        meta: {title: '修改商品分类', hiddenTag:true},
        hidden: true
      },{
        path: 'productProperty',
        name: 'pms:productProperty',
        code:'PMS:PRODUCTPROPERTY',
        component: () => import('@/views/product/productProperty/index.vue'),
        meta: {title: '分类属性', icon: 'product-attr'}
      },{
        path: 'addProductProperty',
        name: 'addProductProperty',
        component: () => import('@/views/product/productProperty/add'),
        meta: {title: '添加商品分类属性', hiddenTag:true},
        hidden: true
      },{
        path: 'updateProductProperty',
        name: 'updateProductProperty',
        component: () => import('@/views/product/productProperty/update'),
        meta: {title: '修改商品分类属性', hiddenTag:true},
        hidden: true
      }
    ]
  },
  {
    path: '/oms',
    component: Layout,
    redirect: '/oms/order',
    name: 'oms',
    code:'OMS',
    meta: {title: '订单', icon: 'order'},
    children: [
      {
        path: 'order',
        name: 'order',
        code:'OMS:ORDER',
        component: () => import('@/views/orders/orders/index.vue'),
        meta: {title: '订单列表', icon: 'product-list'}
      },
      {
        path: 'orderDetail',
        name: 'orderDetail',
        component: () => import('@/views/orders/orders/orderDetail'),
        meta: {title: '订单详情', hiddenTag:true},
        hidden:true
      },
      {
        path: 'deliverOrderList',
        name: 'deliverOrderList',
        component: () => import('@/views/orders/orders/deliverOrderList'),
        meta: {title: '订单发货', hiddenTag:true},
        hidden:true
      },
      {
        path: 'orderSetting',
        name: 'orderSetting',
        code:'OMS:ORDERSETTING',
        component: () => import('@/views/orders/orders/setting'),
        meta: {title: '订单设置', icon: 'setting'}
      },
      {
        path: 'returnApply',
        name: 'returnApply',
        code:'OMS:RETURNAPPLY',
        component: () => import('@/views/orders/return/index.vue'),
        meta: {title: '退货申请处理', icon: 'order-return'}
      },
      {
        path: 'returnReason',
        name: 'returnReason',
        component: () => import('@/views/orders/return/reason'),
        meta: {title: '退货原因设置', icon: 'order-return-reason'}
      },
      {
        path: 'returnApplyDetail',
        name: 'returnApplyDetail',
        component: () => import('@/views/orders/return/applyDetail'),
        meta: {title: '退货原因详情', hiddenTag:true},
        hidden:true
      }
    ]
  },
  {
    path:'/sms',
    component: Layout,
    redirect: '/sms/coupon',
    name: 'sms',
    meta: {title: '营销', icon: 'sms'},
    children: [
      {
        path: 'flash',
        name: 'flash',
        component: () => import('@/views/sms/flash/index.vue'),
        meta: {title: '秒杀活动列表', icon: 'sms-flash'}
      },
      {
        path: 'flashSession',
        name: 'flashSession',
        component: () => import('@/views/sms/flash/sessionList'),
        meta: {title: '秒杀时间段列表'},
        hidden:true
      },
      {
        path: 'selectSession',
        name: 'selectSession',
        component: () => import('@/views/sms/flash/selectSessionList'),
        meta: {title: '秒杀时间段选择'},
        hidden:true
      },
      {
        path: 'flashProductRelation',
        name: 'flashProductRelation',
        component: () => import('@/views/sms/flash/productRelationList'),
        meta: {title: '秒杀商品列表'},
        hidden:true
      },
      {
        path: 'coupon',
        name: 'coupon',
        component: () => import('@/views/sms/coupon/index.vue'),
        meta: {title: '优惠券列表', icon: 'sms-coupon'}
      },
      {
        path: 'addCoupon',
        name: 'addCoupon',
        component: () => import('@/views/sms/coupon/add'),
        meta: {title: '添加优惠券'},
        hidden:true
      },
      {
        path: 'updateCoupon',
        name: 'updateCoupon',
        component: () => import('@/views/sms/coupon/update'),
        meta: {title: '修改优惠券'},
        hidden:true
      },
      {
        path: 'couponHistory',
        name: 'couponHistory',
        component: () => import('@/views/sms/coupon/history'),
        meta: {title: '优惠券领取详情'},
        hidden:true
      },
      {
        path: 'brand',
        name: 'homeBrand',
        component: () => import('@/views/sms/brand/index.vue'),
        meta: {title: '品牌推荐', icon: 'product-brand'}
      },
      {
        path: 'new',
        name: 'homeNew',
        component: () => import('@/views/sms/new/index.vue'),
        meta: {title: '新品推荐', icon: 'sms-new'}
      },
      {
        path: 'hot',
        name: 'homeHot',
        component: () => import('@/views/sms/hot/index.vue'),
        meta: {title: '人气推荐', icon: 'sms-hot'}
      },
      {
        path: 'subject',
        name: 'homeSubject',
        component: () => import('@/views/sms/subject/index.vue'),
        meta: {title: '专题推荐', icon: 'sms-subject'}
      },
      {
        path: 'advertise',
        name: 'homeAdvertise',
        component: () => import('@/views/sms/advertise/index.vue'),
        meta: {title: '广告列表', icon: 'sms-ad'}
      },
      {
        path: 'addAdvertise',
        name: 'addHomeAdvertise',
        component: () => import('@/views/sms/advertise/add'),
        meta: {title: '添加广告'},
        hidden:true
      },
      {
        path: 'updateAdvertise',
        name: 'updateHomeAdvertise',
        component: () => import('@/views/sms/advertise/update'),
        meta: {title: '编辑广告'},
        hidden:true
      }
    ]
  },
  {
    path:'/system',
    component: Layout,
    redirect: '/sys/admin',
    name: 'system',
    code:'SYSTEM',
    meta: {title: '系统管理', icon: 'setting'},
    children: [
      {
        path: 'admin',
        name: 'admin',
        code:'SYSTEM:ADMIN',
        component: () => import('@/views/system/admin/index.vue'),
        meta: {title: '用户列表', icon: 'user'}
      },{
        path: 'updateAdmin',
        name: 'updateAdmin',
        component: () => import('@/views/system/admin/update.vue'),
        meta: {title: '修改信息用户', hiddenTag:true},
        hidden:true
      },{
        path: 'createAdmin',
        name: 'createAdmin',
        component: () => import('@/views/system/admin/add.vue'),
        meta: {title: '新增信息用户', hiddenTag:true},
        hidden:true
      },{
        path: 'menu',
        name: 'menu',
        code:'SYSTEM:MENU',
        component: () => import('@/views/system/menu/index.vue'),
        meta: {title: '菜单列表', icon: 'menu-list'}
      },{
        path: 'updateMenu',
        name: 'updateMenu',
        component: () => import('@/views/system/menu/update.vue'),
        meta: {title: '修改菜单信息', hiddenTag:true},
        hidden:true
      },{
        path: 'createMenu',
        name: 'createMenu',
        component: () => import('@/views/system/menu/add.vue'),
        meta: {title: '新增菜单信息', hiddenTag:true},
        hidden:true
      },{
        path: 'authority',
        name: 'authority',
        component: () => import('@/views/sms/flash/index.vue'),
        meta: {title: '权限管理', icon: 'tree'}
      },
      ]
  },
  {path: '*', redirect: '/404', hidden: true}
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({y: 0}),
  routes: constantRouterMap
})

