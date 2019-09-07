<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-top: 5px"></i>
      <span style="margin-top: 5px">数据列表</span>
      <el-button
        class="btn-add"
        @click="handleAddMenu()"
        size="mini"
        :disabled="addAuthority">
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="productTypeTable"
                style="width: 100%"
                :data="list"
                row-key="menuId"
                border
                lazy
                :load="loadChildren"
                :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
                v-loading="listLoading" >
        <el-table-column label="标题" width="150" align="center">
          <template slot-scope="scope">{{scope.row.menuTitle}}</template>
        </el-table-column>
        <el-table-column label="父级菜单" width="150" align="center">
          <template slot-scope="scope">{{scope.row.parentTitle}}</template>
        </el-table-column>
        <el-table-column label="菜单编码" width="250" align="center">
          <template slot-scope="scope">{{scope.row.menuCode}}</template>
        </el-table-column>
        <el-table-column label="是否显示" width="80" align="center">
          <template slot-scope="scope">
            <el-switch
              @change="handleHiddenChange(scope.$index, scope.row)"
              active-value="0"
              inactive-value="1"
              v-model="scope.row.isHidden"
              :disabled="updateAuthority">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="菜单路径" width="180" align="center">
          <template slot-scope="scope">{{scope.row.menuUrl}}</template>
        </el-table-column>
        <el-table-column label="菜单图标" width="150" align="center">
          <template slot-scope="scope">{{scope.row.menuIcon}}</template>
        </el-table-column>
        <el-table-column label="操作" align="center">
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
    <!--<div class="pagination-container">
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
    </div>-->
  </div>
</template>

<script>
  import {getPage, deleteMenu, updateIsHidden, getMenuListById} from '@/mall-api/system/menu'
  import {formatDate} from '@/utils/date';
  import auth from '@/utils/auth'

  export default {
    name: "menuIndex",
    data() {
      return {
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          menuId:0,
         /* pageNum: 1,
          pageSize: 5*/
        },
        addAuthority:true,
        updateAuthority:true,
        deleteAuthority:true,
      }
    },
    created() {
      this.getMenuListById();
      this.checkButtonAuthority();
    },
    methods: {
      getMenuListById() {
        this.listLoading = true;
        getMenuListById(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data;
          this.total = response.data.total;
        });
      },
      handleUpdate(index, row){
        this.$router.push({path:'/system/updateMenu',query:{menuId:row.menuId}});
      },
      handleAddMenu(){
        this.$router.push({path:'/system/createMenu'});
      },
      handleDelete(index, row){
        this.$confirm('是否要进行删除操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let ids = [];
          ids.push(row.menuId);
          let params = new URLSearchParams();
          params.append("ids",ids);
          deleteMenu(params).then(response => {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1000
            });
            this.getMenuListById();
          });
        });
      },
      handleHiddenChange(index, row){
        let data = {
          'menuId':row.menuId,
          'isHidden':row.isHidden
        };
        this.$confirm('是否要修改', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          updateIsHidden(data).then(response => {
            this.$message({
              message: '修改成功',
              type: 'success',
              duration: 1000
            });
            this.getMenuListById();
          });
        }).catch(() => {
          this.getMenuListById();
        });
      },
      /*handleSizeChange(val) {
        this.listQuery.pageNum = 1;
        this.listQuery.pageSize = val;
        this.getMenuListById();
      },
      handleCurrentChange(val) {
        this.listQuery.pageNum = val;
        this.getMenuListById();
      },*/
      loadChildren(tree, treeNode, resolve){
        this.listLoading = true;
        getMenuListById(tree).then(response => {
          this.listLoading = false;
          resolve(response.data);
          this.total = response.data.total;
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
      formatTime(time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      },
    }
  }
</script>

<style scoped>

</style>
