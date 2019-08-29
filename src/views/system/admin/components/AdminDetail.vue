<template>
  <el-card class="form-container" shadow="never">
    <el-form :model="adminModel"
             :rules="rules"
             ref="adminModelForm"
             label-width="150px">
      <el-form-item label="登录账号：" prop="loginCode">
        <el-input v-model="adminModel.loginCode"></el-input>
      </el-form-item>
      <el-form-item label="姓名：" prop="name">
        <el-input v-model="adminModel.name"></el-input>
      </el-form-item>
      <el-form-item label="头像：">
        <el-upload
          ref="upload"
          action="/commonController/upload.do"
          name="picture"
          list-type="picture-card"
          :headers="authorization"
          :limit="1"
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
      <el-form-item label="电话号码：" prop="phone">
          <el-input v-model="adminModel.phone" ></el-input>
      </el-form-item>
      <el-form-item label="是否可用：">
        <el-radio-group v-model="adminModel.isUsable">
          <el-radio label="0">是</el-radio>
          <el-radio label="1">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('adminModelForm')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('adminModelForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
  import {getPage, updateAdmin, createAdmin, getAdminInfo} from '@/mall-api/system/admin'
  import SingleUpload from '@/components/Upload/singleUpload';

  const defaultAdminModel = {
    loginCode : null,
    picUrl:null,
    name : null,
    phone : null,
    isUsable:"0",
  };
  export default {
    name: "adminDetail",
    components: {SingleUpload},
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        adminModel : Object.assign({}, defaultAdminModel),
        authorization:{},
        dialogImageUrl:"",
        picFileList: [],
        dialogVisible:false,
        rules: {
          loginCode: [{
            required: true,
            message: '请输入登录账号',
            trigger: 'blur'
          }, {
            min: 4,
            max: 30,
            message: '长度在 4 到 30 个字符'
          }, {
            pattern: /^(\w){4,20}$/,
            message: '只能输入4-20个字母、数字、下划线'
          }],
          name:[{
            required: true,
            message: '请输入姓名',
            trigger: 'blur'
          }],
          phone:[{
            required: true,
            message: '请输入手机号码',
            trigger: 'blur'
          },{validator:function(rule,value,callback){
                if(/^1[345789]\d{9}$/.test(value) == false){
                  callback(new Error("请输入正确的手机号"));
                }else{
                  callback();
                }
              }, trigger: 'blur'}
          ],
        }
      }
    },
    created() {
      if (this.isEdit) {
        getAdminInfo(this.$route.query.userId).then(response => {
          this.adminModel = response.data;
          this.setPicFileList();
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
                updateAdmin(this.$route.query.userId, this.adminModel).then(response => {
                  this.$message({
                    message: '修改成功',
                    type: 'success',
                    duration: 1000
                  });
                  this.$router.back();
                });
              } else {
                createAdmin(this.adminModel).then(response => {
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
        this.adminModel = Object.assign({}, defaultAdminModel);
      },
      //文件上传成功的钩子函数
      handleSuccess(res, file) {
        this.$message({
          type: 'info',
          message: '图片上传成功',
          duration: 6000
        });
        if ('success' == file.status) {
          this.adminModel.picUrl=file.response.data; //将返回的文件储存路径赋值picture字段
        }
      },
      //删除文件之前的钩子函数
      handleRemove(file, picFileList) {
        this.adminModel.picUrl="";
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
      setPicFileList(){
        if(this.isEdit && this.adminModel.picUrl){
          let picFile={};
          picFile.name = this.adminModel.picUrl;
          picFile.url = this.adminModel.picUrl;
          this.picFileList.push(picFile);
        }
      },
    }
  }
</script>

<style scoped>

</style>
