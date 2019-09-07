<template>
  <el-card class="form-container" shadow="never">
    <el-form :model="productType"
             :rules="rules"
             ref="productTypeForm"
             label-width="150px">
      <el-form-item label="分类名称：" prop="typeName">
        <el-input v-model="productType.typeName"></el-input>
      </el-form-item>
      <el-form-item label="上级分类：">
        <el-select v-model="productType.parentId"
                   filterable
                   remote
                   :remote-method="remoteMethod"
                   :loading="loading"
                   @change = "parentIdChange"
                   placeholder="请选择分类">
          <el-option
            v-for="item in selectProductTypeList"
            :key="item.id"
            :label="item.typeName"
            :value="item.typeId">
          </el-option>
        </el-select>
      </el-form-item>
      <!--<el-form-item label="销售属性名：" v-if="propertyNamesIsSale.length != 0 && parentId != 0">
         <el-checkbox-group v-model="productType.propertyNameCheckedIsSale" >
           <el-checkbox v-for="propertyName in propertyNamesIsSale" :label="propertyName" :key="propertyName">{{propertyName}}</el-checkbox>
         </el-checkbox-group>
       </el-form-item>
       <el-form-item  label="添加销售属性：" v-if="parentId != 0">
           <el-input
             style="width: 60%"
             placeholder="添加销售属性"
             v-model="propertyNameAddIsSale"
             clearable>
           </el-input>
           <el-button style="margin-left: 20px" @click="addPropertyNameIsSale()">添加</el-button>
       </el-form-item>
       <el-form-item label="显示参数名：" v-if="propertyNamesNotSale.length != 0 && parentId != 0">
         <el-checkbox-group v-model="productType.propertyNameCheckedNotSale" >
           <el-checkbox v-for="propertyName in propertyNamesNotSale" :label="propertyName" :key="propertyName">{{propertyName}}</el-checkbox>
         </el-checkbox-group>
       </el-form-item>
       <el-form-item  label="添加显示参数：" v-if="parentId != 0">
         <el-input
           style="width: 60%"
           placeholder="添加显示参数"
           v-model="propertyNameAddNotSale"
           clearable>
         </el-input>
         <el-button style="margin-left: 20px" @click="addPropertyNameNotSale()">添加</el-button>
       </el-form-item>-->
      <el-form-item label="排序：">
        <el-input v-model="productType.sort" type="number" min="1" placeholder="默认999"></el-input>
      </el-form-item>
      <el-form-item label="状态：">
        <el-radio-group v-model="productType.isUsable">
          <el-radio label="0">正常</el-radio>
          <el-radio label="1">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否显示在导航栏：">
        <el-radio-group v-model="productType.isNavigationBar">
          <el-radio label="0">是</el-radio>
          <el-radio label="1">否</el-radio>
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
  import {getList, createProductType, updateProductType, getProductType} from '@/mall-api/productType';
  import SingleUpload from '@/components/Upload/singleUpload';

  const defaultProductType = {
    parentId : 0,
    isUsable : "0",
    isNavigationBar : "0",
    // propertyNameCheckedIsSale:[],
    // propertyNameCheckedNotSale:[]
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
        productTypeForm:{},
        parentId : 0,
        // propertyNameAddIsSale:null,
        // propertyNameAddNotSale:null,
        // propertyNamesIsSale:[],
        // propertyNamesNotSale:[],
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
      if (this.isEdit) {
        getProductType(this.$route.query.typeId).then(response => {
          this.productType = response.data;
          this.parentId = response.data.parentId;
          // this.propertyNamesIsSale = response.data.propertyNameCheckedIsSale;
          // this.propertyNamesNotSale = response.data.propertyNameCheckedNotSale;
        });
      } else {
        this.productType = Object.assign({}, defaultProductType);
      }
      this.getSelectProductTypeList();
    },
    methods: {
      //类目下拉框远程搜索方法
      remoteMethod(query) {
        console.info(query);
        this.loading = true;
        this.selectProductTypeList=[];
        var page = this;
        getList(0, {typeName:query}).then(response => {
          page.selectProductTypeList = response.data.list;
          page.selectProductTypeList.unshift({typeId: 0, typeName: '无上级分类'});
          this.loading = false;
        });
      },
      //点击类目时修改parentId
      parentIdChange(parentId){
        this.parentId = parentId;
      },
     /*//添加销售属性名
      addPropertyNameIsSale(){
        if(this.propertyNamesIsSale.indexOf(this.propertyNameAddIsSale)> -1){
          return;
        }
        this.propertyNamesIsSale.push(this.propertyNameAddIsSale);
      },
      //添加非销售属性名
      addPropertyNameNotSale(){
        if(this.propertyNamesNotSale.indexOf(this.propertyNameAddNotSale)> -1){
          return;
        }
        this.propertyNamesNotSale.push(this.propertyNameAddNotSale);
      },*/
      //获取类目信息列表
      getSelectProductTypeList() {
        this.selectProductTypeList=[];
        var page = this;
        console.info("获取类目信息！")
        getList(0, {}).then(response => {
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
              console.info(this.productType);
              if (this.isEdit) {
                updateProductType(this.$route.query.typeId, this.productType).then(response => {
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
        this.parentId = 0;
        // this.propertyNamesIsSale = [];
        // this.propertyNamesNotSale = [];
        this.getSelectProductTypeList();

      },
    }
  }
</script>

<style scoped>

</style>
