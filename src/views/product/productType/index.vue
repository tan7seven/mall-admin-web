<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float: right;margin-right: 15px"
          @click="handleAddProductType()"
          size="small"
          type="primary"
          :disabled="addAuthority">
          添加
        </el-button>
        <el-button
          style="float: right;margin-right: 15px"
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
          <el-form-item label="类目名称：">
            <el-input style="width: 203px" v-model="listQuery.typeName" placeholder="类目名称" clearable> </el-input>
          </el-form-item>
        </el-form>
      </div>
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
              v-model="scope.row.isNavigationBar"
              :disabled="updateAuthority">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="是否可用" width="100" align="center">
          <template slot-scope="scope">
            <el-switch
              @change="handleStatusChange(scope.$index, scope.row)"
              active-value="0"
              inactive-value="1"
              v-model="scope.row.isUsable"
              :disabled="updateAuthority">
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
              @click="handleUpdate(scope.$index, scope.row)"
              :disabled="updateAuthority">编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              :disabled="deleteAuthority">删除
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
  import {getPage,deleteProductType,updateStatus,updateNavigationBar} from '@/mall-api/productType'
  import auth from '@/utils/auth'
  const defaultListQuery = {
    pageNum: 1,
    pageSize: 5,
    typeName: null,
  };
  export default {
    name: "productTypeList",
    data() {
      return {
        list: null,
        total: null,
        listLoading: true,
        listQuery: Object.assign({}, defaultListQuery),
        parentId: 0,
        addAuthority:true,
        updateAuthority:true,
        deleteAuthority:true,
      }
    },
    created() {
      this.resetParentId();
      this.getPage();
      this.checkButtonAuthority();
    },
    watch: {
      $route(to, from) {
        console.info(to+"监听$route"+from)
        this.resetParentId();
        this.getPage();
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
      getPage() {
        this.listLoading = true;
        getPage(this.parentId, this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data.list;
          this.total = response.data.total;
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
      handleResetSearch() {
        this.listQuery = Object.assign({}, defaultListQuery);
      },
      handleSearchList() {
        this.listQuery.pageNum = 1;
        this.getPage();
      },
      handleNavigationBarChange(index, row) {
        this.$confirm('是否要修改', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
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
            this.getPage();
          });
        }).catch(() => {
          this.getPage();
        });

      },
      //是否显示
      handleStatusChange(index, row) {
        this.$confirm('是否要修改', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data = {
            'typeId':row.typeId,
            'isUsable':row.isUsable
          };
          updateStatus(data).then(response=>{
            this.$message({
              message: '修改成功',
              type: 'success',
              duration: 1000
            });
            this.getPage();
          });
        }).catch(() => {
          this.getPage();
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
            this.getPage();
          });
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
