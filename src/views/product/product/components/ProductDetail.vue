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
    <product-Attr-detail
      v-show="showStatus[1]"
      v-model="productParam"
      :is-edit="isEdit"
      @prevStep="prevStep"
      ref="productAttrDetail"
      @finishCommit="finishCommit">
    </product-Attr-detail>
  </el-card>
</template>
<script>
  import ProductInfoDetail from './ProductInfoDetail';
  import ProductAttrDetail from './ProductAttrDetail';
  import {createProduct,getProductById,updateProduct, deletePic} from '@/mall-api/product/product';
  import {_mapToJson} from '@/utils/common';

  const defaultProductParam = {
    //商品名称
    productName:'',
    //商品明细
    detail:"",
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
    picList:[],
    attrValueMap:new Map(),
    attrValueString:"",
  };
  export default {
    name: 'ProductDetail',
    components: {ProductInfoDetail, ProductAttrDetail},
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
      if(this.isEdit){
        getProductById(this.$route.query.id).then(response=>{
          this.productParam=response.data;
          this.productParam.attrValueMap=new Map();
          //调用子组件方法
          this.$refs.productAttrDetail.initUpdateDate(this.productParam)
          this.$refs.ProductInfoDetail.initUpdateDate(this.productParam)
        });
      } else {
        this.productParam = Object.assign({}, defaultProductParam);
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
          debugger
          this.productParam.attrValueString = _mapToJson(this.productParam.attrValueMap);
          if(isEdit){
            updateProduct(this.$route.query.id,this.productParam).then(response=>{
              this.$message({
                type: 'success',
                message: '提交成功',
                duration:1000
              });
              this.$router.back();
            });
          }else{
            createProduct(this.productParam).then(response=>{
              this.$message({
                type: 'success',
                message: '提交成功',
                duration:1000
              });
              this.$router.back();
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


