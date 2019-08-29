<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-top: 5px"></i>
      <span style="margin-top: 5px">数据列表</span>
      <el-button
        class="btn-add"
        @click="handleAddAdmin()"
        size="mini">
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="productTypeTable"
                style="width: 100%"
                :data="list"
                v-loading="listLoading" border>
        <el-table-column label="登录账号" width="100" align="center">
          <template slot-scope="scope">{{scope.row.loginCode}}</template>
        </el-table-column>
        <el-table-column label="姓名" align="center">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="电话号码" width="150" align="center">
          <template slot-scope="scope">{{scope.row.phone}}</template>
        </el-table-column>
        <el-table-column label="是否可用" width="80" align="center">
          <template slot-scope="scope">
            <el-switch
              @change="handleUsableChange(scope.$index, scope.row)"
              active-value="0"
              inactive-value="1"
              v-model="scope.row.isUsable">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="180" align="center">
          <template slot-scope="scope">{{scope.row.createTime | formatTime}}</template>
        </el-table-column>
        <el-table-column label="修改时间" width="180" align="center">
          <template slot-scope="scope">{{scope.row.modifyTime | formatTime}}</template>
        </el-table-column>
        <el-table-column label="操作" width="300" align="center">
          <template slot-scope="scope">
            <p><el-button
              size="mini"
              @click="handleMenuAuthority(scope.$index, scope.row)">页面授权
            </el-button>
            <el-button
              size="mini"
              @click="handleUpdate(scope.$index, scope.row)">编辑
            </el-button>
            </p>
            <p><el-button
              size="mini"
              @click="handleButtonAuthority(scope.$index, scope.row)">按钮授权
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
            </p>
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
    <el-dialog title="页面授权"
               :visible.sync="menuDialogVisible"
               v-loading="menuDialogLoading"
               element-loading-text="拼命加载中"
               element-loading-spinner="el-icon-loading"
               element-loading-background="rgba(0, 0, 0, 0.8)"
               width="50%">
      <el-form label-width="150px">
        <el-form-item label="账号：" prop="loginCode">
          <el-input v-model="menuDialog.loginCode"></el-input>
        </el-form-item>
        <el-form-item label="姓名：" prop="name">
          <el-input v-model="menuDialog.name"></el-input>
        </el-form-item>
      </el-form>
      <el-tree
        :data="menuDialogTree"
        show-checkbox
        default-expand-all
        node-key="id"
        ref="tree"
        highlight-current>
      </el-tree>
      <div slot="footer">
        <el-button  size="small" @click="menuDialogVisible = false">取 消</el-button>
        <el-button  size="small" type="primary" @click="handleMenuDialogConfirm()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {getPage, deleteAdmin, updateIsUsable, menuAuthorityConfirm ,getAdminMenuAuthority} from '@/mall-api/system/admin'
  import {getMenuTree} from '@/mall-api/system/menu'
  import {formatDate} from '@/utils/date';


  const defaultMenuDialog = {
    loginCode : null,
    name : null,
    userId:null,
    menuList:[],
  };

  export default {
    name: "admin",
    data() {
      return {
        menuDialogVisible:false,
        menuDialog:defaultMenuDialog,
        menuDialogTree:null,
        menuDialogLoading:false,
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          pageNum: 1,
          pageSize: 5
        },
      }
    },
    created() {
      this.getPage();
    },
    methods: {
      getPage() {
        this.listLoading = true;
        getPage(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data.list;
          this.total = response.data.total;
        });
      },
      handleUpdate(index, row){
        this.$router.push({path:'/system/updateAdmin',query:{userId:row.userId}});
      },
      handleAddAdmin(){
        this.$router.push({path:'/system/createAdmin'});
      },
      handleButtonAuthority(index, row){
        this.$router.push({path:'/system/updateAdmin',query:{userId:row.userId}});
      },
      handleMenuAuthority(index, row){
        this.menuDialogLoading = true;
        this.menuDialog.loginCode = row.loginCode;
        this.menuDialog.name = row.name;
        this.menuDialog.userId = row.userId;
        getMenuTree().then(response => {
          this.menuDialogTree = response.data;
        });
        getAdminMenuAuthority(row.userId).then(response =>{
          this.$refs.tree.setCheckedKeys(response.data);
          this.menuDialogLoading = false;
        });
        this.menuDialogVisible = true;
      },
      handleDelete(index, row){
        this.$confirm('是否要进行删除操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let ids = [];
          ids.push(row.userId);
          let params = new URLSearchParams();
          params.append("ids",ids);
          deleteAdmin(params).then(response => {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1000
            });
            this.getPage();
          });
        });
      },
      handleMenuDialogConfirm(){
        this.$confirm('是否要提交', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.menuDialog.menuList = this.$refs.tree.getCheckedKeys();
          menuAuthorityConfirm(this.menuDialog).then(response => {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1000
            });
            this.menuDialogVisible = false;
          });
        }).catch(() => {
          this.getPage();
        });
      },
      handleUsableChange(index, row){
        let data = {
          'userId':row.userId,
          'isUsable':row.isUsable
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
