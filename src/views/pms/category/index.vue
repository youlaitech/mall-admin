<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col :span="16" :xs="24">
        <category ref="category" @categoryClick="categoryClick"></category>
      </el-col>
      <el-col :span="8" :xs="24">
        <attribute ref="attribute"></attribute>
        <specification ref="specification"></specification>
      </el-col>
    </el-row>
  </div>
</template>

<script>

import Category from './components/Category'
import Attribute from './components/Attribute'
import Specification from './components/Specification'

export default {
  name: "index",
  components: {Attribute, Category, Specification},
  data() {
    return {}
  },
  methods: {
    categoryClick(category) {
      this.$refs.attribute.categoryClick(category)
      this.$refs.specification.categoryClick(category)
    }
  }
}
</script>

<style scoped>

</style>
