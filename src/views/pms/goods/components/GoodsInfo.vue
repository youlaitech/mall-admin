<template>
  <div class="components-container">
    <div class="components-container__main">
     商品基本信息
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
    'value.spuInfo': {
      handler: function (val, oldVal) {
        console.log('value.spuInfo', val)
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
