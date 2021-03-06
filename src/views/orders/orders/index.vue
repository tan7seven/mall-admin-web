<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float:right"
          type="primary"
          @click="handleSearchList()"
          size="small">
          查询搜索
        </el-button>
        <el-button
          style="float:right;margin-right: 15px"
          @click="handleResetSearch()"
          size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="输入搜索：">
            <el-input v-model="listQuery.ordersId" class="input-width" placeholder="订单编号"></el-input>
          </el-form-item>
          <el-form-item label="收货人：">
            <el-input v-model="listQuery.receiverName" class="input-width" placeholder="收货人姓名"></el-input>
          </el-form-item>
          <el-form-item label="提交时间：">
            <el-date-picker
              class="input-width"
              v-model="listQuery.createTimeQuery"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="请选择时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="订单状态：">
            <el-select v-model="listQuery.ordersStatus" class="input-width" placeholder="全部" clearable>
              <el-option v-for="item in statusOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="支付方式：">
            <el-select v-model="listQuery.payType" class="input-width" placeholder="全部" clearable>
              <el-option v-for="item in payTypeOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="订单来源：">
            <el-select v-model="listQuery.sourceType" class="input-width" placeholder="全部" clearable>
              <el-option v-for="item in sourceTypeOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
    </el-card>
    <div class="table-container">
      <el-table ref="ordersTable"
                :data="list"
                style="width: 100%;"
                @selection-change="handleSelectionChange"
                v-loading="listLoading" border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="编号" width="80" align="center">
          <template slot-scope="scope">{{scope.row.ordersId}}</template>
        </el-table-column>
        <el-table-column label="提交时间" width="180" align="center">
          <template slot-scope="scope">{{scope.row.createTime | formatCreateTime}}</template>
        </el-table-column>
        <el-table-column label="用户账号" align="center">
          <template slot-scope="scope">{{scope.row.loginCode}}</template>
        </el-table-column>
        <el-table-column label="收货人" align="center">
          <template slot-scope="scope">{{scope.row.receiverName}}</template>
        </el-table-column>
        <el-table-column label="订单金额" width="120" align="center">
          <template slot-scope="scope">￥{{scope.row.totalPrice}}</template>
        </el-table-column>
        <el-table-column label="支付方式" width="120" align="center">
          <template slot-scope="scope">{{scope.row.payType | formatPayType}}</template>
        </el-table-column>
        <el-table-column label="订单来源" width="120" align="center">
          <template slot-scope="scope">{{scope.row.sourceType | formatSourceType}}</template>
        </el-table-column>
        <el-table-column label="订单状态" width="120" align="center">
          <template slot-scope="scope">{{scope.row.ordersStatus | formatStatus}}</template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleViewOrder(scope.$index, scope.row)"
            >查看订单</el-button>
            <el-button
              size="mini"
              @click="handleCloseOrder(scope.$index, scope.row)"
              v-show="scope.row.ordersStatus==0"
              :disabled="updateAuthority">关闭订单</el-button>
            <el-button
              size="mini"
              @click="handleDeliveryOrder(scope.$index, scope.row)"
              v-show="scope.row.ordersStatus==1"
              :disabled="updateAuthority">订单发货</el-button>
            <el-button
              size="mini"
              @click="handleViewLogistics(scope.$index, scope.row)"
              v-show="scope.row.ordersStatus==2||scope.row.ordersStatus==3"
              :disabled="updateAuthority">订单跟踪</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDeleteOrder(scope.$index, scope.row)"
              v-show="scope.row.ordersStatus==4"
              :disabled="updateAuthority">删除订单</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="batch-operate-container">
      <el-select
        size="small"
        v-model="operateType" placeholder="批量操作">
        <el-option
          v-for="item in operateOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button
        style="margin-left: 20px"
        class="search-button"
        @click="handleBatchOperate()"
        type="primary"
        size="small"
        :disabled="updateAuthority">
        确定
      </el-button>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :current-page.sync="listQuery.pageNum"
        :page-size="listQuery.pageSize"
        :page-sizes="[5,10,15]"
        :total="total">
      </el-pagination>
    </div>
    <el-dialog
      title="关闭待付款订单"
      :visible.sync="closeOrders.dialogVisible" width="30%">
      <span style="vertical-align: top">操作备注：</span>
      <el-input
        style="width: 80%"
        type="textarea"
        :rows="5"
        placeholder="请输入内容"
        v-model="closeOrders.remark">
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeOrders.dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleCloseOrderConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <logistics-dialog v-model="logisticsDialogVisible"></logistics-dialog>
  </div>
