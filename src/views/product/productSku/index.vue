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
          <el-form-item label="商品编号：">
            <el-input style="width: 203px" v-model="listQuery.productId" placeholder="商品编号"></el-input>
          </el-form-item>
          <el-form-item label="商品分类：">
            <el-cascader
              clearable
              v-model="selectProductTypeValue"
              :options="productTypeOptions">
            </el-cascader>
          </el-form-item>
          <el-form-item label="上架状态：">
            <el-select v-model="listQuery.status" placeholder="全部" clearable>
              <el-option
                v-for="item in statusOptions"
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
        size="mini">
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
          <template slot-scope="scope">{{scope.row.skuId}}</template>
        </el-table-column>
        <el-table-column label="商品名称" align="center">
          <template slot-scope="scope">{{scope.row.productName}}</template>
        </el-table-column>
        <el-table-column label="商品类目" width="100" align="center">
          <template slot-scope="scope">{{scope.row.typeName}}</template>
        </el-table-column>
        <el-table-column label="SKU属性值" width="100" align="center">
          <template slot-scope="scope">{{scope.row.properties}}</template>
        </el-table-column>
        <el-table-column label="商品销售价" width="100" align="center">
          <template slot-scope="scope">{{scope.row.price}}</template>
        </el-table-column>
        <el-table-column label="商品最低价" width="120" align="center">
          <template slot-scope="scope">{{scope.row.priceMin}}</template>
        </el-table-column>
        <el-table-column label="商品成本" width="120" align="center">
          <template slot-scope="scope">{{scope.row.priceMin}}</template>
        </el-table-column>
        <el-table-column label="SKU历史总数" width="120" align="center">
          <template slot-scope="scope">{{scope.row.sum}}</template>
        </el-table-column>
        <el-table-column label="SKU库存" width="100" align="center">
          <template slot-scope="scope">{{scope.row.stock}}</template>
        </el-table-column>
        <el-table-column label="操作" width="160" align="center">
          <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleUpdateProduct(scope.$index, scope.row)">编辑
              </el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除
              </el-button>
          </template>
        </el-table-column>
      </el-table>
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
  </div>
</template>
<script>
  import { getPage } from '@/mall-api/productSku'
  import {getProductTypeCascader} from '@/mall-api/productType'

  const defaultListQuery = {
    pageNum: 1,
    pageSize: 5,
    skuId: null,
    properties: null,
    productName: null,
    price: null,
    priceMin:null,
    cost:null,
    sum:null,
    stock:null,
  };
  export default {
    name: "productSku",
    data() {
      return {
        listQuery: Object.assign({}, defaultListQuery),
        list: null,
        total: null,
        listLoading: true,
        selectProductTypeValue: null,
        //表格选中的值
        multipleSelection: [],
        productTypeOptions: [],
        statusOptions: [{
          value: 1,
          label: '上架'
        },{
          value: 0,
          label: '下架'
        }]
      }
    },
    created() {
      this.getPage();
      this.getProductTypeList();
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

      handleSearchList() {
        this.listQuery.pageNum = 1;
        this.getPage();
      },
      handleAddProduct() {
        this.$router.push({path:'/pms/addProductSku'});
      },
      //分页插件
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
        this.$confirm('是否要进行删除操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let ids = [];
          ids.push(row.id);
          this.updateDeleteStatus(1,ids);
        });
      },
      handleUpdateProduct(index,row){
        this.$router.push({path:'/pms/updateProduct',query:{id:row.id}});
      },
    }
  }
</script>
