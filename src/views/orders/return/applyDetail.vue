<template>
  <div class="detail-container">
    <el-card shadow="never">
      <span class="font-title-medium">退货商品</span>
      <el-table
        border
        class="standard-margin"
        ref="productTable"
        :data="productList">
        <el-table-column label="商品图片" width="160" align="center">
          <template slot-scope="scope">
            <img style="height:80px" :src="scope.row.picUrl">
          </template>
        </el-table-column>
        <el-table-column label="商品名称" align="center">
          <template slot-scope="scope">
            <span class="font-small">{{scope.row.productName}}</span><br>
          </template>
        </el-table-column>
        <el-table-column label="价格" width="180" align="center">
          <template slot-scope="scope">
            <span class="font-small">￥{{scope.row.productPrice}}</span><br>
          </template>
        </el-table-column>
        <el-table-column label="属性" width="180" align="center">
          <template slot-scope="scope">{{scope.row.productPropertyLabel}}</template>
        </el-table-column>
        <el-table-column label="数量" width="100" align="center">
          <template slot-scope="scope">{{scope.row.returnAmount}}</template>
        </el-table-column>
        <el-table-column label="小计" width="100" align="center">
          <template slot-scope="scope">￥{{scope.row.returnAmount * scope.row.productPrice}}</template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-card shadow="never" class="standard-margin">
      <span class="font-title-medium">服务单信息</span>
      <div class="form-container-border">
        <el-row>
          <el-col :span="6" class="form-border form-left-bg font-small">服务单号</el-col>
          <el-col class="form-border font-small" :span="18">{{ordersReturnApply.applyId}}</el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6">申请状态</el-col>
          <el-col class="form-border font-small color-danger" :span="18">{{ordersReturnApply.returnStatus | formatStatus}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="form-border form-left-bg font-small" style="height:50px;line-height:30px">订单编号
          </el-col>
          <el-col class="form-border font-small" :span="18" style="height:50px">
            {{ordersReturnApply.ordersId}}
            <el-button size="small" @click="handleViewOrder">查看</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6">申请时间</el-col>
          <el-col class="form-border font-small" :span="18">{{ordersReturnApply.createTime | formatTime}}</el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6">用户账号</el-col>
          <el-col class="form-border font-small" :span="18">{{ordersReturnApply.loginCode}}</el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6">问题描述</el-col>
          <el-col class="form-border font-small" :span="18">{{ordersReturnApply.returnReason}}</el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6" style="height:100px;line-height:80px">凭证图片
          </el-col>
          <el-col class="form-border font-small" :span="18" style="height:100px">
            <img v-for="item in returnPic" style="width:80px;height:80px" :src="item">
          </el-col>
        </el-row>
      </div>
      <div class="form-container-border">
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6">订单金额</el-col>
          <el-col class="form-border font-small" :span="18">￥{{ordersReturnApply.returnPrice}}</el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6" style="height:52px;line-height:32px">确认退款金额
          </el-col>
          <el-col class="form-border font-small" style="height:52px" :span="18">
            ￥
            <el-input size="small" v-model="updateStatusParam.realReturnPrice"
                      :disabled="ordersReturnApply.returnStatus!=0"
                      style="width:200px;margin-left: 10px"></el-input>
          </el-col>
        </el-row>
        <div v-show="ordersReturnApply.returnStatus!=3">
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6" style="height:52px;line-height:32px">选择收货点
          </el-col>
          <el-col class="form-border font-small" style="height:52px" :span="18">
            <el-select size="small"
                       style="width:200px"
                       :disabled="ordersReturnApply.returnStatus!=0"
                       v-model="updateStatusParam.addressId">
              <el-option v-for="address in companyAddressList"
                         :key="address.addressId"
                         :value="address.addressId"
                         :label="address.addressName">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6">收货人姓名</el-col>
          <el-col class="form-border font-small" :span="18">{{currentAddress.name}}</el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6">所在区域</el-col>
          <el-col class="form-border font-small" :span="18">{{currentAddress | formatRegion}}</el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6">详细地址</el-col>
          <el-col class="form-border font-small" :span="18">{{currentAddress.detailAddress}}</el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6">联系电话</el-col>
          <el-col class="form-border font-small" :span="18">{{currentAddress.phone}}</el-col>
        </el-row>
        </div>
      </div>
      <div class="form-container-border" v-show="ordersReturnApply.returnStatus!=0">
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6">处理人员</el-col>
          <el-col class="form-border font-small" :span="18">{{ordersReturnApply.handlePersonName}}</el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6">处理时间</el-col>
          <el-col class="form-border font-small" :span="18">{{ordersReturnApply.handleTime | formatTime}}</el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6">处理备注</el-col>
          <el-col class="form-border font-small" :span="18">{{ordersReturnApply.handleRemark}}</el-col>
        </el-row>
      </div>
      <div class="form-container-border" v-show="ordersReturnApply.returnStatus==2">
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6">收货人员</el-col>
          <el-col class="form-border font-small" :span="18">{{ordersReturnApply.receivePersonName}}</el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6" >收货时间</el-col>
          <el-col class="form-border font-small" :span="18">{{ordersReturnApply.receiveTime | formatTime}}</el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6">收货备注</el-col>
          <el-col class="form-border font-small" :span="18">{{ordersReturnApply.receiveRemark}}</el-col>
        </el-row>
      </div>
      <div class="form-container-border" v-show="ordersReturnApply.returnStatus==0">
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6" style="height:52px;line-height:32px">处理备注</el-col>
          <el-col class="form-border font-small" :span="18">
            <el-input  size="small" v-model="updateStatusParam.handleRemark" style="width:200px;margin-left: 10px"></el-input>
          </el-col>
        </el-row>
      </div>
      <div class="form-container-border" v-show="ordersReturnApply.returnStatus==1">
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6" style="height:52px;line-height:32px">收货备注</el-col>
          <el-col class="form-border font-small" :span="18">
            <el-input  size="small" v-model="updateStatusParam.receiveRemark" style="width:200px;margin-left: 10px"></el-input>
          </el-col>
        </el-row>
      </div>
      <div style="margin-top:15px;text-align: center" v-show="ordersReturnApply.returnStatus==0">
        <el-button type="primary" size="small" @click="handleUpdateStatus(1)">确认退货</el-button>
        <el-button type="danger" size="small" @click="handleUpdateStatus(3)">拒绝退货</el-button>
      </div>
      <div style="margin-top:15px;text-align: center" v-show="ordersReturnApply.returnStatus==1">
        <el-button type="primary" size="small" @click="handleUpdateStatus(2)">确认收货</el-button>
      </div>
    </el-card>
  </div>
</template>
<script>
  import {getApplyById,updateApplyStatus} from '@/mall-api/orders/returnApply';
  import {getCompanyAddressList} from '@/mall-api/product/companyAddress';
  import {formatDate} from '@/utils/date';

  const defaultUpdateStatusParam = {
    addressId: null,
    handlePerson: '',
    handleRemark: null,
    receivePerson: '',
    receiveRemark: null,
    realReturnPrice: 0,
    returnStatus: 0
  };
  const defaultOrdersReturnApply = {
    applyId: null,
    ordersId: null,
    addressId: null,
    productId: null,
    createTime: null,
    loginCode: null,
    returnPrice: null,
    returnStatus: null,
    handleTime: null,
    reason: null,
    returnReason: null,
    returnPic: null,
    handleRemark: null,
    handlePerson: null,
    receivePerson: null,
    receiveTime: null,
    receiveRemark: null
  };
  export default {
    name: 'returnApplyDetail',
    data() {
      return {
        id: null,
        ordersReturnApply: Object.assign({},defaultOrdersReturnApply),
        productList: null,
        returnPic: null,
        updateStatusParam: Object.assign({}, defaultUpdateStatusParam),
        companyAddressList:null
      }
    },
    created() {
      this.id = this.$route.query.id;
      this.getDetail();
    },
    computed: {
      currentAddress() {
        console.log("currentAddress()");
        let addressId = this.updateStatusParam.addressId;
        if(this.companyAddressList==null)return [];
        for (let i = 0; i < this.companyAddressList.length; i++) {
          let address = this.companyAddressList[i];
          if (address.addressId == addressId) {
            return address;
          }
        }
        return null;
      }
    },
    filters: {
      formatStatus(returnStatus) {
        if (returnStatus == 0) {
          return "待处理";
        } else if (returnStatus == 1) {
          return "退货中";
        } else if (returnStatus == 2) {
          return "已完成";
        } else {
          return "已拒绝";
        }
      },
      formatTime(time) {
        if (time == null || time == '') {
          return 'N/A';
        }
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      },
      formatRegion(address) {
        let str = address.province;
        if (address.city != null) {
          str += "  " + address.city;
        }
        str += "  " + address.region;
        return str;
      }
    },
    methods: {
      handleViewOrder(){
        this.$router.push({path:'/oms/orderDetail',query:{id:this.ordersReturnApply.ordersId}});
      },
      getDetail() {
        getApplyById(this.id).then(response => {
          this.ordersReturnApply = response.data;
          this.productList = [];
          this.productList.push(this.ordersReturnApply);
          if (this.ordersReturnApply.returnPic != null) {
            this.returnPic = this.ordersReturnApply.returnPic.split(",")
          }
          //退货中和完成
          if(this.ordersReturnApply.returnStatus==1||this.ordersReturnApply.returnStatus==2){
            this.updateStatusParam.realReturnPrice=this.ordersReturnApply.realReturnPrice;
            this.updateStatusParam.addressId=this.ordersReturnApply.addressId;
          }
          this.getCompanyAddressList();
        });
      },
      //获取公司收货地址列表
      getCompanyAddressList() {
        getCompanyAddressList().then(response => {
          this.companyAddressList = response.data;
          for (let i = 0; i < this.companyAddressList.length; i++) {
            if (this.companyAddressList[i].isSend == 0) {
              this.updateStatusParam.addressId = this.companyAddressList[i].addressId;
            }
          }
        });
      },
      handleUpdateStatus(returnStatus){
        this.updateStatusParam.returnStatus=returnStatus;
        this.$confirm('是否要进行此操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          updateApplyStatus(this.id,this.updateStatusParam).then(response=>{
            this.$message({
              type: 'success',
              message: '操作成功!',
              duration:1000
            });
            this.$router.back();
          });
        });
      }
    }
  }
</script>
<style scoped>
  .detail-container {
    position: absolute;
    left: 0;
    right: 0;
    width: 1080px;
    padding: 35px 35px 15px 35px;
    margin: 20px auto;
  }

  .standard-margin {
    margin-top: 15px;
  }
  .form-border {
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    padding: 10px;
    min-height: 37px;
  }

  .form-container-border {
    border-left: 1px solid #DCDFE6;
    border-top: 1px solid #DCDFE6;
    margin-top: 15px;
  }

  .form-left-bg {
    background: #F2F6FC;
  }
</style>


