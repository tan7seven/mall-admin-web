<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float: right"
          @click="handleSearchList()"
          type="primary"
          size="small">
          查询结果
        </el-button>
        <el-button
          style="float: right;margin-right: 15px"
          @click="handleResetSearch()"
          size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="商品名称：">
            <el-input style="width: 203px" v-model="listQuery.productName" placeholder="商品名称"></el-input>
          </el-form-item>

          <el-form-item label="商品分类：">
            <el-cascader style="width: 203px"
              clearable
              v-model="selectProductTypeValue"
              :options="productTypeOptions">
            </el-cascader>
          </el-form-item>
          <el-form-item label="上架状态：">
            <el-select style="width: 203px" v-model="listQuery.isPutaway" placeholder="全部" clearable>
              <el-option
                v-for="item in isPutawayOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button
        class="btn-add"
        @click="handleAddProduct()"
        size="mini"
        :disabled="addAuthority">
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="productTable"
                :data="list"
                style="width: 100%"
                @selection-change="handleSelectionChange"
                v-loading="listLoading"
                border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{scope.row.productId}}</template>
        </el-table-column>
        <el-table-column label="商品图片" width="120" align="center">
          <template slot-scope="scope"><img style="height: 80px" :src="scope.row.picUrl | getOnePic"></template>
        </el-table-column>
        <el-table-column label="商品名称" align="center">
          <template slot-scope="scope">{{scope.row.productName}}</template>
        </el-table-column>
        <el-table-column label="商品类目" align="center">
          <template slot-scope="scope">{{scope.row.typeName}}</template>
        </el-table-column>
        <el-table-column label="是否上架" width="100" align="center">
          <template slot-scope="scope">
            <el-switch
              @change="handleIsPutawayChange(scope.$index, scope.row)"
              active-value="0"
              inactive-value="1"
              v-model="scope.row.isPutaway"
              :disabled="updateAuthority">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="最低价格" width="100" align="center">
          <template slot-scope="scope">{{scope.row.priceMin}}</template>
        </el-table-column>
        <el-table-column label="点击量" width="100" align="center">
          <template slot-scope="scope">{{scope.row.hits}}</template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <p>
              <el-button type="primary" size="mini" @click="handleShowSku(scope.$index, scope.row)"
                         :disabled="updateAuthority">库存编辑</el-button>
              <el-button
                size="mini"
                @click="handleUpdateProduct(scope.$index, scope.row)">查看
              </el-button>
            </p>
            <p>
              <el-button
                size="mini"
                @click="handleUpdateProduct(scope.$index, scope.row)"
                :disabled="updateAuthority">商品编辑
              </el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)"
                :disabled="deleteAuthority">删除
              </el-button>
            </p>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="batch-operate-container">
      <el-select
        size="small"
        v-model="operateType" placeholder="批量操作">
        <el-option
          v-for="item in operates"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button
        style="margin-left: 20px"
        class="search-button"
        @click="handleBatchOperate()"
        type="primary"
        size="small"
        :disabled="updateAuthority">
        确定
      </el-button>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :page-size="listQuery.pageSize"
        :page-sizes="[5,10,15]"
        :current-page.sync="listQuery.pageNum"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import {
    getPage, deleteProduct, updateIsPutaway
  } from '@/mall-api/product'
  import {getProductTypeCascader} from '@/mall-api/productType'
  import auth from '@/utils/auth'

  const defaultListQuery = {
    productId: null,
    pageNum: 1,
    pageSize: 5,
    typeId: null,
    productName: null,
    isPutaway: null
  };
  export default {
    name: "productList",
    data() {
      return {
        editSkuInfo:{
          dialogVisible:false,
          productId:null,
          productSn:'',
          productAttributeCategoryId:null,
          stockList:[],
          productAttr:[],
          keyword:null
        },
        operates: [{
            label: "商品上架",
            value: "publishOn"
          },{
            label: "商品下架",
            value: "publishOff"
          },{
            label: "删除",
            value: "recycle"
          }],
        //批量操作
        operateType: null,
        listQuery: Object.assign({}, defaultListQuery),
        list: null,
        total: null,
        listLoading: true,
        selectProductTypeValue: null,
        //表格选中的值
        multipleSelection: [],
        productTypeOptions: [],
        isPutawayOptions: [{
          value: 0,
          label: '上架'
        },{
          value: 1,
          label: '下架'
        }],
        addAuthority:true,
        updateAuthority:true,
        deleteAuthority:true,
      }
    },
    created() {
      this.getPage();
      this.getProductTypeList();
      this.checkButtonAuthority();
    },
    watch: {
      selectProductTypeValue: function (newValue) {
        if (newValue != null && newValue.length == 2) {
          this.listQuery.typeId = newValue[1];
        } else {
          this.listQuery.typeId = null;
        }

      }
    },
    methods: {
      getProductSkuSp(row, index) {
        if (index === 0) {
          return row.sp1;
        } else if (index === 1) {
          return row.sp2;
        } else {
          return row.sp3;
        }
      },
      getPage() {
        this.listLoading = true;
        getPage(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data.list;
          this.total = response.data.total;
        });
      },
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

      //查看SKU
      handleShowSku(index,row){
        this.$router.push({path:'/pms/productSku',query:{id:row.productId}});
      },
      handleSearchList() {
        this.listQuery.pageNum = 1;
        this.getPage();
      },
      handleAddProduct() {
        this.$router.push({path:'/pms/addProduct'});
      },
      handleBatchOperate() {
        if(this.operateType==null){
          this.$message({
            message: '请选择操作类型',
            type: 'warning',
            duration: 1000
          });
          return;
        }
        if(this.multipleSelection==null||this.multipleSelection.length<1){
          this.$message({
            message: '请选择要操作的商品',
            type: 'warning',
            duration: 1000
          });
          return;
        }
        this.$confirm('是否要进行该批量操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let ids=[];
          for(let i=0;i<this.multipleSelection.length;i++){
            ids.push(this.multipleSelection[i].productId);
          }
          switch (this.operateType) {
            case this.operates[0].value:
              this.updateIsPutAwayList(0,ids);
              break;
            case this.operates[1].value:
              this.updateIsPutAwayList(1,ids);
              break;
            case this.operates[2].value:
              this.deleteProduct(ids);
              break;
            default:
              break;
          }
          this.getPage();
        });
      },
      handleSizeChange(val) {
        this.listQuery.pageNum = 1;
        this.listQuery.pageSize = val;
        this.getPage();
      },
      handleCurrentChange(val) {
        this.listQuery.pageNum = val;
        this.getPage();
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleResetSearch() {
        this.selectProductTypeValue = [];
        this.listQuery = Object.assign({}, defaultListQuery);
      },
      handleDelete(index, row){
        this.$confirm('将同时删除商品的SKU库存信息，请确认?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let ids = [];
          ids.push(row.productId);
          this.deleteProduct(ids);
        });
      },
      handleUpdateProduct(index,row){
        this.$router.push({path:'/pms/updateProduct',query:{id:row.productId}});
      },
      //修改上下架状态
      handleIsPutawayChange(index, row){
        let params = new URLSearchParams();
        params.append('ids', row.productId);
        params.append('isPutaway', row.isPutaway);
        updateIsPutaway(params).then(response=>{
          this.$message({
            message: '修改成功',
            type: 'success',
            duration: 1000
          });
        });
      },
      updateIsPutAwayList(isPutaway, ids) {
        let params = new URLSearchParams();
        params.append('ids', ids);
        params.append('isPutaway', isPutaway);
        updateIsPutaway(params).then(response => {
          this.$message({
            message: '修改成功',
            type: 'success',
            duration: 1000
          });
          this.getPage();
        });
      },
      deleteProduct(ids) {
        let params = new URLSearchParams();
        params.append('ids', ids);
        deleteProduct(params).then(response => {
          this.$message({
            message: '删除成功',
            type: 'success',
            duration: 1000
          });
          this.getPage();
        });

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
    },
    filters: {
      getOnePic(value) {
        return value;
        /*let result = value.split(',')
        return result[0];*/
      }
    }
  }
</script>
