<!--  实验室-sentinel -->
<script lang="ts">
export default {
  name: 'sentinel',
};
</script>

<script setup lang="ts">
import { reactive, onMounted, toRefs } from 'vue';
import {
  getFlowLimitingData,
  getGatewayRouteFlowLimitingData,
  getGatewayApiFlowLimitingData,
} from '@/api/lab/sentinel';

import { ArrowDown } from '@element-plus/icons-vue';

const state = reactive({
  loading: false,
  flowLimitingDataList: [] as Result[],
  gatewayRouteFlowLimitingDataList: [] as Result[],
  gatewayApiFlowLimitingDataList: [] as Result[],
});

interface Result {
  code: any;
  msg: string;
}

const {
  loading,
  flowLimitingDataList,
  gatewayRouteFlowLimitingDataList,
  gatewayApiFlowLimitingDataList,
} = toRefs(state);

const loadFlowLimitingData = async () => {
  flowLimitingDataList.value = [];
  for (var i = 0; i < 10; i++) {
    getFlowLimitingData().then((response: any) => {
      flowLimitingDataList.value.push({
        code: response.code,
        msg: response.code == '00000' ? response.data : response.msg,
      });
    });
  }
};

const loadGatewayRouteFlowLimitingData = async () => {
  gatewayRouteFlowLimitingDataList.value = [];
  for (var i = 0; i < 10; i++) {
    getGatewayRouteFlowLimitingData().then((response: any) => {
      gatewayRouteFlowLimitingDataList.value.push({
        code: response.code,
        msg: response.code == '00000' ? response.data : response.msg,
      });
    });
  }
};

const loadGatewayApiFlowLimitingData = async () => {
  gatewayApiFlowLimitingDataList.value = [];
  for (var i = 0; i < 10; i++) {
    getGatewayApiFlowLimitingData().then((response: any) => {
      gatewayApiFlowLimitingDataList.value.push({
        code: response.code,
        msg: response.code == '00000' ? response.data : response.msg,
      });
    });
  }
};

onMounted(async () => {
  loadGatewayRouteFlowLimitingData();
  setTimeout(() => {
    loadGatewayApiFlowLimitingData();
  }, 3000);
  setTimeout(() => {
    loadFlowLimitingData();
  }, 6000);
});
</script>

<template>
  <div class="app-container">
    <el-row :gutter="10" style="margin-top: 20px" v-loading="loading">
      <el-col :span="8" :xs="24" class="card-panel__col">
        <el-card class="box-card" shadow="always">
          <template #header>
            <div class="card-header">
              <el-link type="success">网关流控-RouteID</el-link>

              <el-dropdown>
                <span class="el-dropdown-link">
                  限流规则(QPS:3)
                  <el-icon class="el-icon--right">
                    <arrow-down />
                  </el-icon>
                </span>
                <template #dropdown>
                  <div>
                    { "resource": "ReactiveCompositeDiscoveryClient_youlai-lab",
                    "resourceMode": 0, "count": 3, "grade": 1 }
                  </div>
                </template>
              </el-dropdown>

              <el-button
                class="button"
                type="primary"
                @click="loadGatewayRouteFlowLimitingData"
                >请求</el-button
              >
            </div>
          </template>
          <el-alert
            :closable="false"
            v-for="(item, index) in gatewayRouteFlowLimitingDataList"
            :key="index"
            :title="'请求' + (index + 1) + '结果：' + item.msg"
            :type="item.code == '00000' ? 'success' : 'error'"
          />
        </el-card>
      </el-col>

      <el-col :span="8" :xs="24" class="card-panel__col">
        <el-card class="box-card" shadow="always">
          <template #header>
            <div class="card-header">
              <el-link type="info" :underline="false">网关流控-API分组</el-link>

              <el-dropdown>
                <span class="el-dropdown-link">
                  限流规则(QPS:3)
                  <el-icon class="el-icon--right">
                    <arrow-down />
                  </el-icon>
                </span>
                <template #dropdown>
                  <div>
                    { "apiName": "lab_group", "predicateItems": [ { "pattern":
                    "/api/v1/sentinel/gateway_api_flow_limiting/data",
                    "matchStrategy": 0 } ] }
                  </div>
                </template>
              </el-dropdown>

              <el-button
                class="button"
                type="primary"
                @click="loadGatewayApiFlowLimitingData"
                >请求</el-button
              >
            </div>
          </template>

          <el-alert
            :closable="false"
            v-for="(item, index) in gatewayApiFlowLimitingDataList"
            :key="index"
            :title="'请求' + (index + 1) + '结果：' + item.msg"
            :type="item.code == '00000' ? 'success' : 'error'"
          />
        </el-card>
      </el-col>
      <el-col :span="8" :xs="24" class="card-panel__col">
        <el-card class="box-card" shadow="always">
          <template #header>
            <div class="card-header">
              <el-link type="info" :underline="false">普通流控</el-link>

              <el-dropdown>
                <span class="el-dropdown-link">
                  限流规则(QPS:2)
                  <el-icon class="el-icon--right">
                    <arrow-down />
                  </el-icon>
                </span>
                <template #dropdown>
                  <div>
                    { "resource":"/api/v1/sentinel/flow_limiting/data",
                    "count":2, "grade":1, "limitApp":"default" }
                  </div>
                </template>
              </el-dropdown>

              <el-button
                class="button"
                type="primary"
                @click="loadFlowLimitingData"
                >请求</el-button
              >
            </div>
          </template>
          <el-alert
            :closable="false"
            v-for="(item, index) in flowLimitingDataList"
            :key="index"
            :title="'请求' + (index + 1) + '结果：' + item.msg"
            :type="item.code == '00000' ? 'success' : 'error'"
          />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.el-alert {
  margin-bottom: 10px;
}
</style>
