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
        <el-table-column label="标题" width="200" align="center">
          <template slot-scope="scope">{{scope.row.title}}</template>
        </el-table-column>
        <el-table-column label="类型" width="150" align="center">
          <template slot-scope="scope">{{scope.row.typeName}}</template>
        </el-table-column>
        <el-table-column label="图片" width="150" align="center">
          <template slot-scope="scope"><img style="height: 80px" :src="scope.row.picUrl"></template>
        </el-table-column>
        <el-table-column label="排序" width="180" align="center">
          <template slot-scope="scope">{{scope.row.sort}}</template>
        </el-table-column>
        <el-table-column label="操作" width="400" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleAddProduct(scope.$index, scope.row)">添加商品
            </el-button>
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
  import advertRequest from '@/mall-api/advert/advert-request.js';

  export default {
    name: "advert",
    data() {
      return {
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          pageNum: 1,
          pageSize: 10
        },
      }
    },
    created() {
      this.getPage();
    },
    methods: {
      getPage() {
        this.listLoading = true;
        advertRequest.getPage(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data.records;
          this.total = response.data.total;
        });
      },
      // 添加
      handleAdd() {
        this.$router.push({path:'/advert/add'});
      },
      // 修改
      handleUpdate(index, row) {
        this.$router.push({path:'/advert/update',query:{id:row.id}});
      },
      // 删除
      handleDelete(index, row){
        this.$confirm('请确认?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          advertRequest.removeAdvert(row.id).then(res =>{
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 1000
            });
            this.getPage();
          });
        });
      },
      // 广告商品管理
      handleAddProduct(index, row){
        this.$router.push({path:'/advert/product-list',query:{id:row.id}});
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
      formatType(val) {
        var advertTypeMap = new Map();
        advertTypeMap.set(1, "首页轮播");
        advertTypeMap.set(2, "首页分类tab");
        advertTypeMap.set(3, "首页分类加商品推荐");
        advertTypeMap.set(4, "猜你喜欢");
        return advertTypeMap.get(val);
      },
    }
  }
</script>

<style scoped>

</style>
