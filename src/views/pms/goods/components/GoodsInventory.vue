<template>
  <div class="components-container">
    <div class="components-container__main">
      <el-card class="box-card">
        <div slot="header">
          <span>商品规格</span>
          <el-button style="float: right;" type="primary" size="mini" @click="handleSpecificationAdd">
            添加规格
          </el-button>
        </div>
        <el-form size="mini" ref="specificationForm" :inline="true" :model="value">
          <el-table size="mini" :data="value.specList" highlight-current-row border>
            <el-table-column label="规格名">
              <template slot-scope="scope">
                {{ scope.row.name }}
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </el-card>

    </div>
    <div class="components-container__footer">
      <el-button @click="handlePrev">上一步，填写商品信息</el-button>
      <el-button type="primary" @click="handleNext">下一步，设置商品库存</el-button>
    </div>
  </div>
</template>

<script>
import {listAttribute} from "@/api/pms/attribute";

export default {
  name: "GoodsAttribute",
  props: {
    value: Object
  },
  watch: {
    'value.categoryId': {
      handler: function (val) {
        console.log('value.categoryId', val)
      }
    }
  },
  data() {
    return {
      rules: {
        attribute: {
          name: [{required: true, message: '请填写参数名称', trigger: 'blur'}],
          value: [{required: true, message: '请填写参数值', trigger: 'blur'}]
        }
      },
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    loadData() {
      if (!this.value.id) {
        listAttribute({categoryId: this.value.categoryId, type: 1}).then(res => {
          this.value.specList = res.data
        })
      }
    },
    handleSpecificationAdd: function () {
      this.value.attrList.push({})
    },
    handleSpecificationRemove: function (index) {
      this.value.attrList.splice(index, 1)
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
