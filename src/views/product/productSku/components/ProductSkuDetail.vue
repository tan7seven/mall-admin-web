<template>
  <el-card class="form-container" shadow="never">
    <el-form :model="productSku"
             :rules="rules"
             ref="productSkuForm"
             label-width="150px">
      <el-form-item label="商品名称：" prop="productName">
        <el-select
          v-model="productSku.productId"
          filterable
          remote
          placeholder="请输入关键词"
          :remote-method="findProductName"
          v-on:change="productNameChange"
          :loading="loading" >
          <el-option
            v-for="(item,index) in productNameOptions"
            :key="index"
            :label="item.productName"
            :value="item.productId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品类目：">
        <el-input v-model="productSku.typeName" ></el-input>
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
  import {create, update} from '@/mall-api/productSku';
  import {getProductByName} from '@/mall-api/product';
  import SingleUpload from '@/components/Upload/singleUpload';

  const defaultProductSku = {
    productId:null,
    productName:null,
    price:null,
    typeName:null,
    cost:0,
    stock:0,
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
                updateProductProperty(this.$route.query.propertyNameId, this.productSku).then(response => {
                  this.$message({
                    message: '修改成功',
                    type: 'success',
                    duration: 1000
                  });
                  this.$router.back();
                });
              } else {
                createProductProperty(this.productSku).then(response => {
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
        this.productSku = Object.assign({}, defaultProductProperty);
      },
      //根据名称获取商品名称列表
      findProductName(query){
        this.loading = true;
        getProductByName(query).then(response => {
          this.loading = false;
          let list = response.data;
          this.productNameOptions = list;
        });
      },
      productNameChange(newValue){
        console.info(this.productNameOptions[newValue].typeName)
      }
    }
  }
</script>

<style scoped>

</style>
