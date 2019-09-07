<template>
  <el-card class="form-container" shadow="never">
    <el-form :model="menuModel"
             :rules="rules"
             ref="menuModelForm"
             label-width="150px">
      <el-form-item label="标题：" prop="menuTitle">
        <el-input v-model="menuModel.menuTitle"></el-input>
      </el-form-item>
      <el-form-item label="上级分类：" prop="parentId">
        <el-select v-model="menuModel.parentId"
                   filterable
                   remote
                   :remote-method="remoteMethod"
                   :loading="loading"
                   placeholder="请选择分类">
          <el-option
            v-for="item in parentOptions"
            :key="item.id"
            :label="item.menuTitle"
            :value="item.menuId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="菜单编码：" prop="menuCode">
          <el-input v-model="menuModel.menuCode" ></el-input>
      </el-form-item>
      <el-form-item label="菜单路径：" prop="menuUrl">
        <el-input v-model="menuModel.menuUrl" ></el-input>
      </el-form-item>
      <el-form-item label="菜单图标：" prop="menuIcon">
        <el-input v-model="menuModel.menuIcon" ></el-input>
      </el-form-item>
      <el-form-item label="是否显示：">
        <el-radio-group v-model="menuModel.isHidden">
          <el-radio label="0">是</el-radio>
          <el-radio label="1">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="按钮列表：" v-if="menuModel.parentId != 0">
        <el-checkbox-group v-model="buttonListSelect" >
          <el-checkbox v-for="buttonName in buttonList" :label="buttonName" :key="buttonName">{{buttonName}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item  label="添加按钮："  v-if="menuModel.parentId != 0">
        <el-select v-model="buttonPut"
                   filterable
                   :loading="loading"
                   placeholder="添加按钮">
          <el-option
            v-for="item in buttonOptions"
            :key="item.id"
            :label="item.buttonName"
            :value="item.buttonName">
          </el-option>
        </el-select>
        <el-button style="margin-left: 20px" @click="addButton()">添加</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('menuModelForm')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('menuModelForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
  import {getPage, updateMenu, createMenu, getMenuInfo, getMenuList} from '@/mall-api/system/menu'
  import SingleUpload from '@/components/Upload/singleUpload';
  import auth from '@/utils/auth';

  const defaultMenuModel = {
    menuId:null,
    menuIcon:null,
    menuTitle : null,
    parentId:null,
    parentTitle:null,
    menuCode : null,
    menuUrl : null,
    isHidden:"0",
    buttonList:[],
  };
  export default {
    name: "menuDetail",
    components: {SingleUpload},

    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        buttonListSelect:[],
        buttonOptions:[],
        buttonList:[],
        buttonPut:null,
        loading:false,
        parentOptions:[],
        menuModel : Object.assign({}, defaultMenuModel),
        rules: {
          menuCode: [{
            required: true,
            message: '请输入菜单编码',
            trigger: 'blur'
          }, {
            min: 3,
            max: 30,
            message: '长度在 3 到 30 个字符'
          }, {
            pattern: /^[0-9a-zA-Z_/:]{3,20}$/,
            message: '只能输入3-20个字母、数字、下划线'
          }],
          menuUrl: [{
            required: true,
            message: '请输入菜单编码',
            trigger: 'blur'
          }, {
            min: 3,
            max: 30,
            message: '长度在 3 到 30 个字符'
          }, {
            pattern: /^[0-9a-zA-Z_/:]{3,20}$/,
            message: '只能输入3-20个字母、数字、下划线'
          }],
          menuTitle:[{
            required: true,
            message: '请输入标题',
            trigger: 'blur'
          }],
          parentId:[{
            required: true,
            message: '请选择父级菜单',
            trigger: 'blur'
          }],
          menuIcon:[{
            required: true,
            message: '请填写菜单图标',
            trigger: 'blur'
          }],
        }
      }
    },
    created() {
      this.grtParentMenu();
      this.buttonOptions = auth.buttonList;
      if (this.isEdit) {
        getMenuInfo(this.$route.query.menuId).then(response => {
          this.menuModel = response.data;
          if(response.data.buttonList){
            this.buttonListSelect = response.data.buttonList;
            this.buttonList = response.data.buttonList;
          }
        })
      }
    },
    methods: {
      //父级菜单下拉框远程搜索方法
      remoteMethod(query) {
        this.loading = true;
        this.parentOptions=[];
        var page = this;
        getMenuList(0, {menuTitle:query}).then(response => {
          page.parentOptions = response.data?response.data:[];
          page.parentOptions.unshift({menuId: '0', menuTitle: '无上级分类'});
          this.loading = false;
        });
      },
      grtParentMenu(){
        getMenuList(0, {}).then(response => {
          this.parentOptions = response.data;
          this.parentOptions.unshift({menuId: '0', menuTitle: '无上级分类'});
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
              this.menuModel.buttonList = this.buttonListSelect;
              //一级菜单没有按钮
              if(this.menuModel.parentId == 0){
                this.menuModel.buttonList = [];
              }
              if (this.isEdit) {
                updateMenu(this.$route.query.menuId, this.menuModel).then(response => {
                  this.$message({
                    message: '修改成功',
                    type: 'success',
                    duration: 1000
                  });
                  this.$router.back();
                });
              } else {
                createMenu(this.menuModel).then(response => {
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
        this.menuModel = Object.assign({}, defaultMenuModel);
      },
      //添加按钮
      addButton(){
        if(this.buttonListSelect.indexOf(this.buttonPut) === -1){
          this.buttonListSelect.push(this.buttonPut);
        }
        if(this.buttonList.indexOf(this.buttonPut) === -1){
          this.buttonList.push(this.buttonPut);
        }
      },
    }
  }
</script>

<style scoped>

</style>
