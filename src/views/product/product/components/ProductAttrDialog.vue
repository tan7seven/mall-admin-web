<template>
  <div style="margin-top: 50px">
    <el-dialog title="商品SKU" :visible.sync="dialogTVisible" @open="handleDialogOpen()">
        <el-table :data="tableList">
            <el-table-column label="SKU属性" width="300" align="center" >
                <template  slot-scope="scope">
                    <el-select placeholder="请选择" 
                    v-for="(attrValue,index) in scope.row.attrValueList"
                    v-model="scope.row.attrValueList[index].skuValue" 
                    :key="attrValue.id">
                        <el-option
                        v-for="(item) in attrValue.valueList"
                        :key="item"
                        :label="item"
                        :value="item">
                        </el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column label="销售价" width="100" align="center">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.salePrice"></el-input>
                </template>
            </el-table-column>
            <el-table-column label="成本价" width="100" align="center">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.costPrice"></el-input>
                </template>
            </el-table-column>
            <el-table-column label="库存" width="100" align="center">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.stock"></el-input>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="200" align="center">
              <template slot-scope="scope">
                  <el-button
                    type="danger"
                    @click="handleDelete(scope.$index, scope.row)">删除
                  </el-button>
              </template>
            </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleAddTableColum">添 加</el-button>
          <el-button @click="dialogTVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleEditSkuConfirm">保 存</el-button>
        </span>
        
    </el-dialog>
  </div>
</template>

<script>
  import {getAttrByProductId} from '@/mall-api/product/productAttr';
  import {createProductSku} from '@/mall-api/product/productSku';

  const defaultList = {
      attrValueList: [],
      salePrice: 0,
      costPrice: 0,
      stock: 100,
    };
  export default {
    name: "ProductAttrDialog",
    props: {
      productId:String,
      dialogTableVisible: {
        type: Boolean,
        default: false
      }
    },
    computed:{
        dialogTVisible:{
            get:function(){
                return this.dialogTableVisible;
            },
            set:function(newValue){
               this.$emit("on-change-visible", newValue);
            }
        }
    },
    data() {
      return {
         tableList:[],
      }
    },
    created() {
    },
    methods: {
       handleDelete(index, row){
          this.tableList.remove(row);
       },
       handleAddTableColum(){
          let newColum = {
                          attrValueList: [
                          ],
                          salePrice: 0,
                          costPrice: 0,
                          stock: 100,
                        };
          let getParam = {productId:this.productId};
          getAttrByProductId(getParam).then(response => {
            newColum.attrValueList = response.data;
          });
         this.tableList.push(newColum);
       },
       handleEditSkuConfirm(){
        this.$confirm('请确认?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let param = {
            'param':this.tableList,
            'productId':this.productId
            }
          createProductSku(param).then(response=>{
            this.$message({
              message: '创建成功',
              type: 'success',
              duration: 1000
            });
          });
        });
        
       },
       handleDialogOpen(){
       },
    }
  }
</script>

<style scoped>

</style>
