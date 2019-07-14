<template>
  <div style="margin-top: 50px">
    <el-form :model="value" :rules="rules" ref="productInfoForm" label-width="120px" style="width: 600px" size="small">
      <el-form-item label="商品名称："  prop="productName">
        <el-input v-model="value.productName"></el-input>
      </el-form-item>
      <el-form-item label="商品介绍：" prop="detail">
        <el-input
          :autoSize="true"
          v-model="value.detail"
          type="textarea"
          placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="商品最低售价：" prop="priceMin">
        <el-input v-model="value.priceMin" type="number" ></el-input>
      </el-form-item>
      <el-form-item label="计量单位：" prop="unit">
        <el-input v-model="value.unit" ></el-input>
      </el-form-item>
      <el-form-item label="排序：">
        <el-input v-model="value.sort"></el-input>
      </el-form-item>
      <el-form-item label="商品图片：">
        <el-upload
          ref="upload"
          action="/productController/upload.do"
          name="picture"
          list-type="picture-card"
          :headers="authorization"
          :limit="5"
          :file-list="picFileList"
          :on-exceed="onExceed"
          :before-upload="beforeUpload"
          :on-preview="handlePreview"
          :on-success="handleSuccess"
          :on-remove="handleRemove">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button type="primary" size="medium" @click="handleNext('productInfoForm')">下一步，填写商品属性</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

  import {deletePic} from '@/mall-api/product';
  export default {
    name: "ProductInfoDetail",
    props: {
      value: Object,
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        authorization:{},
        //文件上传的参数
        dialogImageUrl: '',
        dialogVisible: false,
        picFileList: [],
        rules: {
          productName: [
            {required: true, message: '请输入商品名称', trigger: 'blur'},
            {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
          ],
          detail: [{required: true, message: '请输入商品介绍', trigger: 'blur'}],
          priceMin: [{required: true, message: '请输入商品最低价', trigger: 'blur'}],
          unit: [{required: true, message: '请选择商品计量单位', trigger: 'blur'}]
        }
      };
    },
    methods: {
      //下一步
      handleNext(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$emit('nextStep');
          } else {
            this.$message({
              message: '验证失败',
              type: 'error',
              duration:1000
            });
            return false;
          }
        });
      },

    //文件上传成功的钩子函数
    handleSuccess(res, file) {
      this.$message({
        type: 'info',
        message: '图片上传成功',
        duration: 6000
      });
      if ('success' == file.status) {
        this.value.picUrlArray.push(file.response.data); //将返回的文件储存路径赋值picture字段
      }
    },
    //删除文件之前的钩子函数
    handleRemove(file, picFileList) {
      if(file.response){
        // deletePic(file.response.data);
        this.value.picUrlArray.remove(file.response.data);
      }else{
        // deletePic(file.url);
        this.value.picUrlArray.remove(file.url);
      }

    },
    //点击列表中已上传的文件事的钩子函数
    handlePreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //上传的文件个数超出设定时触发的函数
    onExceed(files, picFileList) {
      this.$message({
        type: 'info',
        message: '最多只能上传一个图片',
        duration: 6000
      });
    },
    //文件上传前的前的钩子函数
    //参数是上传的文件，若返回false，或返回Primary且被reject，则停止上传
    beforeUpload(file) {
      this.authorization.Authorization=this.$store.getters.token;
      const isJPG = file.type === 'image/jpeg';
      const isGIF = file.type === 'image/gif';
      const isPNG = file.type === 'image/png';
      const isBMP = file.type === 'image/bmp';
      const isLt2M = file.size / 1024 / 1024 < 1;

      if (!isJPG && !isGIF && !isPNG && !isBMP) {
        this.$message.error('上传图片必须是JPG/GIF/PNG/BMP 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 1MB!');
      }
      return (isJPG || isBMP || isGIF || isPNG) && isLt2M;
    },
    setPicFileList(productParam){
      if(this.isEdit && productParam.picUrlArray){
        let picUrlArray = productParam.picUrlArray;
        for (let i = 0; i< picUrlArray.length; i++) {
          let picFile={};
          picFile.name = picUrlArray[i];
          picFile.url = picUrlArray[i];
          this.picFileList.push(picFile);
        }
      }
    },
  },
}
</script>

<style scoped>
</style>
