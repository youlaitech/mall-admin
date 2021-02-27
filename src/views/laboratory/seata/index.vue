<template>

  <div class="app-container" v-loading="loading" element-loading-text="订单提交中...请等待15s左右">

    <el-form ref="queryForm" size="small" :inline="true">
      <el-form-item>
        <el-button icon="el-icon-refresh" @click="handleQuery">刷新数据</el-button>
        <el-button icon="el-icon-refresh-left" @click="handleReset">重置数据</el-button>


        <el-button type="primary" icon="el-icon-check" @click="handleSubmit">提交订单【模拟】</el-button>

        <el-switch
          style="margin-left: 10px"
          v-model="checked"
          active-text="开启事务"
          inactive-text="关闭事务">
        </el-switch>
      </el-form-item>
    </el-form>

    <el-card class="box-card">
      <div slot="header">
        <span>订单信息</span>
      </div>
      <el-table v-loading="orderLoading" :data="orderData" border size="small">
        <el-table-column label="序号" type="index" width="100"/>
        <el-table-column label="订单编号" prop="orderSn"/>
        <el-table-column label="订单状态" prop="status" align="left">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status==101" type="info">待付款</el-tag>
            <el-tag v-if="scope.row.status==901" type="success">已完成</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card class="box-card">
      <div slot="header">
        <span>商品信息</span>
      </div>
      <el-table v-loading="skuLoading" :data="skuData" border size="small">
        <el-table-column label="商品编号" type="index" width="100"/>
        <el-table-column label="商品名称" prop="name"/>
        <el-table-column label="库存数量" prop="stock" align="left"/>
      </el-table>
    </el-card>


    <el-card class="box-card">
      <div slot="header">
        <span>会员信息</span>
      </div>
      <el-table v-loading="memberLoading" :data="memberData" border size="small">
        <el-table-column label="会员编号" prop="id" width="100"/>
        <el-table-column label="会员姓名" prop="nickname"/>
        <el-table-column label="积分" prop="point" align="left"/>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import {orderDetail, submit, update as updateOrder} from '@/api/oms/order'
import {detail as inventoryDetail, update as updateInventory} from '@/api/pms/inventory'
import {detail as userDetail, update as updateUser} from '@/api/ums/user'

export default {
  data() {
    return {
      orderData: [],
      skuData: [],
      memberData: [],
      checked: true,
      orderLoading: false,
      skuLoading: false,
      memberLoading: false,
      loading: false
    }
  },
  created() {
    this.handleQuery()
  },
  methods: {
    handleQuery() {
      this.orderData = []
      this.skuData = []
      this.memberData = []
      this.orderLoading = true
      this.skuLoading = true
      this.memberLoading = true

      orderDetail(1).then(response => {
        console.log('订单信息', response.data)
        this.orderLoading = false
        this.orderData.push(response.data)
      })
      inventoryDetail(1).then(response => {
        console.log('库存信息', response.data)
        this.skuLoading = false
        this.skuData.push(response.data)
      })
      userDetail(1).then(response => {
        console.log('会员信息', response.data)
        this.memberLoading = false
        this.memberData.push(response.data)
      })
    },
    // 数据重置
    handleReset() {
      updateOrder(1, {id: 1, status: 101}).then(r1 => {
        updateInventory(1, {id: 1, stock: 9999}).then(r2 => {
          updateUser(1, {id: 1, point: 0}).then(r3 => {
            this.$message.success("重置数据成功")
            this.handleQuery()
          })
        })
      })
    },
    handleSubmit: function () {
      if (this.orderData[0].status == 901) {
        this.$message.warning('订单状态已完成，你需要点击左侧按钮重置数据，然后再次提交')
        return
      }

      this.loading = true
      submit({openTransaction: this.checked}).then(response => {
        this.loading = false
        this.$message.info(response.msg)
        this.handleQuery()
      })
    }
  }
}
</script>

<style scoped>

</style>
