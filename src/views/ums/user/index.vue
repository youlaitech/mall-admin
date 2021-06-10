<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryParams" :inline="true">
      <el-form-item>
        <el-button type="danger" icon="el-icon-delete" :disabled="multiple" @click="handleDelete">删除</el-button>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="queryParams.nickName"
          placeholder="会员昵称"
          clearable
          @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" :data="pageList" border @selection-change="handleSelectionChange">
      <el-table-column type="selection" align="center"/>
      <el-table-column type="expand" width="80" label="会员地址">
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
                {{ scope.row.province + scope.row.city + scope.row.area + scope.row.address }}
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

      <el-table-column type="index" label="序号" width="50" align="center"/>
      <el-table-column prop="nickName" label="昵称"/>
      <el-table-column label="性别" width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.gender===0">未知</span>
          <span v-if="scope.row.gender===1">男</span>
          <span v-if="scope.row.gender===2">女</span>
        </template>
      </el-table-column>
      <el-table-column label="头像" width="100">
        <template slot-scope="scope">
          <el-popover
            placement="right"
            trigger="hover">
            <img :src="scope.row.avatarUrl"/>
            <img slot="reference" :src="scope.row.avatarUrl" :alt="scope.row.avatarUrl"
                 style="max-height: 60px;max-width: 60px">
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="mobile" label="手机号码"/>
      <el-table-column prop="birthday" label="出生日期"/>
      <el-table-column prop="status" width="80" label="状态">
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

      <el-table-column prop="gmtCreate" label="注册时间"/>

      <el-table-column label="账户余额" width="80">
        <template slot-scope="scope">
          {{ scope.row.balance / 100 }}
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
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


    <el-dialog top="1vh" title="会员充值" :visible.sync="dialog.visible" @close="handleRechargeClose" width="700px">
      <h1 class="mod-title">
        <!--支付宝支付图标-->
        <p style="color: rgb(51, 51, 51); font-size: 12px; margin-top: 10px; display: none;" class="n-wx-zfb">
          请先截屏,使用支付宝"扫一扫"识别相册图片支付</p>
        <span class="ico_log ico-4"></span><span class="ico_log ico-3"></span>
      </h1>

      <div class="mod-ct">
        <div class="qrcode-img-wrapper" data-role="qrPayImgWrapper">
          <div data-role="qrPayImg" class="qrcode-img-area">
            <div class="ui-loading qrcode-loading" data-role="qrPayImgLoading" style="display: none;"></div>
            <div style="position: relative;display: inline-block;">
              <img id="imgCode2" width="210" :src="zfbPayImgUrl">
              <img id="imgCode3" width="210" :src="wxPayImgUrl">
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
          <div class="time-item" id="msg" style="width: 400px;margin: 0 auto ">
            <el-row style="text-align: left">
              <b>订 单 号：</b> {{ recharge.orderId }}
            </el-row>
            <el-row style="text-align: left">
              <b>订单名称：</b>{{ recharge.name }}
            </el-row>
            <el-row style="text-align: left">
              <b>会员昵称：</b>{{ nickName }}
            </el-row>
            <el-row style="text-align: left">
              <b>充值金额：</b>{{recharge.price}}
              <span style="color:#F56C6C;margin-left: 2px">
                （扫码支付{{recharge.price}}元获{{ recharge.price * 10000 }}商城元体验金）
              </span>
            </el-row>

            <el-row style="text-align: left">
              <b>支付状态：</b>
              <el-tag v-if="payResult=='待支付'" size="mini">待支付</el-tag>
              <el-tag v-if="payResult=='已支付'" size="mini" type="success">已支付</el-tag>
              <el-tag v-if="payResult=='已过期'" size="mini" type="info">已过期</el-tag>
            </el-row>

          </div>
          <div class="time-item" style="margin-top: 10px">
            <strong id="hour_show"><s id="h"></s>订单支付有效期</strong>
            <strong id="minute_show">{{countdown.m}}</strong>
            <strong id="second_show">{{countdown.s}}</strong>
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
  import {recharge, rechargeResult} from "../../../api/ums/recharge";

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
          nickName: undefined
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
          price: 1,
          thirduid: undefined
        },
        nickName: undefined,
        wxPayImgUrl: require('../../../assets/images/zfbpay.png'),
        zfbPayImgUrl: require('../../../assets/images/wxpay.png'),
        countdown: {
          m: 0,
          s: 0
        },
        remainTime: 30,
        rechargeTimer: undefined,
        payResult: '待支付',
        rechargeResultTimer: undefined
      }
    },
    async created() {
      this.handleQuery()
    },
    destroyed() {
      clearInterval(this.rechargeTimer)
      clearInterval(this.rechargeResultTimer)
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
      handleReset() {
        this.pagination = {
          page: 1,
          limit: 10,
          total: 0
        }
        this.queryParams = {
          queryMode: 'page',
          nickName: undefined
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
        this.$confirm('确认要' + text + row.nickName + '吗?', '警告', {
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
        this.recharge.thirduid = row.id
        this.nickName = row.nickName
        this.dialog.visible = true
        this.handleCreateRechargeOrder()
      },
      handleCreateRechargeOrder() {
        recharge(this.recharge).then(response => {
          this.recharge.orderId = response.data.orderId
          this.recharge.price = response.data.price

          this.remainTime = 5 * 60
          this.wxPayImgUrl = require('../../../assets/images/wxpay.png')
          this.zfbPayImgUrl = require('../../../assets/images/zfbpay.png')
          this.recharge.price = 1
          // 开启计时器
          this.rechargeTimer = setInterval(this.waitRecharge, 1000)
          this.rechargeResultTimer = setInterval(this.checkRechargeResultTimer, 20000)
        })
      },
      waitRecharge() {
        if (this.remainTime >= 0) {
          this.countdown.m = Math.floor(this.remainTime / 60)
          this.countdown.s = Math.floor(this.remainTime % 60)
          --this.remainTime
        } else {
          clearInterval(this.rechargeTimer)
        }
      },
      handleRechargeClose() {
        this.dialog.visible = false
        clearInterval(this.rechargeTimer)
        clearInterval(this.rechargeResultTimer)
      },
      checkRechargeResultTimer() {
        rechargeResult(this.recharge.orderId).then(response => {
          const result = response.data
          if (result.code == "10001") {
            this.$message.success('支付成功')
            this.wxPayImgUrl = require('../../../assets/images/qrcode_paysuccess.jpg')
            this.zfbPayImgUrl = require('../../../assets/images/qrcode_paysuccess.jpg')
            this.payResult = '已支付'


            const that = this
            setTimeout(function () {
              that.dialog.visible = false
              that.handleQuery()
            }, 3000)

          } else if (result.code == "10003") {
            this.$message.warning('订单已失效')
            this.payResult = '已过期'
          } else {
            this.$message.warning(result.msg)
          }
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
    padding-top: 10px;
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
