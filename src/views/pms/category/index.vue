<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col :span="16" :xs="24">
        <category ref="category" @categoryClick="categoryClick"></category>
      </el-col>

      <el-col :span="8" :xs="24">
        <!-- 商品规格 -->
        <attribute ref="spec" :attributeType="1"></attribute>
        <!-- 商品属性 -->
        <attribute ref="attr" :attributeType="2"></attribute>
      </el-col>
    </el-row>
  </div>
</template>

<script>

import Category from './components/Category'
import Attribute from './components/Attribute'

export default {
  name: "index",
  components: {Attribute, Category},
  data() {
    return {}
  },
  methods: {
    categoryClick(category) {
      this.$refs.spec.categoryClick(category)
      this.$refs.attr.categoryClick(category)
    }
  }
}
</script>

<style scoped>

</style>
