<template>
  <el-card class="form-container" shadow="never">
    <el-form :model="productProperty"
             :rules="rules"
             ref="productPropertyForm"
             label-width="150px">
      <el-form-item label="属性名称：" prop="name">
        <el-input v-model="productProperty.name"></el-input>
      </el-form-item>
      <el-form-item label="商品分类：">
        <el-cascader
          clearable
          v-model="productProperty.typeIdValue"
          :options="productTypeOptions"
          @change="productTypeChange">
        </el-cascader>
      </el-form-item>
      <el-form-item label="是否销售属性：">
        <el-radio-group v-model="productProperty.isSale">
          <el-radio label="0">是</el-radio>
          <el-radio label="1">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否可用：">
      <el-radio-group v-model="productProperty.isShow">
        <el-radio label="0">是</el-radio>
        <el-radio label="1">否</el-radio>
      </el-radio-group>
    </el-form-item>
      <el-form-item label="是否显示：">
        <el-radio-group v-model="productProperty.isUsable">
          <el-radio label="0">是</el-radio>
          <el-radio label="1">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('productPropertyForm')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('productPropertyForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
  import {getProductProperty, updateProductProperty, createProductProperty} from '@/mall-api/productProperty';
  import SingleUpload from '@/components/Upload/singleUpload';
  import {getProductTypeCascader} from '@/mall-api/productType';

  const defaultProductProperty = {
    typeIdValue:[],
    typeId:null,
    name : "",
    isSale : "0",
    isShow : "0",
    isUsable : "0"
  };
  export default {
    name: "productPropertyDetail",
    components: {SingleUpload},
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        productTypeOptions: [],
        productPropertyForm:{},
        loading: false,
        productProperty: Object.assign({}, defaultProductProperty),
        rules: {
          name: [
            {required: true, message: '请输入属性名称', trigger: 'blur'},
            {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
          ]
        }
      }
    },
    created() {
      if (this.isEdit) {
        getProductProperty(this.$route.query.propertyNameId).then(response => {
          this.productProperty = response.data;
          this.productProperty.typeIdValue=[];
          this.productProperty.typeIdValue.push(response.data.parentId+'');
          this.productProperty.typeIdValue.push(response.data.typeId+'');
        });
      } else {
        this.productProperty = Object.assign({}, defaultProductProperty);
      }
      this.getProductTypeList();
      this.resetTypeId();
    },
    methods: {
      //获取商品分类列表
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
      //表单提交
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$confirm('是否提交数据', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              console.info(this.productProperty);
              if (this.isEdit) {
                updateProductProperty(this.$route.query.propertyNameId, this.productProperty).then(response => {
                  this.$message({
                    message: '修改成功',
                    type: 'success',
                    duration: 1000
                  });
                  this.$router.back();
                });
              } else {
                createProductProperty(this.productProperty).then(response => {
                  this.$refs[formName].resetFields();
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
        this.productProperty = Object.assign({}, defaultProductProperty);
      },
      //设置typeID
      resetTypeId(){
        if(this.$route.query.parentId != null){
          this.productProperty.typeIdValue=[];
          this.productProperty.typeIdValue.push(this.$route.query.parentId+'');
          this.productProperty.typeIdValue.push(this.$route.query.typeId+'');
          this.productProperty.typeId = this.$route.query.typeId;
        }
        this.listQuery={
          pageNum: 1,
          pageSize: 5
        }
      },
      productTypeChange(){
        if(this.productProperty.typeIdValue[1]){
          this.productProperty.typeId = this.productProperty.typeIdValue[1];
        }
      },
    }
  }
</script>

<style scoped>

</style>
