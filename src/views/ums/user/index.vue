<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryParams" :inline="true">
      <el-form-item>
        <el-button type="danger" icon="el-icon-delete" :disabled="multiple" @click="handleDelete">删除</el-button>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="queryParams.nickname"
          placeholder="会员昵称"
          clearable
          @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="handleResetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" :data="pageList" border @selection-change="handleSelectionChange">
      <el-table-column type="selection" min-width="5" align="center"/>
      <el-table-column type="expand" width="100" label="会员地址">
        <template slot-scope="props">
          <el-table
            :data="props.row.addressList"
            size="small"
            border>
            <el-table-column type="index" label="序号" width="80" align="center"/>
            <el-table-column align="center" label="收货人" prop="name"/>
            <el-table-column align="center" label="联系方式" prop="mobile"/>
            <el-table-column align="center" label="收货地址">
              <template slot-scope="scope">
                {{scope.row.province + scope.row.city + scope.row.area + scope.row.address }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="邮编" prop="zipCode"/>
            <el-table-column align="center" label="是否默认">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.defaulted==1" type="success">是</el-tag>
                <el-tag v-if="scope.row.defaulted==0" type="info">否</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>

      <el-table-column type="index" label="序号" width="80" align="center"/>
      <el-table-column prop="nickname" label="昵称" min-width="10"/>
      <el-table-column label="性别" min-width="10">
        <template slot-scope="scope">
          <span v-if="scope.row.gender===0">未知</span>
          <span v-if="scope.row.gender===1">男</span>
          <span v-if="scope.row.gender===2">女</span>
        </template>
      </el-table-column>
      <el-table-column label="头像" min-width="10">
        <template slot-scope="scope">
          <el-popover
            placement="right"
            trigger="hover">
            <img :src="scope.row.avatar"/>
            <img slot="reference" :src="scope.row.avatar" :alt="scope.row.avatar"
                 style="max-height: 60px;max-width: 60px">
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="mobile" label="手机号码" min-width="10"/>
      <el-table-column prop="birthday" label="出生日期" min-width="10"/>
      <el-table-column prop="status" label="状态" min-width="6">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="1"
            :inactive-value="0"
            active-color="#13ce66"
            inactive-color="#cccccc"
            @change="handleStatusChange(scope.row)"
          />
        </template>
      </el-table-column>

      <el-table-column prop="gmtCreate" label="注册时间" min-width="15"/>

      <el-table-column label="账户余额" min-width="6">
        <template slot-scope="scope">
          {{ scope.row.balance / 100 }}
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" min-width="10" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            type="text"
            icon="el-icon-coin"
            @click="handleRecharge(scope.row)">
            充值
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="pagination.total>0"
      :total="pagination.total"
      :page.sync="pagination.page"
      :limit.sync="pagination.limit"
      @pagination="handleQuery"/>


    <el-dialog title="会员充值" :visible.sync="dialog.visible" width="700px">
      <h1 class="mod-title">
        <!--支付宝支付图标-->
        <p style="color: rgb(51, 51, 51); font-size: 12px; margin-top: 10px; display: none;" class="n-wx-zfb">
          请先截屏,使用支付宝"扫一扫"识别相册图片支付</p>
        <span class="ico_log ico-4"></span><span class="ico_log ico-3"></span>
      </h1>

      <div class="mod-ct">
        <div class="amount" id="money">
          <span style="color:#F56C6C;">充值1分就送有来商城1000元体验金</span>
        </div>

        <div class="qrcode-img-wrapper" data-role="qrPayImgWrapper">
          <div data-role="qrPayImg" class="qrcode-img-area">
            <div class="ui-loading qrcode-loading" data-role="qrPayImgLoading" style="display: none;"></div>
            <div style="position: relative;display: inline-block;">
              <img id="imgCode2" width="210" src="@/assets/images/zfbpay.png">
              <img id="imgCode3" width="210" src="@/assets/images/wxpay.png">
              <!--支付宝图标/微信图标-->
              <input name="istype" id="istype" type="hidden" value="1">
              <div id="qrcode"></div>
              <img src="" style="display: none" id="qrLost">
              <canvas id="imgCanvas" width="310" height="270" style="display: none;"></canvas>
              <div class="timeOut" style="display: none">过期时间<span id="timeOut">2020-09-29 14:11:20</span></div>
              <input type="hidden" id="now_time" value="2020-09-29 14:05:20">
            </div>
          </div>
        </div>
        <div class="time-item" style="padding-top: 10px">
          <div class="time-item" id="msg">
            <el-row>
              <el-col>订单名称：<span>{{recharge.name}}</span></el-col>
              <el-col>会员名称：<span>{{nickname}}</span></el-col>
              <el-col>订单号:<span>{{recharge.orderId}}</span></el-col>
            </el-row>
          </div>
          <div class="time-item">
            <strong id="hour_show"><s id="h"></s>订单支付有效期</strong>
            <strong id="minute_show"><s></s></strong>
            <strong id="second_show"><s></s></strong>
            <div class="time-item"></div>
            <strong class='resultMsg'><s></s>20秒后自动获取支付结果</strong>
          </div>

          <div class="tip">
            <div class="ico-scan"></div>
            <div class="tip-text">
              <!--支付宝支付提示/微信支付提示-->
              <p id="showtext">打开支付宝或微信[扫一扫]</p>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import {list, patch} from '../../../api/ums/user'
  import {recharge} from "../../../api/ums/recharge";

  export default {
    data() {
      return {
        // 遮罩层
        loading: true,
        // 选中数组
        ids: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        queryParams: {
          queryMode: 'page',
          nickname: undefined
        },
        pagination: {
          page: 1,
          limit: 10,
          total: 0
        },
        pageList: [],
        dialog: {
          visible: false
        },
        recharge: {
          orderId: undefined,
          name: '会员充值',
          price: '0.01',
          thirduid: undefined
        },
        nickname: undefined
      }
    },
    async created() {
      this.handleQuery()
    },
    methods: {
      handleQuery() {
        this.queryParams.page = this.pagination.page
        this.queryParams.limit = this.pagination.limit
        list(this.queryParams).then(response => {
          this.pageList = response.data
          this.pagination.total = response.total
          this.loading = false
        })
      },
      handleResetQuery() {
        this.pagination = {
          page: 1,
          limit: 10,
          total: 0
        }
        this.queryParams = {
          queryMode: 'page',
          nickname: undefined
        }
        this.handleQuery()
      },
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.single = selection.length != 1
        this.multiple = !selection.length
      },
      handleDelete(row) {
        const ids = row.id || this.ids.join(',')
        this.$confirm('确认删除已选中的数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          del(ids).then(() => {
            this.$message.success('删除成功')
            this.handleQuery()
          })
        }).catch(() =>
          this.$message.info('已取消删除')
        )
      },
      // 会员状态修改
      handleStatusChange(row) {
        const text = row.status === 1 ? '激活' : '禁用'
        this.$confirm('确认要' + text + row.nickname + '吗?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          return patch(row.id, {status: row.status})
        }).then(() => {
          this.$message.success(text + '成功')
        }).catch(function () {
          row.status = row.status === 0 ? 1 : 0
        })
      },
      // 充值
      handleRecharge(row) {
        console.log('会员信息', row)
        this.recharge.thirduid = row.id
        this.nickname = row.nickname
        this.dialog.visible = true
        this.handleCreateRechargeOrder()
      },
      handleCreateRechargeOrder() {
        recharge(this.recharge).then(response => {
          console.log('订单', response.data)
        })
      }
    }
  }
