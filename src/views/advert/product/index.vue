<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-top: 5px"></i>
      <span style="margin-top: 5px">数据列表</span>
      <el-button
        class="btn-add"
        @click="handleAdd()"
        size="mini">
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="productTypeTable"
                style="width: 100%"
                :data="list"
                v-loading="listLoading" border>
        <el-table-column label="序号" width="100" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="商品编号" width="100" align="center">
          <template slot-scope="scope">{{scope.row.productId}}</template>
        </el-table-column>
        <el-table-column label="商品名称" width="200" align="center">
          <template slot-scope="scope">{{scope.row.productName}}</template>
        </el-table-column>
        <el-table-column label="价格" width="150" align="center">
          <template slot-scope="scope">{{scope.row.price}}</template>
        </el-table-column>
        <el-table-column label="图片" width="150" align="center">
          <template slot-scope="scope"><img style="height: 80px" :src="scope.row.picUrl"></template>
        </el-table-column>
        <el-table-column label="操作" width="400" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleUpdate(scope.$index, scope.row)">编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :page-size="listQuery.pageSize"
        :page-sizes="[10,20,35]"
        :current-page.sync="listQuery.pageNum"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import {formatDate} from '@/utils/date';
  import advertProductRequest from '@/mall-api/advert/advertProduct-request.js';

  export default {
    name: "advert-product",
    data() {
      return {
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          advertId:null,
          pageNum: 1,
          pageSize: 10
        },
      }
    },
    created() {
      if(undefined == this.$route.query.id){
            this.$message({
              message: '请选择对应广告',
              type: 'success',
              duration: 1000
            });
            this.$router.back();
      }
      this.listQuery.advertId = this.$route.query.id;
      this.getPage();
    },
    methods: {
      getPage() {
        let advertId = this.$route.query.id;
        this.listLoading = true;
        this.listQuery.advertId = advertId;
        advertProductRequest.getPage(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data.records;
          this.total = response.data.total;
        });
      },
      // 添加
      handleAdd() {
        this.$router.push({path:'/advert/product-add',query:{advertId:this.listQuery.advertId}});
      },
      // 修改
      handleUpdate(index, row) {
        this.$router.push({path:'/advert/product-update',query:{id:row.id, advertId:this.listQuery.advertId}});
      },
      // 删除
      handleDelete(index, row){
        this.$confirm('请确认?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          advertProductRequest.removeAdvert(row.id).then(res =>{
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 1000
            });
            this.getPage();
          });
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
    },
    filters: {
    }
  }
</script>

<style scoped>

</style>
