<template>
  <div class="app-container">
    <el-form :inline="true" size="small" ref="queryForm" :model="queryParams">
      <el-form-item prop="orderSn">
        <el-input v-model="queryParams.orderSn" placeholder="订单号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="dateRange"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"/>
      </el-form-item>
      <el-form-item>
        <el-select v-model="queryParams.status" class="filter-item" placeholder="订单状态">
          <el-option v-for="(key, value) in orderStatusMap" :label="key" :value="value"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">查询</el-button>
        <el-button icon="el-icon-refresh" @click="handleResetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table id="dataTable" ref="multipleTable" :data="pageList" border>

      <el-table-column align="center" label="订单编号" prop="orderSn"/>

      <el-table-column align="center" prop="memberId" label="会员ID"/>

      <el-table-column align="center" label="订单来源">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.source | orderSourceFilter }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="订单状态">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.status | orderStatusFilter }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" prop="orderPrice" label="订单金额">
        <template slot-scope="scope">
          {{ scope.row.orderPrice | moneyFormatter}}
        </template>
      </el-table-column>

      <el-table-column align="center" prop="payPrice" label="支付金额">
        <template slot-scope="scope">
          {{ scope.row.orderPrice | moneyFormatter}}
        </template>
      </el-table-column>

      <el-table-column align="center" label="支付方式">
        <template slot-scope="scope">
          <el-tag>{{scope.row.payChannel | payChannelFilter}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="物流渠道" prop="logisticsChannel" :formatter="logisticsChannelFormatter"/>

      <el-table-column align="center" prop="logisticsNo" label="物流单号"/>

      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleDetail(scope.row)">查看</el-button>
          <!-- <el-button size="mini" @click="handleCloseOrder(scope.row)">关闭订单</el-button>
           <el-button size="mini" @click="handleDeliverOrder(scope.row)">订单发货</el-button>
           <el-button size="mini" @click="handleViewLogistics(scope.row)">订单跟踪</el-button>-->
          <el-button size="mini" @click="handleRemoveOrder(scope.row)" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="pagination.total>0"
      :total="pagination.total"
      :page.sync="pagination.page"
      :limit.sync="pagination.limit"
      @pagination="handleQuery"/>


    <!-- 订单详情对话框 -->
    <el-dialog :visible.sync="orderDialogVisible" title="订单详情" width="800">
      <section ref="print">
        <el-form :data="orderDetail" label-position="left">
          <el-form-item label="订单编号">
            <span>{{ orderDetail.order.orderSn }}</span>
          </el-form-item>
          <el-form-item label="订单状态">
            <el-tag>{{ orderDetail.order.orderStatus | orderStatusFilter }}</el-tag>
          </el-form-item>
          <el-form-item label="订单用户">
            <span>{{ orderDetail.user.nickname }}</span>
          </el-form-item>
          <el-form-item label="用户留言">
            <span>{{ orderDetail.order.message }}</span>
          </el-form-item>
          <el-form-item label="收货信息">
            <span>（收货人）{{ orderDetail.order.consignee }}</span>
            <span>（手机号）{{ orderDetail.order.mobile }}</span>
            <span>（地址）{{ orderDetail.order.address }}</span>
          </el-form-item>
          <el-form-item label="商品信息">
            <el-table :data="orderDetail.orderGoods" border fit highlight-current-row>
              <el-table-column align="center" label="商品名称" prop="goodsName"/>
              <el-table-column align="center" label="商品编号" prop="goodsSn"/>
              <el-table-column align="center" label="货品规格" prop="specifications"/>
              <el-table-column align="center" label="货品价格" prop="price"/>
              <el-table-column align="center" label="货品数量" prop="number"/>
              <el-table-column align="center" label="货品图片" prop="picUrl">
                <template slot-scope="scope">
                  <img :src="scope.row.picUrl" width="40">
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item label="费用信息">
            <span>
              (实际费用){{ orderDetail.order.actualPrice }}元 =
              (商品总价){{ orderDetail.order.goodsPrice }}元 +
              (快递费用){{ orderDetail.order.freightPrice }}元 -
              (优惠减免){{ orderDetail.order.couponPrice }}元 -
              (积分减免){{ orderDetail.order.integralPrice }}元
            </span>
          </el-form-item>
          <el-form-item label="支付信息">
            <span>（支付渠道）微信支付</span>
            <span>（支付时间）{{ orderDetail.order.payTime }}</span>
          </el-form-item>
          <el-form-item label="快递信息">
            <span>（快递公司）{{ orderDetail.order.shipChannel }}</span>
            <span>（快递单号）{{ orderDetail.order.shipSn }}</span>
            <span>（发货时间）{{ orderDetail.order.shipTime }}</span>
          </el-form-item>
          <el-form-item label="退款信息">
            <span>（退款金额）{{ orderDetail.order.refundAmount }}元</span>
            <span>（退款类型）{{ orderDetail.order.refundType }}</span>
            <span>（退款备注）{{ orderDetail.order.refundContent }}</span>
            <span>（退款时间）{{ orderDetail.order.refundTime }}</span>
          </el-form-item>
          <el-form-item label="收货信息">
            <span>（确认收货时间）{{ orderDetail.order.confirmTime }}</span>
          </el-form-item>
        </el-form>
      </section>
      <span slot="footer" class="dialog-footer">
        <el-button @click="orderDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="printOrder">打 印</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>

  import {list, detail, update, add, del, patch} from '@/api/oms/order'

  const orderSourceMap = {
    1: '微信小程序',
    2: 'APP',
    3: 'PC'
  }

  const orderStatusMap = {
    11: '未付款',
    12: '用户取消',
    13: '系统取消',
    21: '已付款',
    22: '申请退款',
    23: '已退款',
    31: '已发货',
    41: '用户收货',
    42: '系统收货'
  }


  const payChannelMap = {
    0: '未支付',
    1: '支付宝',
    2: '微信'
  }

  export default {
    filters: {
      orderSourceFilter(source) {
        return orderSourceMap[source]
      },
      orderStatusFilter(status) {
        return orderStatusMap[status]
      },
      payChannelFilter(val) {
        return payChannelMap[val]
      }
    },
    data() {
      return {
        orderSourceMap,
        orderStatusMap,
        payChannelMap,
        ids: [],
        single: true,
        multiple: true,
        pagination: {
          page: 1,
          limit: 10,
          total: 0
        },
        queryParams: {
          orderSn: undefined
        },
        dateRange: [],
        pageList: [],
        dialog: {
          title: undefined,
          visible: false
        },
        form: {
          status: 1
        },
        rules: {
          logisticsChannel: [{
            required: true, message: '请选择物流渠道', trigger: 'blur'
          }],
          logisticsNo: [{
            required: true, message: '请输入物流单号', trigger: 'blur'
          }]
        },
        logisticsChannelOptions: [],
        orderDialogVisible: false,

        orderDetail: {
          order: {},
          user: {},
          orderGoods: []
        },
      }
    },
    created() {
      this.loadData()
    },
    methods: {
      async loadData() {
        await this.getDicts("logistics_channel").then(response => {
          this.logisticsChannelOptions = response.data
        })
        await this.handleQuery()
      },
      logisticsChannelFormatter(row) {
        const arr = this.logisticsChannelOptions.filter(item => item.value == row.logisticsChannel)
        if (arr.length > 0) {
          return arr[0].name
        }
        return
      },

      handleQuery() {
        if (this.dateRange.length === 2) {
          this.queryParams.startDate = this.dateRange[0]
          this.queryParams.endDate = this.dateRange[1]
        }
        list(this.queryParams).then(response => {
          const {data, total} = response
          this.pageList = data
          this.total = total
        });
      },
      handleResetQuery() {
        this.pagination = {
          page: 1,
          limit: 10,
          total: 0
        }
        this.queryParams = {
          orderSn: undefined
        }
        this.dateRange = []
        this.resetForm()
        this.handleQuery()
      },

      resetForm() {
        this.form = {}
        if (this.$refs['form']) {
          this.$refs['form'].resetFields()
        }
      },

      handleDetail(row) {
        this.orderDialogVisible = true

      },
      handleCloseOrder(row) {
      },
      handleDeliverOrder(row) {
        this.dialog = {
          title: '订单发货',
          visible: true
        }
        this.resetForm()
        this.form = {
          id: row.id,
          orderSn: row.orderSn,
          receiver_name: row.receiver_name,
          receiver_mobile: row.receiver_mobile,
          receiver_zip: row.receiver_zip,
          receiver_address: row.receiver_address
        }
      },
      handleViewLogistics(row) {
      },
      handleRemoveOrder(row) {
      },
      handleSubmit() {
        this.$refs["form"].validate((valid) => {
          if (valid) {
            orderDeliver(this.form.id, this.form).then(() => {
              this.$notify.success("发货成功")
              this.dialog.visible = false
              this.handleQuery()
            })
          }
        })
      },
      handleDelete(row) {
        this.$confirm('是否确认删除选中的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
            del(row.id).then(() => {
              this.$message.success("删除成功")
              this.handleQuery()
            })
          }
        ).catch(() =>
          this.$message.info("已取消删除")
        )
      },
      cancel() {
        this.resetForm()
        this.dialog.visible = false;
      }
    }
  }
</script>

<style scoped>

</style>
