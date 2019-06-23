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
      <el-form-item style="text-align: center">
        <el-button type="primary" size="medium" @click="handleNext('productInfoForm')">下一步，填写商品属性</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

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
      }
    }
  }
</script>

<style scoped>
</style>
