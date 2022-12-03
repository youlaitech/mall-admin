<!--  实验室-seata -->
<script lang="ts">
export default {
  name: 'seata',
};
</script>

<script setup lang="ts">
import { reactive, onMounted, toRefs } from 'vue';
import SvgIcon from '@/components/SvgIcon/index.vue';
import {
  Money,
  RefreshLeft,
  CircleCheckFilled,
  CircleCloseFilled,
} from '@element-plus/icons-vue';
import {
  purchaseGoods,
  getSeataData,
  resetSeataData,
} from '@/api/laboratory/seata';
import { ElMessage, ElMessageBox } from 'element-plus';
import { SeataForm } from '@/api/laboratory/seata/types';

const state = reactive({
  // 保留改变前数据
  cacheSeataData: {
    status: undefined,
    stockNum: undefined,
    balance: undefined,
  },
  seataData: {
    orderInfo: {
      orderSn: undefined,
      status: undefined,
    },
    stockInfo: {
      name: undefined,
      picUrl: undefined,
      stockNum: undefined,
    },
    accountInfo: {
      nickName: undefined,
      avatarUrl: undefined,
      balance: undefined,
    },
  },

  loading: false,

  submitData: {
    openTx: true, // 是否开启事务
    openEx: true, // 订单修改异常
    memberId: 1,
    skuId: 1,
    amount: 599900,
  } as SeataForm,
});

const { cacheSeataData, seataData, loading, submitData } = toRefs(state);

/**
 * 订单支付(模拟)
 */
