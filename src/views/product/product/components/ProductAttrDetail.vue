<template>
  <div style="margin-top: 50px">
    <el-form :model="value" ref="productAttrForm" :rules="rules" label-width="120px" style="width: 720px" size="small">
      <el-form-item label="属性分类：" prop="attrTypeId">
        <el-cascader
          clearable
          v-model="selectAttrTypeValue"
          :disabled="disabled"
          :options="attrTypeOptions">
        </el-cascader>
      </el-form-item>
      <el-form-item v-for="(attrName,index) in attrNameList"
                    :key="attrName.id"
                    :value="attrName.id"
                    :label="attrName.name+'：'">
        <template>
          <el-select multiple placeholder="请选择" :change="handleSelectChange(attrValueList[index], attrName)" v-model="attrValueList[index]"  v-if="attrName.inputType===3 && attrName.inputList.length > 0" >
            <el-option
              v-for="(item) in attrName.inputList"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </template>
        <template>
          <el-select placeholder="请选择" :change="handleSelectChange(attrValueList[index], attrName)"  v-model="attrValueList[index]"  v-if="attrName.inputType===2 && attrName.inputList.length > 0" >
            <el-option
              v-for="(item) in attrName.inputList"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </template>
        <template>
          <el-input placeholder="请输入" :change="handleInputChange(attrValueList[index], attrName)" v-model="attrValueList[index]"  v-if="attrName.inputType===1" ></el-input>
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
  import {getAttrByTypeId, getAtteTypePage} from '@/mall-api/product/productAttr'
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
          attrTypeId: [{required: true, message: '请选择属性类别', trigger: 'blur'}],
        },
        disabled: false,
        attrTypeId: '',
        selectAttrTypeValue: [],
        attrTypeOptions: [],
        attrNameList: [],
        attrValueList:[],
        addAuthority: true,
        updateAuthority: true,
        deleteAuthority: true,
      }
    },
    watch: {
      selectAttrTypeValue: function (newValue) {
        this.value.attrTypeId = newValue[0];
        this.attrTypeId = newValue[0];
        this.attrValueList=[];
        this.handleGetProductTypeAttr();
      }
    },
    created() {
      this.getAttrTypeList();
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
        let attrValueObj = {};
        if(this.value.attrValueMap.has(attrName.id)){
          attrValueObj = this.value.attrValueMap.get(attrName.id);
          attrValueObj.value = attrValueList;
        }else{
          attrValueObj.value = attrValueList;
        }
        this.value.attrValueMap.set(attrName.id, attrValueObj);
      },
      handleSelectChange(attrValueList, attrName){
        let attrValueObj = {};
        if(this.value.attrValueMap.has(attrName.id)){
          attrValueObj = this.value.attrValueMap.get(attrName.id);
          attrValueObj.value = attrValueList;
        }else{
          attrValueObj.value = attrValueList;
        }
        this.value.attrValueMap.set(attrName.id, attrValueObj);
      },
      //获取分类信息
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
      //获取分类属性
      handleGetProductTypeAttr() {
        let param = new URLSearchParams();
        param.append("typeId", this.attrTypeId);
        getAttrByTypeId(param).then(response => {
          if (200 === response.code) {
            this.attrNameList = response.data;
          }
          // 设置商品属性值
          if(this.value.attrValueVOList){
            // attrValueList初始化
            let attrNameList = this.attrNameList;
            let attrValueVOList = this.value.attrValueVOList;
            for (let i = 0; i < attrNameList.length; i++) {
              for (let j = 0; j < attrValueVOList.length; j++) {
                if(attrValueVOList[j].nameId == attrNameList[i].id){
                  this.attrValueList[i] = attrValueVOList[j].value
                }
              }
            }
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
      initUpdateDate(value) {
        if (this.isEdit) {
          // 设置类目信息
          this.attrTypeId = value.attrTypeId;
          this.disabled = true;
          this.getAttrTypeList();
          this.selectAttrTypeValue.push(value.attrTypeId);
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
