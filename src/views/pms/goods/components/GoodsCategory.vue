<template>
  <div class="components-container">
    <div class="components-container__main">
      <el-cascader-panel
        ref="cascader"
        :options="options"
        :props="{emitPath:false}"
        @change="handleCategoryChange"
        v-model="categoryId"/>

      <div style="margin-top: 20px">
        <el-link type="info" :underline="false" v-show="pathLabels.length>0">您选择的商品分类:</el-link>
        <el-link type="danger" :underline="false" v-for="(item,index) in pathLabels" style="margin-left: 5px">
          {{ item }}
          <i v-show="index!=2" class=" el-icon-arrow-right"></i>
        </el-link>
      </div>

    </div>
    <div class="components-container__footer">
      <el-button type="primary" @click="handleNext">下一步，填写商品信息</el-button>
    </div>
  </div>
</template>

<script>
import {cascadeList} from "@/api/pms/category";

export default {
  name: "GoodsCategory",
  props: {
    value: Object
  },
  data() {
    return {
      options: undefined,
      pathLabels: [],
      categoryId: undefined
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    loadData: function () {
      cascadeList().then(response => {
        this.options = response.data
        if (this.value.id) {
          this.categoryId = this.value.categoryId
          this.$nextTick(() => {
            this.handleCategoryChange()
          })
        }
      })
    },
    handleCategoryChange: function () {
      const checkNode = this.$refs.cascader.getCheckedNodes()[0]
      this.pathLabels = checkNode.pathLabels // 商品分类选择层级提示
      this.value.categoryId = checkNode.value
    },
    handleNext: function () {
      if (!this.value.categoryId) {
        this.$message.warning('请选择商品分类')
        return
      }
      this.$emit('next')
    }
  }
}
</script>

<style lang="scss" scoped>

.components-container {
  &__main {
    margin: 20px auto
  }

  &__footer {
    position: fixed;
    bottom: 20px;
    right: 20px;
  }
}
</style>
