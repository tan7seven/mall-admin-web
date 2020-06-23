<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-top: 5px"></i>
      <span style="margin-top: 5px">数据列表</span>
      <el-button
        class="btn-add"
        @click="handleAddAdmin()"
        size="mini"
        :disabled="addAuthority">
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
        <el-table-column label="姓名" width="150" align="center">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="电话号码" width="150" align="center">
          <template slot-scope="scope">{{scope.row.phone}}</template>
        </el-table-column>
        <el-table-column label="是否可用" width="80" align="center">
          <template slot-scope="scope">
            <el-switch
              @change="handleUsableChange(scope.$index, scope.row)"
              active-value=true
              inactive-value=false
              v-model="scope.row.isUsable"
              :disabled="updateAuthority">
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
              @click="handleMenuAuthority(scope.$index, scope.row)"
              :disabled="updateAuthority">页面授权
            </el-button>
            <el-button
              size="mini"
              @click="handleUpdate(scope.$index, scope.row)"
              :disabled="updateAuthority">编辑
            </el-button>
            </p>
            <p><el-button
              size="mini"
              @click="handleButtonAuthority(scope.$index, scope.row)"
              :disabled="updateAuthority">按钮授权
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              :disabled="deleteAuthority">删除
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
    <el-dialog title="按钮授权"
               :visible.sync="buttonDialogVisible"
               v-loading="buttonDialogLoading"
               element-loading-text="拼命加载中"
               element-loading-spinner="el-icon-loading"
               element-loading-background="rgba(0, 0, 0, 0.8)"
               width="50%">
      <el-form label-width="150px">
        <el-form-item label="账号：" prop="loginCode">
          <el-input v-model="buttonDialog.loginCode"></el-input>
        </el-form-item>
        <el-form-item label="姓名：" prop="name">
          <el-input v-model="buttonDialog.name"></el-input>
        </el-form-item>
      </el-form>
      <el-row>
        <el-col :span="12"><el-tree
          :data="buttonDialogTree"
          default-expand-all
          node-key="id"
          ref="tree"
          @node-click="handleButtonAuthorityNodeClick"
          highlight-current>
        </el-tree></el-col>
        <el-col :span="12">
            <p>按钮列表：</p>
            <el-checkbox-group v-model="buttonListSelect" >
              <el-checkbox v-for="button in buttonList" :label="button.buttonName" :key="button.buttonName">{{button.buttonName}}</el-checkbox>
            </el-checkbox-group>
        </el-col>
      </el-row>

      <div slot="footer">
        <el-button  size="small" @click="buttonDialogVisible = false">关 闭</el-button>
        <el-button  size="small" type="primary" @click="handleButtonDialogConfirm()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {getPage, deleteAdmin, updateIsUsable, menuAuthorityConfirm, buttonAuthorityConfirm, getAdminMenuAuthority} from '@/mall-api/system/admin'
  import {getMenuTree, getButtonList} from '@/mall-api/system/menu'
  import {formatDate} from '@/utils/date';
  import auth from '@/utils/auth'

  const defaultMenuDialog = {
    loginCode : null,
    name : null,
    userId:null,
    menuList:[],
  };
  const defaultButtonDialog = {
    loginCode : null,
    name : null,
    userId:null,
    menuId :null,
    buttonList:[],
  };
  export default {
    name: "admin",
    data() {
      return {
        //菜单授权
        menuDialogVisible:false,
        menuDialog:defaultMenuDialog,
        menuDialogTree:null,
        menuDialogLoading:false,
        //按钮授权
        buttonDialogVisible:false,
        buttonDialog:defaultButtonDialog,
        buttonDialogTree:null,
        buttonDialogLoading:false,
        //按钮列表
        buttonListSelect:[],
        buttonList:[],
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          pageNum: 1,
          pageSize: 5
        },
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
      getPage() {
        this.listLoading = true;
        getPage(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data.records;
          this.total = response.data.total;
        });
      },
      handleUpdate(index, row){
        this.$router.push({path:'/system/updateAdmin',query:{userId:row.userId}});
      },
      handleAddAdmin(){
        this.$router.push({path:'/system/createAdmin'});
      },
      //打开按钮授权页面
      handleButtonAuthority(index, row){
        this.buttonDialogLoading = true;
        this.buttonListSelect = [];
        this.buttonList = [];
        this.buttonDialog.loginCode = row.loginCode;
        this.buttonDialog.name = row.name;
        this.buttonDialog.userId = row.userId;
        let params = {userId:row.userId};
        getMenuTree(params).then(response => {
          this.buttonDialogTree = response.data;
          this.buttonDialogLoading = false;
        });
        this.buttonDialogVisible = true;
      },
      //打开菜单授权页面
      handleMenuAuthority(index, row){
        this.menuDialogLoading = true;
        this.menuDialog.loginCode = row.loginCode;
        this.menuDialog.name = row.name;
        this.menuDialog.userId = row.userId;
        let params = {};
        getMenuTree(params).then(response => {
          this.menuDialogTree = response.data;
        });
        getAdminMenuAuthority(row.userId).then(response =>{
          this.$refs.tree.setCheckedKeys(response.data);
          this.menuDialogLoading = false;
        });
        this.menuDialogVisible = true;
      },
      //按钮授权时,点击节点时间
      handleButtonAuthorityNodeClick(data){
        if(data.children){
          return false;
        }
        this.buttonDialogLoading = true;
        let params = {
          menuId : data.id,
          userId : this.buttonDialog.userId
        };
        this.buttonListSelect = [];
        this.buttonList = [];
        getButtonList(params).then(response => {
          this.buttonListSelect =  response.data.buttonListAuthority;
          this.buttonList = response.data.buttonListEntity;
          this.buttonDialog.menuId = data.id;
          this.buttonDialogLoading = false;
        });
      },
      //删除操作
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
      //菜单授权提交
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
      //按钮授权确认
      handleButtonDialogConfirm(){
        this.$confirm('是否要提交', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let buttonList = this.buttonListSelect;
          this.buttonDialog.buttonList = [];
          this.buttonList.forEach(s => {
            if(buttonList.indexOf(s.buttonName) != -1){
              this.buttonDialog.buttonList.push(s);
            }
          });
          buttonAuthorityConfirm(this.buttonDialog).then(response => {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1000
            });
          });
        });
      },
      //修改是否可用
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
        }).catch(() => {
          this.getPage();
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
