<template>
  <div style="margin-top: 50px">
    <el-form :model="value" :rules="rules" ref="productInfoForm" label-width="120px" style="width: 600px" size="small">
      <el-form-item label="商品分类：" prop="productTypeId">
        <el-cascader
          clearable
          v-model="selectProductTypeValue"
          :options="productTypeOptions">
        </el-cascader>
      </el-form-item>
      <el-form-item label="商品名称：" prop="productName">
        <el-input v-model="value.productName"></el-input>
      </el-form-item>
      <el-form-item label="商品介绍：" prop="detail">
        <el-input
          :autoSize="true"
          v-model="value.detail"
          type="textarea"
          placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="计量单位：" prop="unit">
        <el-input v-model="value.unit"></el-input>
      </el-form-item>
      <el-form-item label="排序：">
        <el-input v-model="value.sort"></el-input>
      </el-form-item>
      <el-form-item label="商品主图：">
        <multi-upload :maxCount="1" v-model="picUrlList" ref="picUrlMultiUpload"></multi-upload>
      </el-form-item>
      <el-form-item label="商品轮播图：">
        <multi-upload :maxCount="5" v-model="picDetailList" ref="picDetailMultiUpload"></multi-upload>
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button type="primary" size="medium" @click="handleNext('productInfoForm')">下一步，填写商品属性</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

  import MultiUpload from '@/components/Upload/multiUpload'
  import {getProductTypeCascader} from '@/mall-api/product/productType'

  export default {
    name: "ProductInfoDetail",
    components:{MultiUpload},
    props: {
      value: Object,
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        selectProductTypeValue: [],
        productTypeOptions: [],
        picDetailList: [],
        picUrlList: [],
        rules: {
          productName: [
            {required: true, message: '请输入商品名称', trigger: 'blur'},
            {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
          ],
          detail: [{required: true, message: '请输入商品介绍', trigger: 'blur'}],
          unit: [{required: true, message: '请选择商品计量单位', trigger: 'blur'}]
        }
      };
    },
    created() {
      this.getProductTypeList();
    },
    watch:{
      picUrlList: function (newValue) {
        this.value.picUrl=newValue[0];
      },
      picDetailList: function (newValue) {
        this.value.picList=newValue;
      },
      selectProductTypeValue: function (newValue) {
        if (newValue.length != 2) {
          this.value.productTypeId = null;
          this.productTypeId = null;
          this.$message({
            message: '只能选择第二级分类信息',
            type: 'error',
            duration: 1000
          });
          return false;
        }
        this.value.productTypeId = newValue[1];
        this.productTypeId = newValue[1];
      },
    },
    methods: {
      //获取分类信息
      getProductTypeList() {
        getProductTypeCascader().then(response => {
          let list = response.data;
          this.productTypeOptions = [];
          for (let i = 0; i < list.length; i++) {
            let children = [];
            if (list[i].children != null && list[i].children.length > 0) {
              for (let j = 0; j < list[i].children.length; j++) {
                children.push({label: list[i].children[j].label, value: list[i].children[j].value});
              }
            }
            this.productTypeOptions.push({label: list[i].label, value: list[i].value, children: children});
          }
        });
      },
      //下一步
      handleNext(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$emit('nextStep');
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
      //修改时设置数据
      initUpdateDate(value) {
        if (this.isEdit) {
          this.picUrlList.push(value.picUrl);
          this.picDetailList = value.picList;
          this.selectProductTypeValue.push(value.productTypeParentId.toString());
          this.selectProductTypeValue.push(value.productTypeId.toString());
          this.getProductTypeList();
          this.$refs.picUrlMultiUpload.initUpdateDate(this.picUrlList)
          this.$refs.picDetailMultiUpload.initUpdateDate(this.picDetailList)
        }
      },
    }
  }
</script>

<style scoped>
</style>
