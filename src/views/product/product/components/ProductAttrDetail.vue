<template>
  <div style="margin-top: 50px">
    <el-form :model="value" ref="productAttrForm" :rules="rules" label-width="120px" style="width: 720px" size="small">
      <el-form-item label="商品分类：" prop="productTypeId">
        <el-cascader
          clearable
          v-model="selectProductTypeValue"
          :disabled="disabled"
          :options="productTypeOptions">
        </el-cascader>
      </el-form-item>
      <el-form-item v-for="(attrName,index) in attrNameList"
                    :key="attrName.id"
                    :value="attrName.id"
                    :label="attrName.name+'：'">
        <template>
          <el-input placeholder="请输入" :change="handleInputChange(attrValueList[index], attrName)" v-model="attrValueList[index]"  v-if="attrName.inputType===1" ></el-input>
        </template>
        <template>
          <el-select multiple placeholder="请选择" :change="handleSelectChange(attrValueList[index], attrName)" v-model="attrValueList[index]"  v-if="attrName.inputType===2 && attrName.inputList.length > 0" >
            <el-option
              v-for="(item, index) in attrName.inputList"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </template>
        <template>
          <el-select placeholder="请选择" :change="handleSelectChange(attrValueList[index], attrName)"  v-model="attrValueList[index]"  v-if="attrName.inputType===3 && attrName.inputList.length > 0" >
            <el-option
              v-for="(item, index) in attrName.inputList"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </template>
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button size="medium" @click="handlePrev('productAttrForm')">上一步，填写商品信息</el-button>
        <el-button type="primary" size="medium" @click="handleFinishCommit" :disabled="updateAuthority">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {getProductTypeCascader} from '@/mall-api/product/productType'
  import {getAttrByTypeId} from '@/mall-api/product/productAttr'
  import auth from '@/utils/auth'

  export default {
    name: "ProductAttrDetail",
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
          productTypeId: [{required: true, message: '请选择商品类别', trigger: 'blur'}],
        },
        attrValueList:[],
        disabled: false,
        productTypeId: '',
        selectProductTypeValue: [],
        productTypeOptions: [],
        attrNameList: [],
        addAuthority: true,
        updateAuthority: true,
        deleteAuthority: true,
      }
    },
    watch: {
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
        this.attrValueList=[];
        this.handleGetProductTypeAttr();
      }
    },
    created() {
      this.getProductTypeList();
      this.checkButtonAuthority();
    },
    methods: {
      /** 获取下拉框option*/
      getParamInputList(param){
        let result = [];
        for (let i = 0; i < param.length; i++) {
          result.push({label: param[i].label, value: param[i].value});
        }
        return result;
      },
      /**  inputType=1 手写 输入框值改变时*/
      handleInputChange(attrValueList, attrName){
        this.value.attrValueMap.set(attrName.id, attrValueList);
      },
      handleSelectChange(attrValueList, attrName){
        this.value.attrValueMap.set(attrName.id, attrValueList);
      },
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
      //获取分类属性
      handleGetProductTypeAttr() {
        let param = new URLSearchParams();
        param.append("typeId", this.productTypeId);
        getAttrByTypeId(param).then(response => {
          if (200 === response.code) {
            this.attrNameList = response.data;
          }
        });
      },
      //上一步
      handlePrev(productAttrForm) {
        this.$refs[productAttrForm].validate((valid) => {
          if (valid) {
            this.$emit('prevStep');
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
      handleFinishCommit() {
        this.$emit('finishCommit', this.isEdit);
      },
      //修改时设置数据
      setEditData(value) {
        if (this.isEdit) {
          this.productTypeId = value.productTypeId;
          this.selectProductTypeValue.push(value.productTypeParentId.toString());
          this.selectProductTypeValue.push(value.productTypeId.toString());
          this.disabled = true;
          this.getProductTypeList();
        }
      },
      //属性值不能输入非法字符
      verifyAttrName(index) {
        // this.AttrNameAddIsSale[index.vue]=this.AttrNameAddIsSale[index.vue].replace(/[`~!@#$%^&*()_\-+=<>?:"{}|,./;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/g, '').replace(/\s/g, "");
        //属性值不能输：：号
        this.AttrNameAddIsSale[index] = this.AttrNameAddIsSale[index].replace(/[`:：]/g, '').replace(/\s/g, "");
        return this.AttrNameAddIsSale[index];
      },
      //验证按钮权限
      checkButtonAuthority() {
        let buttonCodeList = this.$store.getters.buttonList;
        let role = this.$store.getters.role;
        let thisMenuCode = this.$route.query.code;
        if (auth.adminRole.indexOf(role) != -1) {
          this.addAuthority = false;
          this.updateAuthority = false;
          this.deleteAuthority = false;
        }
        if (buttonCodeList.indexOf(thisMenuCode + auth.ADD_CODE) != -1) {
          this.addAuthority = false;
        }
        if (buttonCodeList.indexOf(thisMenuCode + auth.UPDATE_CODE) != -1) {
          this.updateAuthority = false;
        }
        if (buttonCodeList.indexOf(thisMenuCode + auth.DELETE_CODE) != -1) {
          this.deleteAuthority = false;
        }
      },
    }
  }
</script>

<style scoped>

</style>