function handleOrderPay() {
  // 数据校验
  if (
    (seataData.value.stockInfo.stockNum &&
      seataData.value.stockInfo.stockNum != 999) ||
    (seataData.value.accountInfo.balance &&
      seataData.value.accountInfo.balance != 10000000)
  ) {
    ElMessageBox.confirm(
      '检查到当前数据已被污染，请先重置数据后尝试提交?',
      '警告',
      {
        confirmButtonText: '重置数据',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
      .then(() => {
        handleDataReset();
      })
      .catch(() => {});
  } else {
    // 订单支付模拟提交

    loading.value = true;
    let orderSn = '';
    purchaseGoods(submitData.value)
      .then((response) => {
        orderSn = response.data;
        ElMessage.success('订单支付成功');
      })
      .finally(() => {
        cacheSeataData.value = {
          status: seataData.value.orderInfo.status,
          stockNum: seataData.value.stockInfo.stockNum,
          balance: seataData.value.accountInfo.balance,
        };
        loadData();
        loading.value = false;
      });
  }
}

/**
 * 加载数据
 */
function loadData() {
  loading.value = true;
  getSeataData()
    .then((response: any) => {
      seataData.value = response.data;
    })
    .finally(() => {
      loading.value = false;
    });
}

/**
 * 数据重置
 */
function handleDataReset() {
  loading.value = true;
  resetSeataData()
    .then(() => {
      ElMessage.success('数据还原成功');

      cacheSeataData.value = {
        status: undefined,
        stockNum: undefined,
        balance: undefined,
      };
      loadData();
    })
    .finally(() => {
      loading.value = false;
    });
}

onMounted(() => {
  // 第一次加载重置数据测试
  handleDataReset();
});
</script>

<template>
  <div class="app-container">
    <el-alert type="info">
      <p style="font-size: 16px">
        <b>购买商品流程：</b>
        扣减商品库存 → 创建订单 → 扣减会员余额
      </p>
      <p style="font-size: 14px">
        <b> 分布式事务生效判断：</b>
        <el-link :icon="CircleCheckFilled" type="success">全部成功</el-link>
        或
        <el-link type="danger" :icon="CircleCloseFilled">全部失败</el-link>
      </p>

      <p style="font-size: 14px">
        <b> 博客教程：</b>
        <el-link
          type="primary"
          href="https://www.cnblogs.com/haoxianrui/"
          target="_blank"
        >
          https://www.cnblogs.com/haoxianrui</el-link
        >
      </p>
    </el-alert>

    <el-card :shadow="false" style="margin-top: 20px">
      <el-form :inline="true">
        <el-row>
          <el-col :span="20">
            <el-form-item>
              <el-button
                type="primary"
                :icon="Money"
                size="small"
                @click="handleOrderPay"
                >订单支付</el-button
              >
            </el-form-item>
            <el-form-item>
              <el-checkbox v-model="submitData.openTx" :label="true">
                开启事务</el-checkbox
              >
            </el-form-item>
          </el-col>
          <el-col :span="4" style="text-align: right">
            <el-button :icon="RefreshLeft" size="small" @click="handleDataReset"
              >重置数据</el-button
            >
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-row :gutter="10" style="margin-top: 20px" v-loading="loading">
      <el-col :span="8" :xs="24" class="box">
        <el-card class="box-card" shadow="always">
          <template #header>
            <svg-icon icon-class="goods" />
            商品信息
          </template>

          <div style="display: flex">
            <el-image
              style="width: 100px; height: 100px"
              :src="seataData.stockInfo.picUrl"
              fit="fill"
            />
            <div style="margin-left: 10px">
              <el-form-item label="商品名称:">
                {{ seataData.stockInfo.name }}
              </el-form-item>
              <el-form-item
                label="库存数量:"
                style="display: flex; margin-top: 30px"
              >
                <div v-if="cacheSeataData.stockNum != null">
                  {{ cacheSeataData.stockNum }} 部 →
                </div>

                {{ seataData.stockInfo.stockNum }} 部

                <div v-if="cacheSeataData.stockNum" style="margin-left: 50px">
                  <el-link
                    v-if="
                      cacheSeataData.stockNum != seataData.stockInfo.stockNum
                    "
                    type="success"
                    :underline="false"
                    :icon="CircleCheckFilled"
                  >
                    成功
                  </el-link>
                  <el-link
                    v-else-if="
                      cacheSeataData.stockNum == seataData.stockInfo.stockNum
                    "
                    type="danger"
                    :underline="false"
                    :icon="CircleCloseFilled"
                  >
                    失败
                  </el-link>
                </div>
              </el-form-item>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="8" :xs="24" class="box">
        <el-card class="box-card" shadow="always">
          <template #header>
            <div
              style="
                display: flex;
                align-items: center;
                justify-content: space-between;
              "
            >
              <div>
                <svg-icon icon-class="user" />
                会员信息
              </div>
              <div>
                <el-checkbox v-model="submitData.openEx" :label="true">
                  搞点异常</el-checkbox
                >
              </div>
            </div>
          </template>

          <div style="display: flex">
            <el-image
              style="width: 100px; height: 100px"
              :src="seataData.accountInfo.avatarUrl"
              fit="fill"
            />
            <div style="margin-left: 10px">
              <el-form-item label="会员昵称:">
                {{ seataData.accountInfo.nickName }}
              </el-form-item>

              <el-form-item label="会员余额:" style="margin-top: 35px">
                <div v-if="cacheSeataData.balance != null">
                  {{ (cacheSeataData.balance as any) / 100 }} 元 →
                </div>
                {{ (seataData.accountInfo.balance as any) / 100 }} 元

                <div v-if="cacheSeataData.balance" style="margin-left: 20px">
                  <el-link
                    v-if="
                      cacheSeataData.balance != seataData.accountInfo.balance
                    "
                    type="success"
                    :underline="false"
                    :icon="CircleCheckFilled"
                  >
                    成功
                  </el-link>
                  <el-link
                    v-else-if="
                      cacheSeataData.balance == seataData.accountInfo.balance
                    "
                    type="danger"
                    :underline="false"
                    :icon="CircleCloseFilled"
                  >
                    失败
                  </el-link>
                </div>
              </el-form-item>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="8" :xs="24" class="box">
        <el-card class="box-card" shadow="always">
          <template #header>
            <svg-icon icon-class="order" />
            订单信息
          </template>

          <el-form-item label="订单编号:">
            {{ seataData.orderInfo.orderSn }}
          </el-form-item>

          <el-form-item label="订单状态:" style="margin-top: 35px">
            <div v-if="cacheSeataData.status != null">
              <el-tag type="info"> 待付款 </el-tag>
              →
            </div>
            <el-tag v-if="seataData.orderInfo.status == 2" type="success"
              >已支付</el-tag
            >
            <el-tag v-else type="info"> 待付款 </el-tag>

            <div v-if="cacheSeataData.status" style="margin-left: 50px">
              <el-link
                v-if="cacheSeataData.status != seataData.orderInfo.status"
                type="success"
                :underline="false"
                :icon="CircleCheckFilled"
              >
                成功
              </el-link>
              <el-link
                v-else
                type="danger"
                :underline="false"
                :icon="CircleCloseFilled"
              >
                失败
              </el-link>
            </div>
          </el-form-item>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.box {
  margin-bottom: 12px;

  .el-link {
    font-size: 16px;
    margin-right: 8px;
  }
}
.el-form-item--default {
  margin-bottom: 0px !important;
}

.el-result {
  --el-result-padding: 3px !important;
  --el-result-title-margin-top: 0px !important;
  --el-result-subtitle-margin-top: 0px !important;
  --el-result-extra-margin-top: 0px !important;
}
</style>
