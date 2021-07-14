<template>
  <div class="components-container">
    <div class="components-container__main">
      <el-cascader-panel
        ref="cascader"
        :options="options"
        :props="{emitPath:false}"
        @change="handleCategoryChange"
      />

      <div style="margin-top: 20px">
        <el-link type="info" :underline="false">您选择的商品分类:</el-link>
        <el-link type="danger" :underline="false" v-for="(item,index) in pathLabels" style="margin-left: 5px">
          {{ item }}
          <i v-show="index!=2" class=" el-icon-arrow-right"></i>
        </el-link>
      </div>

    </div>
    <div class="components-container__footer">
      <el-button @click="handlePrev">上一步</el-button>
      <el-button type="primary" @click="handleNext">下一步</el-button>
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
  watch: {
    'value.spuInfo.categoryId': {
      handler: function (val) {
        console.log('categoryId', val)
      }
    }
  },
  data() {
    return {
      options: undefined,
      pathLabels: []
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    loadData: function () {
      cascadeList().then(response => {
        this.options = response.data
      })
    },
    handleCategoryChange: function () {
      const checkNode = this.$refs.cascader.getCheckedNodes()[0]
      this.pathLabels = checkNode.pathLabels // 商品分类选择层级提示
      this.value.spuInfo.categoryId = checkNode.value
    },
    handlePrev: function () {
      this.$emit('prev')
    },
    handleNext: function () {
      if (!this.value.spuInfo.categoryId) {
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
