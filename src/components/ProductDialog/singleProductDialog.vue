<template>
  <el-dialog title="商品列表" :visible.sync="dialogVisible" top="2vh">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float: right;margin-right: 15px"
          @click="handleSearchList()"
          type="primary"
          size="small">
          查询结果
        </el-button>
        <el-button
          style="float: right;margin-right: 15px"
          @click="submitHandle()"
          type="primary"
          size="small">
          确认
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="商品名称：">
            <el-input style="width: 203px" v-model="listQuery.productName" placeholder="当前商品" clearable></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <div class="table-container">
        <el-table ref="productTypeTable"
                    style="width: 100%"
                    :data="productList"
                    @selection-change="handleSelectionChange"
                    v-loading="listLoading"
                    @row-click="rowClickHandle"
                    border>
            <el-table-column type="index" width="60" align="center"></el-table-column>
            <el-table-column label="编号" width="100" align="center">
            <template slot-scope="scope">{{scope.row.id}}</template>
            </el-table-column>
            <el-table-column label="商品图片" width="120" align="center">
            <template slot-scope="scope"><img style="height: 80px" :src="scope.row.picUrl"></template>
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
                v-model="scope.row.putaway"
                disabled>
                </el-switch>
            </template>
            </el-table-column>
            <el-table-column label="是否可用" width="100" align="center">
            <template slot-scope="scope">
                <el-switch
                v-model="scope.row.usable"
                disabled>
                </el-switch>
            </template>
            </el-table-column>
            <el-table-column label="最低价格" width="100" align="center">
            <template slot-scope="scope">{{scope.row.minPrice}}</template>
            </el-table-column>
        </el-table>
        </div>
        <div style="margin-top: 5px">
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
    </el-dialog>
</template>
<script>
import {
    getPage
  } from '@/mall-api/product/product'

const defaultListQuery = {
    productId: null,
    pageNum: 1,
    pageSize: 5,
    typeId: null,
    productName: null,
    isPutaway: null
  };

  export default {
    name: 'singleProductDialog',
    props: {
      dialogTableVisible:{
        type:Boolean,
        default:false
      },
      oldParam:{
        type:[String, Number, Object]
      }
    },
    watch: {
      dialogTableVisible:function (newValue) {
        this.dialogVisible = newValue;
      }
    },
    created(){
        this.getPage();
    },
    data() {
      return {
        dialogVisible:false,
        listLoading:false,
        productList:[],
        listQuery: Object.assign({}, defaultListQuery),
        //表格选中的值
        multipleSelection: [],
        total:null,
        selectRow:{},
      };
    },
    methods: {
      getPage(){
          this.listLoading = true;
          getPage(this.listQuery).then(response => {
          this.listLoading = false;
          this.productList = response.data.records;
          this.total = response.data.total;
          });
      },
      handleSelectionChange(val) {
          this.multipleSelection = val;
      },
      handleSearchList(){
          this.getPage();
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
      rowClickHandle(row, column, event){
        this.listQuery.productName = row.productName;
        this.selectRow = row;
      },
      submitHandle(){
        this.$emit('productSelectSubmit', this.oldParam, this.selectRow)
      },
    }
  }
</script>
