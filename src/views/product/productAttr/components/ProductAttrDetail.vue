<template>
  <el-card class="form-container" shadow="never">
    <el-form :model="productAttr"
             :rules="rules"
             ref="productAttrForm"
             label-width="150px">
      <el-form-item label="属性名称：" prop="name">
        <el-input v-model="productAttr.name"></el-input>
      </el-form-item>
      <el-form-item label="属性分类：" prop="typeIdValue">
        <el-cascader
          clearable
          v-model="productAttr.typeIdValue"
          :options="attrTypeOptions"
          filterable
          :loading="loading"
          :remote-method="remoteAttrType"
          @change="productTypeChange">
        </el-cascader>
      </el-form-item>
      <el-form-item label="类型：">
        <el-radio-group v-model="productAttr.type">
          <el-radio :label=1>销售属性</el-radio>
          <el-radio :label=2>展示参数</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否可用：">
        <el-radio-group v-model="productAttr.usable">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否显示：">
        <el-radio-group v-model="productAttr.showed">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="输入方式：">
        <el-radio-group v-model="productAttr.inputType">
          <el-radio :label=1>手写</el-radio>
          <el-radio :label=2>单选</el-radio>
          <el-radio :label=3>多选</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="可输入数据：" v-if="productAttr.inputType==2 | productAttr.inputType == 3">
        <el-input type="textarea" v-model="productAttr.inputData"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('productAttrForm')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('productAttrForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
  import {getProductAttrDetail, updateProductAttr, createProductAttr, getAtteTypePage} from '@/mall-api/product/productAttr';

  const defaultProductAttr = {
    id:null,
    typeIdValue: [],
    typeId: null,
    name: "",
    usable: true,
    showed: true,
    type: 1,
    inputType:1,
    inputData:"",
  };
  export default {
    name: "productAttrDetail",
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        attrTypeOptions: [],
        productAttrForm: {},
        loading: false,
        productAttr: Object.assign({}, defaultProductAttr),
        rules: {
          name: [
            {required: true, message: '请输入属性名称', trigger: 'blur'},
            {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
          ],
          typeIdValue: [
            {required: true, message: '请选择类目', trigger: 'change'}
          ],
        }
      }
    },
    created() {
      if (this.isEdit) {
        getProductAttrDetail(this.$route.query.id).then(response => {
          this.productAttr = response.data;
          this.productAttr.typeIdValue = [];
          this.productAttr.typeIdValue.push(response.data.parentId + '');
          this.productAttr.typeIdValue.push(response.data.typeId + '');
        });
      } else {
        this.productAttr = Object.assign({}, defaultProductAttr);
      }
      this.getAttrTypeList();
      this.resetTypeId();
    },
    methods: {
      //获取商品分类列表
      getAttrTypeList() {
        let getParam = {};
        getAtteTypePage(getParam).then(response => {
          let list = response.data.records;
          this.attrTypeOptions = [];
          for (let i = 0; i < list.length; i++) {
            this.attrTypeOptions.push({label: list[i].name, value: list[i].id});
          }
        });
      },
      // 下拉款远程搜索
      remoteAttrType(query){
        if (query !== '') {
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
            let getParam = {name:query};
            getAtteTypePage(getParam).then(response => {
              let list = response.data.records;
              this.attrTypeOptions = [];
              for (let i = 0; i < list.length; i++) {
                this.attrTypeOptions.push({label: list[i].name, value: list[i].id});
              }
            });
          }, 200);
        } else {
          this.attrTypeOptions = [];
        }
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
              if (this.isEdit) {
                updateProductAttr(this.productAttr).then(response => {
                  this.$message({
                    message: '修改成功',
                    type: 'success',
                    duration: 1000
                  });
                  this.$router.back();
                });
              } else {
                createProductAttr(this.productAttr).then(response => {
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
        this.productAttr = Object.assign({}, defaultProductAttr);
      },
      //设置typeID
      resetTypeId() {
        if (this.$route.query.parentId != null) {
          this.productAttr.typeIdValue = [];
          this.productAttr.typeIdValue.push(this.$route.query.parentId + '');
          this.productAttr.typeIdValue.push(this.$route.query.typeId + '');
          this.productAttr.typeId = this.$route.query.typeId;
        }
        this.listQuery = {
          pageNum: 1,
          pageSize: 5
        }
      },
      productTypeChange() {
        if (this.productAttr.typeIdValue[1]) {
          this.productAttr.typeId = this.productAttr.typeIdValue[1];
        }
      },
    }
  }
</script>

<style scoped>

</style>
