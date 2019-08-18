<template> 
  <el-card class="form-container" shadow="never">
    <el-steps :active="active" finish-status="success" align-center>
      <el-step title="填写商品信息"></el-step>
      <el-step title="填写商品属性"></el-step>
    </el-steps>
    <product-info-detail
      v-show="showStatus[0]"
      v-model="productParam"
      :is-edit="isEdit"
      ref="ProductInfoDetail"
      @nextStep="nextStep">
    </product-info-detail>
    <product-property-detail
      v-show="showStatus[1]"
      v-model="productParam"
      :is-edit="isEdit"
      @prevStep="prevStep"
      ref="productPropertyDetail"
      @finishCommit="finishCommit">
    </product-property-detail>
  </el-card>
</template>
<script>
  import ProductInfoDetail from './ProductInfoDetail';
  import ProductPropertyDetail from './ProductPropertyDetail';
  import {createProduct,getProduct,updateProduct, deletePic} from '@/mall-api/product';

  const defaultProductParam = {
    //商品名称
    productName:'',
    //商品明细
    detail:"",
    //最低价格
    priceMin : "",
    //计量单位
    unit : "",
    //排序
    sort : "",
    //分类ID,
    productTypeId:"",
    //类目父类ID
    productTypeParentId:"",
    //图片路径
    picUrl:null,
    picUrlArray:[],
    //销售属性值
    productPropertyIsSaleChecked : [],
    //非销售属性值
    productPropertyNotSaleChecked : [],
  };
  export default {
    name: 'ProductDetail',
    components: {ProductInfoDetail, ProductPropertyDetail},
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        active: 0,
        productParam: Object.assign({}, defaultProductParam),
        showStatus: [true, false, false, false]
      }
    },
    created(){
      this.productParam=defaultProductParam;
      if(this.isEdit){
        getProduct(this.$route.query.id).then(response=>{
          this.productParam=response.data;
          //防止商品没有属性值的时候报错
          if(!this.productParam.productPropertyIsSaleChecked){
            //销售属性值
            this.productParam.productPropertyIsSaleChecked = [];
          }
          if(!this.productParam.productPropertyNotSaleChecked){
            //非销售属性值
            this.productParam.productPropertyNotSaleChecked = [];
          }
          //调用子组件方法
          this.$refs.productPropertyDetail.setEditData(this.productParam)
          this.$refs.ProductInfoDetail.setPicFileList(this.productParam)
        });
      }
    },
    methods: {
      hideAll() {
        for (let i = 0; i < this.showStatus.length; i++) {
          this.showStatus[i] = false;
        }
      },
      prevStep() {
        if (this.active > 0 && this.active < this.showStatus.length) {
          this.active--;
          this.hideAll();
          this.showStatus[this.active] = true;
        }
      },
      nextStep() {
        if (this.active < this.showStatus.length - 1) {
          this.active++;
          this.hideAll();
          this.showStatus[this.active] = true;
        }
      },
      finishCommit(isEdit) {
        this.$confirm('是否要提交该产品', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if(isEdit){
            updateProduct(this.$route.query.id,this.productParam).then(response=>{
              this.$message({
                type: 'success',
                message: '提交成功',
                duration:1000
              });
              this.$router.back();
              this.productParam=defaultProductParam;
            });
          }else{
            createProduct(this.productParam).then(response=>{
              this.$message({
                type: 'success',
                message: '提交成功',
                duration:1000
              });
              this.$router.back();
              this.productParam=defaultProductParam;
            });
          }
        })
      }
    }
  }
</script>
<style>
  .form-container {
    width: 800px;
  }
</style>


