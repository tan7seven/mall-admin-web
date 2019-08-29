<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-top: 5px"></i>
      <span style="margin-top: 5px">数据列表</span>
      <el-button
        class="btn-add"
        @click="handleAddProductProperty()"
        size="mini">
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="productPropertyTable"
                style="width: 100%"
                :data="list"
                v-loading="listLoading" border>
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{scope.row.propertyNameId}}</template>
        </el-table-column>
        <el-table-column label="属性名称" align="center">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="分类ID" align="center" width="100">
          <template slot-scope="scope">{{scope.row.typeId}}</template>
        </el-table-column>
        <el-table-column label="是否销售属性" width="150" align="center">
          <template slot-scope="scope">
            <el-switch
              @change="handleIsSaleChange(scope.$index, scope.row)"
              active-value="0"
              inactive-value="1"
              v-model="scope.row.isSale">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="是否显示" width="100" align="center">
          <template slot-scope="scope">
            <el-switch
              @change="handleIsShowChange(scope.$index, scope.row)"
              active-value="0"
              inactive-value="1"
              v-model="scope.row.isShow">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="是否可用" width="100" align="center">
          <template slot-scope="scope">
            <el-switch
              @change="handleIsUsableChange(scope.$index, scope.row)"
              active-value="0"
              inactive-value="1"
              v-model="scope.row.isUsable">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300" align="center">
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
        :page-sizes="[5,10,15]"
        :current-page.sync="listQuery.pageNum"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import {getPage, deleteProductProperty, updateIsSale, updateIsShow, updateIsUsable} from '@/mall-api/productProperty'

  export default {
    name: "productPropertyList",
    data() {
      return {
        typeId:'0',
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          typeId:null,
          pageNum: 1,
          pageSize: 5
        },
        parentId:null
      }
    },
    created() {
      this.resetTypeId();
      this.getPage();
    },
    methods: {
      handleAddProductProperty() {
        this.$router.push({path:'/pms/addProductProperty', query:{parentId: this.parentId, typeId:this.typeId}});
      },
      handleUpdate(index, row) {
        this.$router.push({path:'/pms/updateProductProperty',query:{propertyNameId:row.propertyNameId}});
      },
      //设置typeID
      resetTypeId(){
        if(this.$route.query.typeId != null){
          this.parentId = this.$route.query.parentId;
          this.typeId = this.$route.query.typeId;
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
          this.list = response.data.list;
          this.total = response.data.total;
        });
      },
      handleDelete(index, row){
        this.$confirm('是否要删除该类目', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteProductProperty(row.propertyNameId).then(response => {
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
      handleIsSaleChange(index, row){
        let data = {
          'propertyNameId':row.propertyNameId,
          'isSale':row.isSale
        };
        this.$confirm('是否要修改', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          updateIsSale(data).then(response => {
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
          'propertyNameId':row.propertyNameId,
          'isShow':row.isShow
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
      //是否可用
      handleIsUsableChange(index, row){
        let data = {
          'propertyNameId':row.propertyNameId,
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
    }
  }
</script>

<style scoped>

</style>
