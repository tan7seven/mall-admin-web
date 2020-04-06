<template> 
  <div>
    <el-upload
      ref="upload"
      v-model="value"
      action="/common/oss/pic-upload"
      :headers="authorization"
      name="pictureUrl"
      list-type="picture-card"
      :file-list="fileList"
      :limit="maxCount"
      :before-upload="beforeUpload"
      :on-remove="handleRemove"
      :on-success="handleUploadSuccess"
      :on-preview="handlePreview"
      :on-exceed="handleExceed"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>
<script>
  export default {
    name: 'multiUpload',
    props: {
      //图片属性数组
      value: Array,
      //最大上传图片数量
      maxCount:{
        type:Number,
        default:5
      }
    },
    data() {
      return {
        fileList:[],
        authorization: {},
        dialogVisible: false,
        dialogImageUrl:null
      };
    },
    methods: {
      handleRemove(file, fileList) {
        this.value.remove(file.response.data);
      },
      handlePreview(file) {
        this.dialogVisible = true;
        this.dialogImageUrl=file.url;
      },
      handleUploadSuccess(res, file) {
        this.$message({
          type: 'info',
          message: '图片上传成功',
          duration: 6000
        });
        if (200 === res.code) {
          this.value.push(file.response.data);
        }
      },
      //上传的文件个数超出设定时触发的函数
      handleExceed(files, fileList) {
        this.$message({
          message: '最多只能上传'+this.maxCount+'张图片',
          type: 'warning',
          duration:1000
        });
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
      //点击列表中已上传的文件事的钩子函数
      handlePreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
    }
  }
</script>
<style>

</style>


