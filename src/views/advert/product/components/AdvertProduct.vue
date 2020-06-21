<template>
  <el-card class="form-container" shadow="never">
    <el-form :model="advertProductModel"
             :rules="rules"
             ref="advertProductModelForm"
             label-width="150px">
      <el-form-item label="商品编号" prop="productId">
        <el-input v-model="advertProductModel.productId" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="商品名称" prop="productName">
        <el-input v-model="advertProductModel.productName"></el-input>
      </el-form-item>
      <el-form-item label="商品图片">
        <Single-upload :picUrl="advertProductModel.picUrl" ref="picUrlSingleUpload" v-on:imageUrlChange="singleUploadSuccess"></Single-upload>
      </el-form-item>
      <el-form-item label="最低价："  >
          <el-input v-model="advertProductModel.price" type="number"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="selectProductHandle">选择商品</el-button>
        <el-button type="primary" @click="onSubmit('advertProductModelForm')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('advertProductModelForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <Product-Dialog :dialogTableVisible="true"></Product-Dialog>
  </el-card>
</template>

<script>
  import advertRequest from '@/mall-api/advert/advert-product-request.js';
  import SingleUpload from '@/components/Upload/singleUpload';
  import ProductDialog from'@/components/ProductDialog/productDialog';

  const defaultadvertProductModel = {
    procudtId:null,
    productName : null,
    picUrl : null,
    price: null
  };
  export default {
    name: "advertProduct",
    components: {SingleUpload, ProductDialog},
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        advertProductModel : Object.assign({}, defaultadvertProductModel),
        rules: {
          procudtId: [{
            required: true,
            message: '请选择商品',
            trigger: 'blur'
          }],
          productName:[{
            required: true,
            message: '请输入商品名称',
            trigger: 'blur'
          }],
        }
      }
    },
    created() {
     
      if (this.isEdit) {
        advertRequest.getAdvertInfo(this.$route.query.id).then(response => {
          this.advertProductModel = response.data;
        })
      }
    },
    methods: {
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$confirm('是否提交数据', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              if (this.isEdit) {
                advertRequest.modifyAdvert(this.advertProductModel).then(response => {
                  this.$message({
                    message: '修改成功',
                    type: 'success',
                    duration: 1000
                  });
                  this.$router.back();
                });
              } else {
                advertRequest.createAdvert(this.advertProductModel).then(response => {
                  this.resetForm(formName);
                  this.$message({
                    message: '提交成功',
                    type: 'success',
                    duration: 1000
                  });
                  this.$router.back();
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
        this.advertProductModel = Object.assign({}, defaultadvertProductModel);
      },
      singleUploadSuccess(oldParam, newVal){
        this.advertProductModel.picUrl = newVal;
      },
      selectProductHandle(){

      },
    }
  }
</script>

<style scoped>

</style>
