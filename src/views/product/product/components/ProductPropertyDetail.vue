<template>
  <div style="margin-top: 50px">
    <el-form :model="value" ref="productPropertyForm" :rules="rules" label-width="120px" style="width: 720px" size="small">
      <el-form-item label="商品分类：" prop="productTypeId">
        <el-cascader
          clearable
          v-model="selectProductTypeValue"
          :disabled="disabled"
          :options="productTypeOptions">
        </el-cascader>
      </el-form-item>
      <el-form-item :label="property.name+'：'" v-if="productPropertyIsSale && productPropertyIsSale.length != 0"
                    v-for=" ( property ,index) in productPropertyIsSale" :key="'isSale-'+index">
        <el-checkbox-group v-model="value.productPropertyIsSaleChecked" >
          <el-checkbox v-for="propertyName in productPropertyIsSaleChecked" :label="propertyName" :key="propertyName" v-if="propertyName.indexOf(property.name+':') != -1 "></el-checkbox>
        </el-checkbox-group>
        <br/>
        <el-input
          style="width: 60%"
          placeholder="添加销售属性"
          v-model="propertyNameAddIsSale[index]"
          @input="verifypropertyName(index)"
          clearable>
        </el-input>
        <el-button style="margin-left: 20px" @click="addPropertyNameIsSale(property ,index)">添加</el-button>
      </el-form-item>
      <el-form-item :label="property.name+'：'" v-if="productPropertyNotSale && productPropertyNotSale.length != 0"
                    v-for=" ( property ,index)  in productPropertyNotSale" :key="'notSale-'+index">
        <el-input style="width: 80%" v-model="value.productPropertyNotSaleChecked[index]"  placeholder="填写参数值"></el-input>
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button size="medium" @click="handlePrev('productPropertyForm')">上一步，填写商品信息</el-button>
        <el-button type="primary" size="medium" @click="handleFinishCommit" :disabled="updateAuthority">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import SingleUpload from '@/components/Upload/singleUpload'
  import {getProductTypeCascader, getProductTypeProperty} from '@/mall-api/productType'
  import auth from '@/utils/auth'

  export default {
    name: "ProductPropertyDetail",
    components: {SingleUpload},
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
        disabled:false,
        productTypeId:'',
        selectProductTypeValue: [],
        productTypeOptions: [],
        propertyNameAddIsSale:[],
        productPropertyIsSale : [],
        productPropertyNotSale : [],
        productPropertyIsSaleChecked : [],
        productPropertyNotSaleChecked : [],
        addAuthority:true,
        updateAuthority:true,
        deleteAuthority:true,
      }
    },
    watch: {
      selectProductTypeValue: function (newValue) {
        if(newValue.length != 2){
          this.value.productTypeId = null;
          this.productTypeId = null;
          this.$message({
            message: '只能选择第二级分类信息',
            type: 'error',
            duration:1000
          });
          return false;
        }
        this.value.productTypeId = newValue[1];
        this.productTypeId = newValue[1];
        this.handleGetProductTypeProperty();
      }
    },
    created() {
      this.getProductTypeList();
      this.checkButtonAuthority();
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
      //获取分类属性
      handleGetProductTypeProperty(){
        getProductTypeProperty(this.productTypeId).then(response => {
          if(response.data.productPropertyIsSale){
            this.productPropertyIsSale = response.data.productPropertyIsSale;
          }
          if(response.data.productPropertyNotSale){
            this.productPropertyNotSale = response.data.productPropertyNotSale;
          }
        });
      },
      //添加属性值
      addPropertyNameIsSale(property ,index){
        if(this.productPropertyIsSaleChecked.indexOf(property.name+':'+this.propertyNameAddIsSale[index])> -1){
          return;
        }
        // this.productPropertyIsSale[index.vue].value.push(this.propertyNameAddIsSale[index.vue]);
        this.$set(this.productPropertyIsSaleChecked,this.productPropertyIsSaleChecked.length,property.name+':'+this.propertyNameAddIsSale[index])
      },
      //上一步
      handlePrev(productPropertyForm){
        this.$refs[productPropertyForm].validate((valid) => {
          if (valid) {
            this.$emit('prevStep');
          } else {
            this.$message({
              message: '验证失败',
              type: 'error',
              duration:1000
            });
            return false;
          }
        });
      },
      handleFinishCommit(){
        this.$emit('finishCommit',this.isEdit);
      },
      //修改时设置数据
      setEditData(value){
        if(this.isEdit){
          this.productTypeId = value.productTypeId;
          this.selectProductTypeValue.push(value.productTypeParentId.toString());
          this.selectProductTypeValue.push(value.productTypeId.toString());
          this.productPropertyIsSaleChecked = value.productPropertyIsSaleChecked;
          this.productPropertyNotSaleChecked = value.productPropertyNotSaleChecked;
          this.disabled = true;
          this.getProductTypeList();
        }
      },
      //属性值不能输入非法字符
      verifypropertyName(index){
        // this.propertyNameAddIsSale[index.vue]=this.propertyNameAddIsSale[index.vue].replace(/[`~!@#$%^&*()_\-+=<>?:"{}|,./;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/g, '').replace(/\s/g, "");
        //属性值不能输：：号
        this.propertyNameAddIsSale[index]=this.propertyNameAddIsSale[index].replace(/[`:：]/g, '').replace(/\s/g, "");
        return this.propertyNameAddIsSale[index];
      },
      //验证按钮权限
      checkButtonAuthority(){
        let buttonCodeList = this.$store.getters.buttonList;
        let role = this.$store.getters.role;
        let thisMenuCode = this.$route.query.code;
        if(auth.adminRole.indexOf(role) != -1){
          this.addAuthority = false;
          this.updateAuthority = false;
          this.deleteAuthority = false;
        }
        if(buttonCodeList.indexOf(thisMenuCode+auth.ADD_CODE) != -1){
          this.addAuthority = false;
        }
        if(buttonCodeList.indexOf(thisMenuCode+auth.UPDATE_CODE) != -1){
          this.updateAuthority = false;
        }
        if(buttonCodeList.indexOf(thisMenuCode+auth.DELETE_CODE) != -1){
          this.deleteAuthority = false;
        }
      },
    }
  }
</script>

<style scoped>

</style>
