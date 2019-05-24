<template>
  <el-card class="form-container" shadow="never">
    <el-form :model="productType"
             :rules="rules"
             ref="productTypeForm"
             label-width="150px">
      <el-form-item label="分类名称：" prop="name">
        <el-input v-model="productType.typeName"></el-input>
      </el-form-item>
      <el-form-item label="上级分类：">
        <el-select v-model="productType.parentId"
                   filterable
                   remote
                   :remote-method="remoteMethod"
                   :loading="loading"
                   placeholder="请选择分类">
          <el-option
            v-for="item in selectProductTypeList"
            :key="item.id"
            :label="item.typeName"
            :value="item.typeId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="排序：">
        <el-input v-model="productType.sort" type="number" min="1" placeholder="默认999"></el-input>
      </el-form-item>
      <el-form-item label="状态：">
        <el-radio-group v-model="productType.status">
          <el-radio :label="0">正常</el-radio>
          <el-radio :label="1">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否显示在导航栏：">
        <el-radio-group v-model="productType.isNavigationBar">
          <el-radio :label="0">是</el-radio>
          <el-radio :label="1">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('productTypeForm')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('productTypeForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
  import {getList, createProductType, updateProductType} from '@/mall-api/productType';
  import SingleUpload from '@/components/Upload/singleUpload';

  const defaultProductType = {
    parentId : 0,
    status : 0,
    isNavigationBar : 0,
  };
  export default {
    name: "productTypeDetail",
    components: {SingleUpload},
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        loading: false,
        productType: Object.assign({}, defaultProductType),
        selectProductTypeList: [],
        rules: {
          typeName: [
            {required: true, message: '请输入品牌名称', trigger: 'blur'},
            {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
          ]
        }
      }
    },
    created() {
      this.getSelectProductTypeList();
    },
    methods: {
      remoteMethod(query) {
        console.info(query);
        this.loading = true;
        this.selectProductTypeList=[];
        var page = this;
        getList(0, {pageSize: 10, pageNum: 0,typeName:query}).then(response => {
          page.selectProductTypeList = response.data.list;
          page.selectProductTypeList.unshift({typeId: 0, typeName: '无上级分类'});
          this.loading = false;
        });
      },
      getSelectProductTypeList() {
        this.selectProductTypeList=[];
        var page = this;
        console.info("获取类目信息！")
        getList(0, {pageSize: 10, pageNum: 0}).then(response => {
          page.selectProductTypeList = response.data.list;
          page.selectProductTypeList.unshift({typeId: 0, typeName: '无上级分类'});
        });
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
                updateProductType(this.$route.query.id, this.productType).then(response => {
                  this.$message({
                    message: '修改成功',
                    type: 'success',
                    duration: 1000
                  });
                  this.$router.back();
                });
              } else {
                createProductType(this.productType).then(response => {
                  this.$refs[formName].resetFields();
                  this.resetForm(formName);
                  this.$message({
                    message: '提交成功',
                    type: 'success',
                    duration: 1000
                  });
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
        this.productType = Object.assign({}, defaultProductType);
        this.getSelectProductTypeList();

      },
    }
  }
</script>

<style scoped>

</style>
