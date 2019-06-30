<template>
  <el-card class="form-container" shadow="never">
    <el-form :model="productSku"
             :rules="rules"
             ref="productSkuForm"
             label-width="150px">
      <el-form-item label="商品名称：" prop="productName">
        <el-select
          v-model="productSku.productName"
          filterable
          remote
          placeholder="请输入关键词"
          :remote-method="findProductName"
          v-on:change="productNameChange"
          :loading="loading" >
          <el-option
            v-for="(item,index) in productNameOptions"
            :key="item.productId"
            :label="item.productName"
            :value="item.productId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品类目：">
        <el-input v-model="productSku.typeName" :readonly="readonly"></el-input>
      </el-form-item>
      <el-form-item :label="productSku.propertyValueAOptions[0].propertyName+'：'" v-if="productSku.propertyValueAOptions && productSku.propertyValueAOptions.length > 0">
        <el-select
          v-model="productSku.propertyValueA" :clearable="clearable"
          placeholder="请选择属性值" >
          <el-option
            v-for="(item,index) in productSku.propertyValueAOptions"
            :key="item.propertyNameId+':'+item.propertyValueId"
            :label="item.value"
            :value="item.propertyNameId+':'+item.propertyValueId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="productSku.propertyValueBOptions[0].propertyName+'：'" v-if="productSku.propertyValueBOptions && productSku.propertyValueBOptions.length > 0">
        <el-select
          v-model="productSku.propertyValueB"  :clearable="clearable"
          placeholder="请选择属性值" >
          <el-option
            v-for="(item,index) in productSku.propertyValueBOptions"
            :key="item.propertyNameId+':'+item.propertyValueId"
            :label="item.value"
            :value="item.propertyNameId+':'+item.propertyValueId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="productSku.propertyValueCOptions[0].propertyName+'：'" v-if="productSku.propertyValueCOptions && productSku.propertyValueCOptions.length > 0">
        <el-select
          v-model="productSku.propertyValueC"  :clearable="clearable"
          placeholder="请选择属性值" >
          <el-option
            v-for="(item,index) in productSku.propertyValueCOptions"
            :key="item.propertyNameId+':'+item.propertyValueId"
            :label="item.value"
            :value="item.propertyNameId+':'+item.propertyValueId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品价格：" prop="price">
        <el-input v-model="productSku.price"  type="number" step="0.01"></el-input>
      </el-form-item>
      <el-form-item label="商品成本：">
        <el-input v-model="productSku.cost"  type="number" min="0" step="0.01" placeholder="默认0"></el-input>
      </el-form-item>
      <el-form-item label="库存数量：">
        <el-input v-model="productSku.stock"  type="number" min="0" placeholder="默认0"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('productSkuForm')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('productSkuForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
  import {createProductSku, updateProductSku, update, findById} from '@/mall-api/productSku';
  import {getProductByName, getProduct} from '@/mall-api/product';
  import SingleUpload from '@/components/Upload/singleUpload';

  const defaultProductSku = {
    skuId:null,
    productId:null,
    productName:null,
    price:null,
    typeName:null,
    cost:0,
    stock:0,
    propertyValueA:null,
    propertyValueB:null,
    propertyValueC:null,
    propertyValueAOptions:[],
    propertyValueBOptions:[],
    propertyValueCOptions:[],
  };
  export default {
    name: "productSkuDetail",
    components: {SingleUpload},
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        productSkuForm:{},
        clearable:true,
        readonly: true,
        loading: false,
        productSku: Object.assign({}, defaultProductSku),
        //商品名称下拉框
        productNameOptions:[],
        rules: {
          productName: [
            {required: true, message: '请输入属性名称', trigger: 'blur'},
            {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
          ],
          price :[
            {required: true, message: '请输入商品价格', trigger: 'blur'}
          ]
        }
      }
    },
    created() {
      if (this.isEdit) {
        this.findProductSku();
      }
      this.findProductName();
    },
    methods: {
      //表单提交
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$confirm('是否提交数据', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              console.info(this.productSku);
              if (this.isEdit) {
                updateProductSku(this.$route.query.skuId, this.productSku).then(response => {
                  this.$message({
                    message: '修改成功',
                    type: 'success',
                    duration: 1000
                  });
                  this.$router.back();
                });
              } else {
                createProductSku(this.productSku).then(response => {
                  this.$refs[formName].resetFields();
                  this.resetForm(formName);
                  this.$message({
                    message: '提交成功',
                    type: 'success',
                    duration: 1000
                  });
                });
              }
            });
          } else {
            this.$message({
              message: '验证失败',
              type: 'error',
              duration: 1000
            });
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.productSku = Object.assign({}, defaultProductSku);
      },
      //根据名称获取商品名称列表
      findProductName(query){
        let name = query?query:"";
        this.loading = true;
        getProductByName(name).then(response => {
          this.loading = false;
          let list = response.data;
          this.productNameOptions = list;
        });
      },
      productNameChange(newValue){
        getProduct(newValue).then(response =>{
          let list = response.data;
          this.productSku = list;
        });
      },
      findProductSku(){
        let skuId = this.$route.query.skuId;
        findById(skuId).then(response =>{
          let list = response.data;
          this.productSku = list;
        })
      }
    }
  }
</script>

<style scoped>

</style>
