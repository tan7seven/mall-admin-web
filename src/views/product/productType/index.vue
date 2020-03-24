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
        <el-form :inline="true" :model="listQueryParam" size="small" label-width="140px">
          <el-form-item label="类目名称：">
            <el-input style="width: 203px" v-model="listQueryParam.typeName" placeholder="类目名称" clearable> </el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <div class="table-container">
      <el-table ref="productTypeTable"
                style="width: 100%"
                :data="list"
                :row-key="getRowKey"
                lazy
                :load="getPageChildren"
                v-loading="listLoading"
                :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
                border
                >
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="分类名称" align="center">
          <template slot-scope="scope">{{scope.row.typeName}}</template>
        </el-table-column>
        <el-table-column label="级别" width="100" align="center">
          <template slot-scope="scope">{{scope.row.level | levelFilter}}</template>
        </el-table-column>
        <el-table-column label="是否显示" width="100" align="center">
          <template slot-scope="scope">
            <el-switch
              @change="handleShowedChange(scope.$index, scope.row)"
              v-model="scope.row.showed"
              :disabled="updateAuthority">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="是否可用" width="100" align="center">
          <template slot-scope="scope">
            <el-switch
              @change="handleStatusChange(scope.$index, scope.row)"
              v-model="scope.row.usable"
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
        :page-size="listQueryParam.pageSize"
        :page-sizes="[5,10,15]"
        :current-page.sync="listQueryParam.pageNum"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import {getPage,deleteProductType,updateUsable,updateShowSattus} from '@/mall-api/product/productType'
  import auth from '@/utils/auth'
  const defaultListQuery = {
    pageNum: 1,
    pageSize: 5,
    typeName: null,
    parentId:0
  };
  export default {
    name: "productTypeList",
    data() {
      return {
        list: [],
        total: null,
        listLoading: true,
        listQueryParam: Object.assign({}, defaultListQuery),
        parentId: 0,
        addAuthority:true,
        updateAuthority:true,
        deleteAuthority:true,
      }
    },
    created() {
      this.getPage();
      this.checkButtonAuthority();
    },

    methods: {
      // 添加页面
      handleAddProductType() {
        this.$router.push('/pms/addProductType');
      },
      // 分页查询
      getPage() {
        this.listLoading = true;
        getPage(this.listQueryParam).then(response => {
          this.listLoading = false;
          this.list = response.data.records;
          this.total = response.data.total;
        });
      },
      getPageChildren(tree, treeNode, resolve) {
        this. listQueryParam = {
          pageNum: 1,
          pageSize: 5,
          parentId:tree.id
        };
        getPage(this.listQueryParam).then(response => {
          this.listLoading = false;
          resolve(response.data.records);
        });
      },
      // 获取调个行key
      getRowKey (row) {
        return row.id
      },
      handleSizeChange(val) {
        this.listQueryParam.pageNum = 1;
        this.listQueryParam.pageSize = val;
        this.getPage();
      },
      handleCurrentChange(val) {
        this.listQueryParam.pageNum = val;
        this.getPage();
      },
      handleResetSearch() {
        this.listQueryParam = Object.assign({}, defaultListQuery);
      },
      handleSearchList() {
        this.listQueryParam.pageNum = 1;
        this.getPage();
      },
      handleShowedChange(index, row) {
        this.$confirm('是否要修改', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data = {
            'id':row.id,
            'showed':row.showed
          };
          updateShowSattus(data).then(response=>{
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
            'id':row.id,
            'usable':row.usable
          };
          updateUsable(data).then(response=>{
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
      getPropertyList(index, row){
        this.$router.push({path: '/pms/productAttr', query: {parentId: row.parentId, id:row.id}})
      },
      handleUpdate(index, row) {
        this.$router.push({path:'/pms/updateProductType',query:{id:row.id}});
      },
      handleDelete(index, row) {
        this.$confirm('是否要删除该品牌', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteProductType(row.id).then(response => {
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
        this.addAuthority = false;
        this.updateAuthority = false;
        this.deleteAuthority = false;
      },
    },
    filters: {
      levelFilter(value) {
        if (value === 1) {
          return '一级';
        } else if (value === 2) {
          return '二级';
        } else if (value === 3) {
          return '三级';
        }
      },
      disableFirstLevel(value){
        if (value === 2) {
          return false;
        } else {
          return true;
        }
      },
    }
  }
</script>

<style scoped>

</style>
