<!--商品列表-->
<script setup lang="ts">
defineOptions({
  name: "Goods",
  inheritAttrs: false,
});

import { useRouter } from "vue-router";
import { getSpuPage, deleteSpu } from "@/api/pms/goods";
import { getCategoryOptions } from "@/api/pms/category";
import { moneyFormatter } from "@/utils/filter";
import { Goods, GoodsQuery } from "@/api/pms/goods/types";

const dataTableRef = ref(ElTable);
const router = useRouter();

const state = reactive({
  // 遮罩层
  loading: true,
  // 选中数组
  ids: [],
  total: 0,
  queryParams: {
    pageNum: 1,
    pageSize: 10,
  } as GoodsQuery,
  goodsList: [] as Goods[],
  categoryOptions: [] as OptionType[],
  goodDetail: undefined,
  dialogVisible: false,
});

const {
  loading,
  ids,
  queryParams,
  goodsList,
  categoryOptions,
  goodDetail,
  total,
  dialogVisible,
} = toRefs(state);

function handleQuery() {
  state.loading = true;
  getSpuPage(state.queryParams).then(({ data }) => {
    state.goodsList = data.list;
    state.total = data.total;
    state.loading = false;
  });
}

function resetQuery() {
  state.queryParams = {
    pageNum: 1,
    pageSize: 10,
    name: undefined,
    categoryId: undefined,
  };
  handleQuery();
}

function handleGoodsView(detail: any) {
  state.goodDetail = detail;
  state.dialogVisible = true;
}

function handleAdd() {
  router.push({ path: "goods-detail" });
}

function handleUpdate(row: any) {
  router.push({
    path: "goods-detail",
    query: { goodsId: row.id, categoryId: row.categoryId },
  });
}

function handleDelete(row: any) {
  const ids = row.id || state.ids.join(",");
  ElMessageBox.confirm("是否确认删除选中的数据项?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(function () {
      return deleteSpu(ids);
    })
    .then(() => {
      ElMessage.success("删除成功");
      handleQuery();
    });
}

function handleRowClick(row: any) {
  dataTableRef.value.toggleRowSelection(row);
}

function handleSelectionChange(selection: any) {
  state.ids = selection.map((item: { id: any }) => item.id);
}

onMounted(() => {
  getCategoryOptions().then(({ data }) => {
    categoryOptions.value = data;
  });
  handleQuery();
});
</script>

<template>
  <div class="app-container">
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item label="关键字">
          <el-input
            v-model="queryParams.name"
            placeholder="商品名称"
            clearable
          />
        </el-form-item>
        <el-form-item label="商品分类">
          <el-cascader
            v-model="queryParams.categoryId"
            placeholder="全部"
            :props="{ emitPath: false }"
            :options="categoryOptions"
            clearable
            style="width: 300px"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleQuery"
            ><i-ep-search /> 搜索</el-button
          >
          <el-button @click="resetQuery"><i-ep-refresh /> 重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-card>
      <template #header>
        <el-button type="success" @click="handleAdd"
          ><i-ep-plus /> 新增</el-button
        >
        <el-button
          type="danger"
          :disabled="ids.length === 0"
          @click="handleDelete"
          ><i-ep-delete />删除</el-button
        >
      </template>

      <el-table
        ref="dataTableRef"
        v-loading="loading"
        :data="goodsList"
        border
        @selection-change="handleSelectionChange"
        @row-click="handleRowClick"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column type="expand" width="120" label="商品库存">
          <template #default="props">
            <el-table :data="props.row.skuList" border>
              <el-table-column align="center" label="商品编码" prop="skuSn" />
              <el-table-column
                align="left"
                label="规格名称"
                prop="name"
                width="400"
              />
              <el-table-column label="图片" prop="picUrl">
                <template #default="scope">
                  <img :src="scope.row.picUrl" width="40" />
                </template>
              </el-table-column>
              <el-table-column align="center" label="价格" prop="price">
                <template #default="scope">{{
                  moneyFormatter(scope.row.price)
                }}</template>
              </el-table-column>
              <el-table-column align="center" label="库存" prop="stockNum" />
            </el-table>
          </template>
        </el-table-column>
        <el-table-column label="商品名称" prop="name" />
        <el-table-column label="图片">
          <template #default="scope">
            <el-popover placement="right" :width="400" trigger="hover">
              <img :src="scope.row.picUrl" width="400" height="400" />
              <template #reference>
                <img
                  :src="scope.row.picUrl"
                  style="max-width: 60px; max-height: 60px"
                />
              </template>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="商品类目" prop="categoryName" min-width="100" />
        <el-table-column label="商品品牌" prop="brandName" min-width="100" />
        <el-table-column align="center" label="零售价" prop="originalPrice">
          <template #default="scope">{{
            moneyFormatter(scope.row.originPrice)
          }}</template>
        </el-table-column>
        <el-table-column align="center" label="促销价" prop="price">
          <template #default="scope">{{
            moneyFormatter(scope.row.price)
          }}</template>
        </el-table-column>
        <el-table-column label="销量" prop="sales" width="100" />
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button
              type="success"
              link
              @click.stop="handleGoodsView(scope.row.detail)"
              >查看详情</el-button
            >
            <el-button
              type="primary"
              link
              @click.stop="handleUpdate(scope.row)"
            >
              编辑</el-button
            >
            <el-button type="danger" link @click.stop="handleDelete(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分页工具条 -->
    <pagination
      v-if="total > 0"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      :total="total"
      @pagination="handleQuery"
    />
    <el-dialog v-model="dialogVisible" title="商品详情">
      <div class="goods-detail-box" v-html="goodDetail"></div>
    </el-dialog>
  </div>
</template>
