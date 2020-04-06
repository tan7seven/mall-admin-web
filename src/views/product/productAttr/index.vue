<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float: right;margin-right: 15px"
          @click="handleAddProductAttr()"
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
          <el-form-item label="属性名称：">
            <el-input style="width: 203px" v-model="listQuery.name" placeholder="属性名称" clearable> </el-input>
          </el-form-item>
          <el-form-item label="类目名称：">
            <el-input style="width: 203px" v-model="listQuery.typeName" placeholder="类目名称" clearable> </el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <div class="table-container">
      <el-table ref="productAttrTable"
                style="width: 100%"
                :data="list"
                v-loading="listLoading" border>
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="属性名称" align="center">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="分类名称" align="center" width="100">
          <template slot-scope="scope">{{scope.row.typeName}}</template>
        </el-table-column>
        <el-table-column label="是否可用" width="150" align="center">
          <template slot-scope="scope">
            <el-switch
              @change="handleUsableChange(scope.$index, scope.row)"
              v-model="scope.row.usable"
              :disabled="updateAuthority">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="是否显示" width="100" align="center">
          <template slot-scope="scope">
            <el-switch
              @change="handleIsShowChange(scope.$index, scope.row)"
              v-model="scope.row.showed"
              :disabled="updateAuthority">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="类型" width="100" align="center">
          <template slot-scope="scope">{{scope.row.type | typeFilter}}</template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
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
  import {getPage, deleteProductAttr, updateIsShow, updateIsUsable} from '@/mall-api/product/productAttr'
  import auth from '@/utils/auth'
  const defaultListQuery = {
    typeId:null,
    pageNum: 1,
    pageSize: 5,
    typeName: null,
    name:null,
  };
  export default {
    name: "productAttrList",
    data() {
      return {
        typeId:null,
        list: null,
        total: null,
        listLoading: true,
        listQuery: Object.assign({}, defaultListQuery),
        parentId:null,
        addAuthority:true,
        updateAuthority:true,
        deleteAuthority:true,
      }
    },
    created() {
      this.resetTypeId();
      this.getPage();
      this.checkButtonAuthority();
    },
    methods: {
      handleAddProductAttr() {
        this.$router.push({path:'/pms/addProductAttr', query:{parentId: this.parentId, typeId:this.typeId}});
      },
      handleUpdate(index, row) {
        this.$router.push({path:'/pms/updateProductAttr',query:{id:row.id}});
      },
      //设置typeID
      resetTypeId(){
        if(this.$route.query.id != null){
          this.parentId = this.$route.query.parentId;
          this.typeId = this.$route.query.id;
        }
        this.listQuery={
          typeId:this.typeId,
          pageNum: 1,
          pageSize: 5
        }
      },
      //获取表格信息
      getPage(){
        this.listLoading = true;
        getPage(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data.records;
          this.total = response.data.total;
        });
      },
      handleDelete(index, row){
        this.$confirm('是否要删除该类目', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteProductAttr(row.id).then(response => {
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 1000
            });
            this.getPage();
          });
        });
      },
      //是否销售属性
      handleUsableChange(index, row){
        let data = {
          'id':row.id,
          'usable':row.usable
        };
        this.$confirm('是否要修改', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          updateIsUsable(data).then(response => {
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
      handleIsShowChange(index, row){
        let data = {
          'id':row.id,
          'showed':row.showed
        };
        this.$confirm('是否要修改', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          updateIsShow(data).then(response => {
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
      //分页插件
      handleSizeChange(val) {
        this.listQuery.pageNum = 1;
        this.listQuery.pageSize = val;
        this.getPage();
      },
      //分页插件
      handleCurrentChange(val) {
        this.listQuery.pageNum = val;
        this.getPage();
      },
      //筛选查询
      handleResetSearch() {
        this.listQuery = Object.assign({}, defaultListQuery);
      },
      handleSearchList() {
        this.listQuery.pageNum = 1;
        this.getPage();
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
        this.addAuthority = false;
        this.updateAuthority = false;
        this.deleteAuthority = false;
      },
    },
    filters: {
      typeFilter(value) {
        if (value === 1) {
          return '销售属性';
        } else if (value === 2) {
          return '展示参数';
        }
      },
    },
  }
</script>

<style scoped>

</style>
