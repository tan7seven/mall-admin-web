<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-top: 5px"></i>
      <span style="margin-top: 5px">数据列表</span>
      <el-button
        class="btn-add"
        @click="handleAddProductType()"
        size="mini">
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="productTypeTable"
                style="width: 100%"
                :data="list"
                v-loading="listLoading" border>
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{scope.row.typeId}}</template>
        </el-table-column>
        <el-table-column label="分类名称" align="center">
          <template slot-scope="scope">{{scope.row.typeName}}</template>
        </el-table-column>
        <el-table-column label="级别" width="100" align="center">
          <template slot-scope="scope">{{scope.row.level | levelFilter}}</template>
        </el-table-column>
        <el-table-column label="是否显示在导航栏" width="100" align="center">
          <template slot-scope="scope">
            <el-switch
              @change="handleNavigationBarChange(scope.$index, scope.row)"
              active-value="0"
              inactive-value="1"
              v-model="scope.row.isNavigationBar">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="是否显示" width="100" align="center">
          <template slot-scope="scope">
            <el-switch
              @change="handleStatusChange(scope.$index, scope.row)"
              active-value="0"
              inactive-value="1"
              v-model="scope.row.status">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="排序" width="100" align="center">
          <template slot-scope="scope">{{scope.row.sort }}</template>
        </el-table-column>
        <el-table-column label="属性操作" width="120" align="center">
          <template slot-scope="scope" >
            <el-button
              size="mini"
              :disabled="scope.row.level | disableFirstLevel"
              @click="getPropertyList(scope.$index, scope.row)">属性列表
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="类目操作" width="300" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              :disabled="scope.row.level | disableNextLevel"
              @click="handleShowNextLevel(scope.$index, scope.row)">查看下级
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
        :page-sizes="[5,10,15]"
        :current-page.sync="listQuery.pageNum"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import {getList,deleteProductType,updateStatus,updateNavigationBar} from '@/mall-api/productType'

  export default {
    name: "productTypeList",
    data() {
      return {
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          pageNum: 1,
          pageSize: 5
        },
        parentId: 0
      }
    },
    created() {
      this.resetParentId();
      this.getList();
    },
    watch: {
      $route(to, from) {
        console.info(to+"监听$route"+from)
        this.resetParentId();
        this.getList();
      }
    },
    methods: {
      resetParentId(){
        if (this.$route.query.parentId != null) {
          this.parentId = this.$route.query.parentId;
          this. listQuery = {
              pageNum: 1,
              pageSize: 5
          }
        } else {
          this.parentId = 0;
        }
      },
      handleAddProductType() {
        this.$router.push('/pms/addProductType');
      },
      getList() {
        this.listLoading = true;
        getList(this.parentId, this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data.list;
          this.total = response.data.total;
        });
      },
      handleSizeChange(val) {
        this.listQuery.pageNum = 1;
        this.listQuery.pageSize = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.pageNum = val;
        this.getList();
      },
      handleNavigationBarChange(index, row) {
        let data = {
          'typeId':row.typeId,
          'isNavigationBar':row.isNavigationBar
        };
        updateNavigationBar(data).then(response=>{
          this.$message({
            message: '修改成功',
            type: 'success',
            duration: 1000
          });
        });
      },
      handleStatusChange(index, row) {
        // let data = new URLSearchParams();
        // let ids=[];
        // ids.push(row.typeId)
        // data.append('ids',ids);
        // data.append('status',row.status);
        let data = {
          'typeId':row.typeId,
          'status':row.status
        };
        updateStatus(data).then(response=>{
          this.$message({
            message: '修改成功',
            type: 'success',
            duration: 1000
          });
        });
      },
      handleShowNextLevel(index, row) {
        this.$router.push({path: '/pms/productType', query: {parentId: row.typeId}})
      },
      getPropertyList(index, row){
        this.$router.push({path: '/pms/productProperty', query: {parentId: row.parentId, typeId:row.typeId}})
      },
      handleUpdate(index, row) {
        this.$router.push({path:'/pms/updateProductType',query:{typeId:row.typeId}});
      },
      handleDelete(index, row) {
        this.$confirm('是否要删除该品牌', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteProductType(row.typeId).then(response => {
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 1000
            });
            this.getList();
          });
        });
      }
    },
    filters: {
      levelFilter(value) {
        if (value === 0) {
          return '一级';
        } else if (value === 1) {
          return '二级';
        }
      },
      disableFirstLevel(value){
        if (value === 1) {
          return false;
        } else {
          return true;
        }
      },
      disableNextLevel(value) {
        if (value === 0) {
          return false;
        } else {
          return true;
        }
      }
    }
  }
</script>

<style scoped>

</style>
