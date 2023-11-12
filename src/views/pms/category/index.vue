<script setup lang="ts">
defineOptions({
  name: "Category",
  inheritAttrs: false,
});
const state = reactive({
  category: {
    id: undefined,
    name: "",
    childrenLen: 0,
  },
});

const { category } = toRefs(state);

function handleCategoryClick(categoryRow: any) {
  if (categoryRow) {
    state.category = {
      id: categoryRow.id,
      name: categoryRow.name,
      childrenLen: categoryRow.children.length,
    };
  } else {
    state.category = {
      id: undefined,
      name: "",
      childrenLen: 0,
    };
  }
}
</script>

<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col :span="14" :xs="24">
        <el-card class="box-card" shadow="always">
          <template #header>
            <svg-icon icon-class="menu" />
            商品分类
          </template>
          <Category ref="categoryRef" @category-click="handleCategoryClick" />
        </el-card>
      </el-col>

      <el-col :span="10" :xs="24">
        <el-card class="box-card" shadow="always">
          <template #header>
            <svg-icon icon-class="menu" />
            {{ category.name }} 规格属性
          </template>
          <!-- 商品规格 -->
          <Attribute
            ref="specificationRef"
            :attributeType="1"
            :category="category"
          />
          <!-- 商品属性 -->
          <Attribute
            ref="attributeRef"
            :attributeType="2"
            :category="category"
          />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