</script>

<style scoped>

  h1, h2, h3, h4, h5, h6 {
    font-size: 100%;
    font-family: arial, 'hiragino sans gb', 'microsoft yahei', 'Simsun', sans-serif
  }


  table {
    border-collapse: collapse;
    border-spacing: 0
  }

  address, caption, cite, code, dfn, em, th, var {
    font-style: normal;
    font-weight: normal
  }

  li {
    list-style: none
  }

  caption, th {
    text-align: left
  }

  q:before, q:after {
    content: ''
  }

  abbr, acronym {
    border: 0;
    font-variant: normal
  }

  sup {
    vertical-align: text-top
  }

  sub {
    vertical-align: text-bottom
  }

  fieldset, img, a img, iframe {
    border-width: 0;
    border-style: none
  }

  img {
    -ms-interpolation-mode: bicubic
  }

  textarea {
    overflow-y: auto
  }

  legend {
    color: #000
  }

  a:link, a:visited {
    text-decoration: none
  }

  hr {
    height: 0
  }

  label {
    cursor: pointer
  }

  a {
    color: #328CE5
  }

  a:hover {
    color: #2b8ae8;
    text-decoration: none
  }

  a:focus {
    outline: none
  }

  body, .body {
    background: #f7f7f7;
    height: 100%;
    max-width: 640px;
    min-width: 300px;
    min-height: 100%;
    margin: 0 auto;
  }

  .mod-title {
    text-align: center;
    border-bottom: 1px solid #ddd;
    background: #fff
  }

  .ico_log {
    display: inline-block;
    width: 130px;
    height: 38px;
    vertical-align: middle;
    margin-right: 7px
  }

  .ico-1 {
    background: url("../../../assets/images/logo_alipay.jpg") no-repeat;
    background-size: cover;
  }

  .ico-2 {
    background: url("../../../assets/images/logo_weixin.jpg") no-repeat;
  }

  .ico-3 {
    background: url("../../../assets/images/logo_weixin.jpg") no-repeat;
    background-size: cover;
    margin-top: 5px;
    margin-bottom: 5px;
  }

  .ico-4 {
    background: url("../../../assets/images/logo_alipay.jpg") no-repeat;
    background-size: cover;
    margin-top: 5px;
    margin-bottom: 5px;
  }

  .mod-title .text {
    font-size: 20px;
    color: #333;
    font-weight: bold;
    vertical-align: middle
  }

  .timeOut {
    font-family: "微软雅黑";
    font-size: 15px;
    margin: 5px 0;
    padding-bottom: 2px;
    letter-spacing: 2px;
    color: #3ec742;
  }

  .mod-ct {
    min-width: 300px;
    max-width: 640px;
    margin: 0 auto;
    margin-top: 15px;
    margin-bottom: 15px;
    padding-bottom: 10px;
    background: #fff url("../../../assets/images/wave.png") top center repeat-x;
    text-align: center;
    color: #333;
    border: 1px solid #e5e5e5;
    border-top: none
  }

  .mod-ct .order {
    font-size: 20px;
    padding-top: 10px
  }

  .mod-ct .amount {
    font-size: 18px;
    margin: 10px auto;
    padding-top: 20px;
  }

  .mod-ct .amount2 {
    font-size: 25px;
  }

  .moneySize {
    font-size: 20px;
    color: #f00;
  }

  .mod-ct .qr-image {
    margin-top: 30px
  }

  .mod-ct .qr-image img {
    width: 230px;
    height: 230px
  }

  .mod-ct .detail {
    margin-top: 10px;
    padding-top: 0px;
    padding-bottom: 10px;

  }

  .mod-ct .detail .arrow .ico-arrow {
    display: inline-block;
    width: 20px;
    height: 11px;
    background: url("../../../assets/images/wechat-pay.png") -25px -100px no-repeat
  }

  .mod-ct .detail .detail-ct {
    display: none;
    font-size: 12px;
    text-align: right;
    line-height: 28px
  }

  .mod-ct .detail .detail-ct dt {
    float: left
  }

  .mod-ct .detail-open {
    border-top: 1px solid #e5e5e5
  }

  .mod-ct .detail .arrow {
    padding: 6px 34px;
    border: 1px solid #e5e5e5
  }

  .mod-ct .detail .arrow .ico-arrow {
    display: inline-block;
    width: 20px;
    height: 11px;
    background: url("../../../assets/images/wechat-pay.png") -25px -100px no-repeat
  }

  .mod-ct .detail-open .arrow .ico-arrow {
    display: inline-block;
    width: 20px;
    height: 11px;
    background: url("../../../assets/images/wechat-pay.png") 0 -100px no-repeat
  }

  .mod-ct .detail-open .detail-ct {
    display: block
  }

  .mod-ct .tip {
    margin-top: 20px;
    border-top: 1px dashed #e5e5e5;
    padding: 10px 0;
    position: relative
  }

  .mod-ct .tip .ico-scan {
    display: inline-block;
    width: 56px;
    height: 55px;
    background: url("../../../assets/images/wechat-pay.png") 0 0 no-repeat;
    vertical-align: middle;
    *display: inline;
    *zoom: 1
  }

  .mod-ct .tip .tip-text {
    display: inline-block;
    vertical-align: middle;
    text-align: left;
    margin-left: 23px;
    font-size: 16px;
    line-height: 28px;
    *display: inline;
    *zoom: 1
  }

  .mod-ct .tip .dec {
    display: inline-block;
    width: 22px;
    height: 45px;
    background: url("../../../assets/images/wechat-pay.png") 0 -55px no-repeat;
    position: absolute;
    top: -23px
  }

  .mod-ct .tip .dec-left {
    background-position: 0 -55px;
    left: -136px
  }

  .mod-ct .tip .dec-right {
    background-position: -25px -55px;
    right: -136px
  }


  .time-item strong {
    background: #3ec742;
    color: #fff;
    line-height: 25px;
    font-size: 15px;
    font-family: Arial;
    padding: 0 10px;
    margin-right: 10px;
    border-radius: 5px;
    box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
  }

</style>
