<template> 
  <div>
    <el-upload
      ref="upload"
      class="avatar-uploader"
      action="/common/oss/pic-upload"
      :headers="authorization"
      name="pictureUrl"
      :show-file-list="false"
      :before-upload="beforeUpload"
      :on-success="handleUploadSuccess"
    >
      <img v-if="imageUrl" :src="imageUrl" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
  </div>
</template>
<script>
  export default {
    name: 'singleUpload',
    props: {
      //图片属性数组
      picUrl:{
        type:String,
        default:""
      },
    },
    watch: {
      picUrl: function (newValue) {
        this.imageUrl = newValue;
      }
    },
    data() {
      return {
        imageUrl:"",
        authorization: {},
        dialogVisible: false,
        dialogImageUrl:null
      };
    },
    methods: {
      handleUploadSuccess(res, file) {
        this.$message({
          type: 'info',
          message: '图片上传成功',
          duration: 6000
        });
        if (200 === res.code) {
          this.imageUrl=file.response.data;
          this.$emit('imageUrlChange', this.imageUrl)
        }
      },
      //文件上传前的前的钩子函数
      //参数是上传的文件，若返回false，或返回Primary且被reject，则停止上传
      beforeUpload(file) {
        this.authorization.Authorization = this.$store.getters.token;
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
      //初始化修改数据
      initUpdateDate(value) {
        if (value) {
        }
      },
    }
  }
</script>
<style>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>


