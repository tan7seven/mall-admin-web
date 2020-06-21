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
    <Single-Product-Dialog :dialogTableVisible="productDialogVisible" v-on:productSelectSubmit="productSelectSuccess"></Single-Product-Dialog>
  </el-card>
</template>

<script>
  import advertRequest from '@/mall-api/advert/advertProduct-request.js';
  import SingleUpload from '@/components/Upload/singleUpload';
  import SingleProductDialog from'@/components/ProductDialog/singleProductDialog';

  const defaultadvertProductModel = {
    procudtId:null,
    productName : null,
    picUrl : null,
    advertId:null,
    price: null
  };
  export default {
    name: "advertProduct",
    components: {SingleUpload, SingleProductDialog},
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        productDialogVisible:false,
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
      if(undefined == this.$route.query.advertId){
        this.$message({
          message: '请选择对应广告',
          type: 'success',
          duration: 1000
        });
        this.$router.back();
      }
      this.advertProductModel.advertId = this.$route.query.advertId;
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
        this.productDialogVisible=true;
      },
      productSelectSuccess(oldParam, selectRow){
        this.advertProductModel.productName = selectRow.productName;
        this.advertProductModel.picUrl = selectRow.picUrl;
        this.advertProductModel.productId = selectRow.id;
        this.advertProductModel.price = selectRow.minPrice;
        this.productDialogVisible = false;

      }
    }
  }
</script>

<style scoped>

</style>