</template>
<script>
  import {getPage, deleteOrders, closeOrdersList} from '@/mall-api/orders/orders'
  import {formatDate} from '@/utils/date';
  import LogisticsDialog from '@/views/oms/order/components/logisticsDialog';
  import auth from '@/utils/auth'

  const defaultListQuery = {
    pageNum: 1,
    pageSize: 10,
    ordersId: null,
    receiverName: null,
    ordersStatus: null,
    payType: null,
    sourceType: null,
    createTimeQuery: null,
  };
  export default {
    name: "orderList",
    components:{LogisticsDialog},
    data() {
      return {
        listQuery: Object.assign({}, defaultListQuery),
        listLoading: true,
        list: null,
        total: null,
        operateType: null,
        multipleSelection: [],
        closeOrders:{
          dialogVisible:false,
          remark:null,
          ordersId:[]
        },
        statusOptions: [
          {
            label: '待付款',
            value: 0
          },
          {
            label: '待发货',
            value: 1
          },
          {
            label: '已发货',
            value: 2
          },
          {
            label: '已完成',
            value: 3
          },
          {
            label: '已关闭',
            value: 4
          }
        ],
        payTypeOptions: [
          {
            label: '未支付',
            value: 0
          },
          {
            label: '支付宝',
            value: 1
          },
          {
            label: '微信',
            value: 2
          }
        ],
        sourceTypeOptions: [
          {
            label: 'PC订单',
            value: 0
          },
          {
            label: 'APP订单',
            value: 1
          }
        ],
        operateOptions: [
          {
            label: "批量发货",
            value: 1
          },
          {
            label: "关闭订单",
            value: 2
          },
          {
            label: "删除订单",
            value: 3
          }
        ],
        logisticsDialogVisible:false,
        addAuthority:true,
        updateAuthority:true,
        deleteAuthority:true,
      }
    },
    created() {
      this.getPage();
      this.checkButtonAuthority();
    },
    filters: {
      formatCreateTime(time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      },
      formatPayType(value) {
        if (value == 1) {
          return '支付宝';
        } else if (value == 2) {
          return '微信';
        } else {
          return '未支付';
        }
      },
      formatSourceType(value) {
        if (value == 1) {
          return 'APP订单';
        } else {
          return 'PC订单';
        }
      },
      formatStatus(value) {
        if (value == 1) {
          return '待发货';
        } else if (value == 2) {
          return '已发货';
        } else if (value == 3) {
          return '已完成';
        } else if (value == 4) {
          return '已关闭';
        } else if (value == 5) {
          return '已评价';
        } else if (value == 6) {
          return '无效订单';
        } else {
          return '待付款';
        }
      },
    },
    methods: {
      handleResetSearch() {
        this.listQuery = Object.assign({}, defaultListQuery);
      },
      handleSearchList() {
        this.listQuery.pageNum = 1;
        this.getPage();
      },
      handleSelectionChange(val){
        this.multipleSelection = val;
      },
      handleViewOrder(index, row){

        this.$router.push({path:'/oms/orderDetail',query:{id:row.ordersId}})
      },
      handleCloseOrder(index, row){
        this.closeOrders.dialogVisible=true;
        this.closeOrders.ordersId=[row.ordersId];
      },
      handleDeliveryOrder(index, row){
        let listItem = this.covertOrders(row);
        this.$router.push({path:'/oms/deliverOrdersList',query:{list:[listItem]}})
      },
      handleViewLogistics(index, row){
        this.logisticsDialogVisible=true;
      },
      handleDeleteOrder(index, row){
        let ids=[];
        ids.push(row.ordersId);
        this.deleteOrders(ids);
      },
      handleBatchOperate(){
        if(this.multipleSelection==null||this.multipleSelection.length<1){
          this.$message({
            message: '请选择要操作的订单',
            type: 'warning',
            duration: 1000
          });
          return;
        }
        if(this.operateType==1){
          //批量发货
          let list=[];
          for(let i=0;i<this.multipleSelection.length;i++){
            if(this.multipleSelection[i].ordersStatus==1){
              list.push(this.covertOrders(this.multipleSelection[i]));
            }
          }
          if(list.length==0){
            this.$message({
              message: '选中订单中没有可以发货的订单',
              type: 'warning',
              duration: 1000
            });
            return;
          }
          this.$router.push({path:'/oms/deliverOrderList',query:{list:list}})
        }else if(this.operateType==2){
          //关闭订单,只能关闭带付款的订单
          this.closeOrders.ordersId=[];
          for(let i=0;i<this.multipleSelection.length;i++){
            if(this.multipleSelection[i].ordersStatus != 0){
              continue;
            }
            this.closeOrders.ordersId.push(this.multipleSelection[i].ordersId);
          }
          if(!this.closeOrders.ordersId || this.closeOrders.ordersId.length == 0){
            this.$message({
              message: '选中订单中没有可以关闭的订单',
              type: 'warning',
              duration: 1000
            });
            return;
          }
          this.closeOrders.dialogVisible=true;
        }else if(this.operateType==3){
          //删除订单,只能删除已关闭订单
          let ids=[];
          for(let i=0;i<this.multipleSelection.length;i++){
            if(this.multipleSelection[i].ordersStatus != 4){
              continue;
            }
            ids.push(this.multipleSelection[i].ordersId);
          }
          this.deleteOrders(ids);
        }
      },
      handleSizeChange(val){
        this.listQuery.pageNum = 1;
        this.listQuery.pageSize = val;
        this.getPage();
      },
      handleCurrentChange(val){
        this.listQuery.pageNum = val;
        this.getPage();
      },
      handleCloseOrderConfirm() {
        if (this.closeOrders.remark == null || this.closeOrders.remark == '') {
          this.$message({
            message: '操作备注不能为空',
            type: 'warning',
            duration: 1000
          });
          return;
        }
        let params = new URLSearchParams();
        params.append('ids', this.closeOrders.ordersId);
        params.append('remark', this.closeOrders.remark);
        closeOrdersList(params).then(response=>{
          this.closeOrders.ordersId=[];
          this.closeOrders.dialogVisible=false;
          this.getPage();
          this.$message({
            message: '修改成功',
            type: 'success',
            duration: 1000
          });
        });
      },
      getPage() {
        this.listLoading = true;
        getPage(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data.list;
          this.total = response.data.total;
        });
      },
      deleteOrders(ids){
        this.$confirm('是否要进行该删除操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = new URLSearchParams();
          params.append("ids",ids);
          deleteOrders(params).then(response=>{
            this.$message({
              message: '删除成功！',
              type: 'success',
              duration: 1000
            });
            this.getPage();
          });
        })
      },
      covertOrder(order){
        let address=order.receiverProvince+order.receiverCity+order.receiverRegion+order.receiverDetailAddress;
        let listItem={
          orderId:order.ordersId,
          ordersId:order.ordersId,
          receiverName:order.receiverName,
          receiverPhone:order.receiverPhone,
          receiverPostCode:order.receiverPostCode,
          address:address,
          deliveryCompany:null,
          deliverySn:null
        };
        return listItem;
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
    }
  }
</script>
<style scoped>
  .input-width {
    width: 203px;
  }
</style>


