<template>
  <el-card class="form-container" shadow="never">
    <el-form :model="advertModel"
             :rules="rules"
             ref="advertModelForm"
             label-width="150px">
      <el-form-item label="商品：" prop="title">
        <el-input v-model="advertModel.title"></el-input>
      </el-form-item>
      <el-form-item label="类型：" prop="type">
        <el-select
          v-model="advertModel.productName"
          filterable
          remote
          placeholder="请输入关键词"
          :remote-method="productOptions">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="图片">
        <Single-upload :picUrl="advertModel.picUrl" ref="picUrlSingleUpload" v-on:imageUrlChange="singleUploadSuccess"></Single-upload>
      </el-form-item>
      <el-form-item label="排序：" prop="phone" >
          <el-input v-model="advertModel.sort" type="number" min="1" placeholder="默认999" ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('advertModelForm')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('advertModelForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
  import {getPage} from '@/mall-api/product/product'
  import advertRequest from '@/mall-api/advert/advert-request.js';
  import SingleUpload from '@/components/Upload/singleUpload';

  const defaultAdvertModel = {
    id:null,
    title : null,
    skipUrl:null,
    picUrl : null,
    backColor: null,
    sort: 999,
  };
  export default {
    name: "advertDetail",
    components: {SingleUpload},
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        advertModel : Object.assign({}, defaultAdvertModel),
        dialogVisible:false,
        productOptions:[],
        rules: {
          title: [{
            required: true,
            message: '请输入标题',
            trigger: 'blur'
          }, {
            min: 4,
            max: 30,
            message: '长度在 4 到 30 个字符'
          }],
          type:[{
            required: true,
            message: '请选择类型',
            trigger: 'blur'
          }],
        }
      }
    },
    created() {
      advertRequest.getTypeEnumList().then(res => {
        this.typeOptions = res.data;
      });
      if (this.isEdit) {
        advertRequest.getAdvertInfo(this.$route.query.id).then(response => {
          this.advertModel = response.data;
        })
      }
    },
    methods: {
      remoteMethod(query){
        if(query != ''){
          let productParm ={ productName : query};
          getPage(productParm).then(res => {
            console.info(res);
          });
        }
      },
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$confirm('是否提交数据', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              if (this.isEdit) {
                advertRequest.modifyAdvert(this.advertModel).then(response => {
                  this.$message({
                    message: '修改成功',
                    type: 'success',
                    duration: 1000
                  });
                  this.$router.back();
                });
              } else {
                advertRequest.createAdvert(this.advertModel).then(response => {
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
        this.advertModel = Object.assign({}, defaultAdvertModel);
      },
      singleUploadSuccess(oldParam, newVal){
        this.advertModel.picUrl = newVal;
      }
    }
  }
</script>

<style scoped>

</style>
