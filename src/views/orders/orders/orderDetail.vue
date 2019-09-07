<template> 
  <div class="detail-container">
    <div>
      <el-steps :active="formatStepStatus(order.ordersStatus)" finish-ordersStatus="success" align-center>
        <el-step title="提交订单" :description="formatTime(order.createTime)"></el-step>
        <el-step title="支付订单" :description="formatTime(order.paymentTime)"></el-step>
        <el-step title="平台发货" :description="formatTime(order.deliveryTime)"></el-step>
        <el-step title="确认收货" :description="formatTime(order.receiveTime)"></el-step>
        <el-step title="完成评价" :description="formatTime(order.commentTime)"></el-step>
      </el-steps>
    </div>
    <el-card shadow="never" style="margin-top: 15px">
      <div class="operate-container">
        <i class="el-icon-warning color-danger" style="margin-left: 20px"></i>
        <span class="color-danger">当前订单状态：{{order.ordersStatus | formatStatus}}</span>
        <div class="operate-button-container" v-show="order.ordersStatus==0">
          <el-button size="mini" @click="showUpdateReceiverDialog" :disabled="updateAuthority">修改收货人信息</el-button>
          <el-button size="mini" @click="showUpdateMoneyDialog" :disabled="updateAuthority">修改费用信息</el-button>
          <el-button size="mini" @click="showCloseOrderDialog" :disabled="updateAuthority">关闭订单</el-button>
          <el-button size="mini" @click="showRemarkOrderDialog" :disabled="updateAuthority">备注订单</el-button>
        </div>
        <div class="operate-button-container" v-show="order.ordersStatus==1">
          <el-button size="mini" @click="showUpdateReceiverDialog" :disabled="updateAuthority">修改收货人信息</el-button>
          <el-button size="mini" @click="showRemarkOrderDialog" :disabled="updateAuthority">备注订单</el-button>
        </div>
        <div class="operate-button-container" v-show="order.ordersStatus==2||order.ordersStatus==3">
          <el-button size="mini" @click="showRemarkOrderDialog" :disabled="updateAuthority">备注订单</el-button>
        </div>
        <div class="operate-button-container" v-show="order.ordersStatus==4">
          <el-button size="mini" @click="handleDeleteOrder" :disabled="deleteAuthority">删除订单</el-button>
          <el-button size="mini" @click="showRemarkOrderDialog" :disabled="updateAuthority">备注订单</el-button>
        </div>
      </div>
      <div class="operate-container" style="margin-top: 10px">
        <i class="el-icon-message" style="margin-left: 20px; color: #409EFF"></i>
        <span style="color: #409EFF">当前订单备注：{{order.ordersRemark}}</span>
      </div>
      <div style="margin-top: 20px">
        <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
        <span class="font-small">基本信息</span>
      </div>
      <div class="table-layout">
        <el-row>
          <el-col :span="4" class="table-cell-title">订单编号</el-col>
          <el-col :span="4" class="table-cell-title">发货单流水号</el-col>
          <el-col :span="4" class="table-cell-title">用户账号</el-col>
          <el-col :span="4" class="table-cell-title">支付方式</el-col>
          <el-col :span="4" class="table-cell-title">订单来源</el-col>
        </el-row>
        <el-row>
          <el-col :span="4" class="table-cell">{{order.ordersId}}</el-col>
          <el-col :span="4" class="table-cell">暂无</el-col>
          <el-col :span="4" class="table-cell">{{order.loginCode}}</el-col>
          <el-col :span="4" class="table-cell">{{order.payType | formatPayType}}</el-col>
          <el-col :span="4" class="table-cell">{{order.sourceType | formatSourceType}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4" class="table-cell-title">配送方式</el-col>
          <el-col :span="4" class="table-cell-title">物流单号</el-col>
          <el-col :span="4" class="table-cell-title">自动确认收货时间</el-col>
          <el-col :span="4" class="table-cell-title">订单可得积分</el-col>
          <el-col :span="4" class="table-cell-title">订单可得成长值</el-col>
        </el-row>
        <el-row>
          <el-col :span="4" class="table-cell">{{order.deliveryCompany | formatNull}}</el-col>
          <el-col :span="4" class="table-cell">{{order.deliveryCode | formatNull}}</el-col>
          <el-col :span="4" class="table-cell">{{order.autoConfirmDay}}天</el-col>
          <el-col :span="4" class="table-cell">{{order.score}}</el-col>
          <el-col :span="4" class="table-cell">{{order.growth}}</el-col>
        </el-row>
      </div>
      <div style="margin-top: 20px">
        <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
        <span class="font-small">收货人信息</span>
      </div>
      <div class="table-layout">
        <el-row>
          <el-col :span="4" class="table-cell-title">收货人</el-col>
          <el-col :span="4" class="table-cell-title">手机号码</el-col>
          <el-col :span="4" class="table-cell-title">邮政编码</el-col>
          <el-col :span="12" class="table-cell-title">收货地址</el-col>
        </el-row>
        <el-row>
          <el-col :span="4" class="table-cell">{{order.receiverName}}</el-col>
          <el-col :span="4" class="table-cell">{{order.receiverPhone}}</el-col>
          <el-col :span="4" class="table-cell">{{order.receiverPostCode}}</el-col>
          <el-col :span="12" class="table-cell">{{order | formatAddress}}</el-col>
        </el-row>
      </div>
      <div style="margin-top: 20px">
        <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
        <span class="font-small">商品信息</span>
      </div>
      <el-table
        ref="orderItemsTable"
        :data="order.ordersItems"
        style="width: 100%;margin-top: 20px" border>
        <el-table-column label="商品图片" width="120" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.picUrl" style="height: 80px">
          </template>
        </el-table-column>
        <el-table-column label="商品名称" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.productName}}</p>
          </template>
        </el-table-column>
        <el-table-column label="价格" width="120" align="center">
          <template slot-scope="scope">
            <p>价格：￥{{scope.row.productPrice}}</p>
          </template>
        </el-table-column>
        <el-table-column label="属性" width="120" align="center">
          <template slot-scope="scope">
            {{scope.row.productProperty}}
          </template>
        </el-table-column>
        <el-table-column label="数量" width="120" align="center">
          <template slot-scope="scope">
            {{scope.row.productAmount}}
          </template>
        </el-table-column>
        <el-table-column label="小计" width="120" align="center">
          <template slot-scope="scope">
            ￥{{scope.row.productPrice*scope.row.productAmount}}
          </template>
        </el-table-column>
      </el-table>
      <div style="float: right;margin: 20px">
        合计：<span class="color-danger">￥{{order.totalAmount}}</span>
      </div>
      <div style="margin-top: 60px">
        <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
        <span class="font-small">费用信息</span>
      </div>
      <div class="table-layout">
        <el-row>
          <el-col :span="6" class="table-cell-title">商品总价</el-col>
          <el-col :span="6" class="table-cell-title">运费</el-col>
          <el-col :span="6" class="table-cell-title">优惠券</el-col>
          <el-col :span="6" class="table-cell-title">是否付款</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell">￥{{order.totalPrice}}</el-col>
          <el-col :span="6" class="table-cell">￥{{order.freightPrice}}</el-col>
          <el-col :span="6" class="table-cell">-￥{{order.couponPrice}}</el-col>
          <el-col :span="6" class="table-cell">{{order.ordersStatus | isPay}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell-title">积分抵扣</el-col>
          <el-col :span="6" class="table-cell-title">活动抵扣金额</el-col>
          <el-col :span="6" class="table-cell-title">管理员折扣金额</el-col>
          <el-col :span="6" class="table-cell-title">应付款金额</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell">-￥{{order.scorePrice}}</el-col>
          <el-col :span="6" class="table-cell">-￥{{order.promotionPrice}}</el-col>
          <el-col :span="6" class="table-cell">-￥{{order.discountPrice}}</el-col>
          <el-col :span="6" class="table-cell">
            <span class="color-danger">￥{{order.payPrice}}</span>
          </el-col>
        </el-row>
      </div>
      <div style="margin-top: 20px">
        <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
        <span class="font-small">操作信息</span>
      </div>
      <el-table style="margin-top: 20px;width: 100%"
                ref="ordersOperationLog"
                :data="order.ordersOperationLog" border>
        <el-table-column label="操作者"  width="120" align="center">
          <template slot-scope="scope">
            {{scope.row.name}}
          </template>
        </el-table-column>
        <el-table-column label="操作时间"  width="160" align="center">
          <template slot-scope="scope">
            {{formatTime(scope.row.createTime)}}
          </template>
        </el-table-column>
        <el-table-column label="订单状态"  width="120" align="center">
          <template slot-scope="scope">
            {{scope.row.ordersStatus | formatStatus}}
          </template>
        </el-table-column>
        <el-table-column label="付款状态"  width="120" align="center">
          <template slot-scope="scope">
            {{scope.row.ordersStatus | formatPayStatus}}
          </template>
        </el-table-column>
        <el-table-column label="发货状态"  width="120" align="center">
          <template slot-scope="scope">
            {{scope.row.ordersStatus | formatDeliverStatus}}
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center">
          <template slot-scope="scope">
            {{scope.row.remark}}
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog title="修改收货人信息"
               :visible.sync="receiverDialogVisible"
               width="40%">
      <el-form :model="receiverInfo"
               ref="receiverInfoForm"
               label-width="150px">
        <el-form-item label="收货人姓名：">
          <el-input v-model="receiverInfo.receiverName" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="手机号码：">
          <el-input v-model="receiverInfo.receiverPhone" style="width: 200px">
          </el-input>
        </el-form-item>
        <el-form-item label="邮政编码：">
          <el-input v-model="receiverInfo.receiverPostCode" style="width: 200px">
          </el-input>
        </el-form-item>
        <el-form-item label="所在区域：">
          <v-distpicker :province="receiverInfo.receiverProvince"
                        :city="receiverInfo.receiverCity"
                        :area="receiverInfo.receiverRegion"
                        @selected="onSelectRegion"></v-distpicker>
        </el-form-item>
        <el-form-item label="详细地址：">
          <el-input v-model="receiverInfo.receiverDetailAddress" type="textarea" rows="3">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button @click="receiverDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleUpdateReceiverInfo">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改费用信息"
               :visible.sync="moneyDialogVisible"
               width="40%">
      <div class="table-layout">
        <el-row>
          <el-col :span="6" class="table-cell-title">商品合计</el-col>
          <el-col :span="6" class="table-cell-title">运费</el-col>
          <el-col :span="6" class="table-cell-title">活动抵扣</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell">￥{{order.totalPrice}}</el-col>
          <el-col :span="6" class="table-cell">￥{{order.freightPrice}}</el-col>
          <el-col :span="6" class="table-cell">-￥{{order.promotionPrice}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell-title">积分抵扣</el-col>
          <el-col :span="6" class="table-cell-title">优惠券抵扣</el-col>
          <el-col :span="6" class="table-cell-title">后台设置</el-col>
          <el-col :span="6" class="table-cell-title">应付款金额</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell">-￥{{order.scorePrice}}</el-col>
          <el-col :span="6" class="table-cell">-￥{{order.couponPrice}}</el-col>
          <el-col :span="6" class="table-cell">
            <el-input v-model.number="moneyInfo.discountPrice" size="mini"><template slot="prepend">-￥</template></el-input>
          </el-col>
          <el-col :span="6" class="table-cell">
            <span class="color-danger">￥{{order.totalPrice + order.freightPrice - order.promotionPrice - order.scorePrice - order.couponPrice - moneyInfo.discountPrice}}</span>
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
      <el-button @click="moneyDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleUpdateMoneyInfo">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="关闭订单"
               :visible.sync="closeDialogVisible"
               width="40%">
      <el-form :model="closeInfo"
               label-width="150px">
        <el-form-item label="操作备注：">
          <el-input v-model="closeInfo.remark" type="textarea" rows="3">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleCloseOrder">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="备注订单"
               :visible.sync="markOrderDialogVisible"
               width="40%">
      <el-form :model="remarkInfo"
               label-width="150px">
        <el-form-item label="操作备注：">
          <el-input v-model="remarkInfo.remark" type="textarea" rows="3">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="markOrderDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleRemarkOrder">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import {getOrdersDetail,updateReceiverInfo, updateMoneyInfo, updateRemarkInfo, closeOrders, deleteOrders} from '@/mall-api/orders/orders';
  import LogisticsDialog from '@/views/oms/order/components/logisticsDialog';
  import {formatDate} from '@/utils/date';
  import VDistpicker from 'v-distpicker';
  import auth from '@/utils/auth'

  const defaultReceiverInfo = {
    ordersId:null,
    receiverName:null,
    receiverPhone:null,
    receiverPostCode:null,
    receiverDetailAddress:null,
    receiverProvince:null,
    receiverCity:null,
    receiverRegion:null,
    ordersStatus:null
  };
  export default {
    name: 'orderDetail',
    components: { VDistpicker, LogisticsDialog},
    data() {
      return {
        id: null,
        order: {},
        //修改收货人信息dialog
        receiverDialogVisible:false,
        //收货人信息
        receiverInfo:Object.assign({},defaultReceiverInfo),
        //修改费用信息
        moneyDialogVisible:false,
        moneyInfo:{ordersId:null, discountPrice:0,ordersStatus:null},
        //关闭订单
        closeDialogVisible:false,
        closeInfo:{remark:null,id:null},
        //订单备注
        markOrderDialogVisible:false,
        remarkInfo:{remark:null},
        addAuthority:true,
        updateAuthority:true,
        deleteAuthority:true,
      }
    },
    created() {
      this.id = this.$route.query.id;
      getOrdersDetail(this.id).then(response => {
        this.order = response.data;
      });
      this.checkButtonAuthority();
    },
    filters: {
      isPay(value){
        if(value > 0){
          return '已付款';
        }else{
          return '未付款';
        }
      },
      formatNull(value) {
        if(value===undefined||value===null||value===''){
          return '暂无';
        }else{
          return value;
        }
      },
      formatLongText(value) {
        if(value==undefined||value==null||value==''){
          return '暂无';
        }else if(value.length>8){
          return value.substr(0, 8) + '...';
        }else{
          return value;
        }
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
      formatOrderType(value) {
        if (value == 1) {
          return '秒杀订单';
        } else {
          return '正常订单';
        }
      },
      formatAddress(order) {
        let str = order.receiverProvince;
        if (order.receiverCity != null) {
          str += "  " + order.receiverCity;
        }
        str += "  " + order.receiverRegion;
        str += "  " + order.receiverDetailAddress;
        return str;
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
          return '完成评价';
        } else if (value == 6) {
          return '无效订单';
        } else {
          return '待付款';
        }
      },
      formatPayStatus(value) {
        if (value == 0) {
          return '未支付';
        } else if(value==4){
          return '已退款';
        }else{
          return '已支付';
        }
      },
      formatDeliverStatus(value) {
        if (value == 0||value == 1) {
          return '未发货';
        } else {
          return '已发货';
        }
      },
    },
    methods: {
      onSelectRegion(data){
        this.receiverInfo.receiverProvince=data.province.value;
        this.receiverInfo.receiverCity=data.city.value;
        this.receiverInfo.receiverRegion=data.area.value;
      },
      formatTime(time) {
        if (time == null || time === '') {
          return '';
        }
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      },
      formatStepStatus(value) {
        if (value == 1) {
          //待发货
          return 2;
        } else if (value == 2) {
          //已发货
          return 3;
        } else if (value == 3) {
          //已完成（已收货）
          return 4;
        }else {
          //待付款、已关闭、无效订单
          return 1;
        }
      },
      showUpdateReceiverDialog(){
        this.receiverDialogVisible=true;
        this.receiverInfo={
          ordersId:this.order.ordersId,
          receiverName:this.order.receiverName,
          receiverPhone:this.order.receiverPhone,
          receiverPostCode:this.order.receiverPostCode,
          receiverDetailAddress:this.order.receiverDetailAddress,
          receiverProvince:this.order.receiverProvince,
          receiverCity:this.order.receiverCity,
          receiverRegion:this.order.receiverRegion,
          ordersStatus:this.order.ordersStatus
        }
      },
      handleUpdateReceiverInfo(){
        this.$confirm('是否要修改收货信息?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          updateReceiverInfo(this.receiverInfo).then(response=>{
            this.receiverDialogVisible=false;
            this.$message({
              type: 'success',
              message: '修改成功!'
            });
            getOrdersDetail(this.id).then(response => {
              this.order = response.data;
            });
          });
        });
      },
      //修改费用信息
      showUpdateMoneyDialog(){
        this.moneyDialogVisible=true;
        this.moneyInfo.ordersId=this.order.ordersId;
        this.moneyInfo.discountPrice=this.order.discountPrice;
        this.moneyInfo.ordersStatus=this.order.ordersStatus;
      },
      handleUpdateMoneyInfo(){
        this.$confirm('是否要修改费用信息?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          updateMoneyInfo(this.moneyInfo).then(response=>{
            this.moneyDialogVisible=false;
            this.$message({
              type: 'success',
              message: '修改成功!'
            });
            getOrdersDetail(this.id).then(response => {
              this.order = response.data;
            });
          });
        });
      },
      //关闭订单
      showCloseOrderDialog(){
        this.closeDialogVisible=true;
        this.closeInfo.remark=null;
        this.closeInfo.id=this.id;
      },
      handleCloseOrder(){
        this.$confirm('是否要关闭?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            let params = new URLSearchParams();
            params.append("ordersId",this.closeInfo.id);
            params.append("ordersRemark",this.closeInfo.remark);
            closeOrders(params).then(response=>{
              this.closeDialogVisible=false;
              this.$message({
                type: 'success',
                message: '订单关闭成功!'
              });
              getOrdersDetail(this.id).then(response => {
                this.order = response.data;
              });
            });
        });
      },
      //显示修改订单备注dialog
      showRemarkOrderDialog(){
        this.markOrderDialogVisible=true;
        this.remarkInfo.ordersId=this.id;
        this.remarkInfo.remark=null;
      },
      handleRemarkOrder(){
        this.$confirm('是否要备注订单?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = new URLSearchParams();
          params.append("ordersId",this.remarkInfo.ordersId);
          params.append("ordersRemark",this.remarkInfo.remark);
          params.append("ordersStatus",this.order.ordersStatus);
          updateRemarkInfo(params).then(response=>{
            this.markOrderDialogVisible=false;
            this.$message({
              type: 'success',
              message: '订单备注成功!'
            });
            getOrdersDetail(this.id).then(response => {
              this.order = response.data;
            });
          });
        });
      },
      /**
       *
       */
      handleDeleteOrder(){
        this.$confirm('是否要进行该删除操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = new URLSearchParams();
          params.append("ids",[this.id]);
          deleteOrders(params).then(response=>{
            this.$message({
              message: '删除成功！',
              type: 'success',
              duration: 1000
            });
            this.$router.back();
          });
        })
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
  .detail-container {
    width: 80%;
    padding: 20px 20px 20px 20px;
    margin: 20px auto;
  }

  .operate-container {
    background: #F2F6FC;
    height: 80px;
    margin: -20px -20px 0;
    line-height: 80px;
  }

  .operate-button-container {
    float: right;
    margin-right: 20px
  }

  .table-layout {
    margin-top: 20px;
    border-left: 1px solid #DCDFE6;
    border-top: 1px solid #DCDFE6;
  }

  .table-cell {
    height: 60px;
    line-height: 40px;
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    padding: 10px;
    font-size: 14px;
    color: #606266;
    text-align: center;
    overflow: hidden;
  }

  .table-cell-title {
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    padding: 10px;
    background: #F2F6FC;
    text-align: center;
    font-size: 14px;
    color: #303133;
  }
</style>


