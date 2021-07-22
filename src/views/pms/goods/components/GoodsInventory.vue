<template>
  <div class="components-container">
    <div class="components-container__main">
      <el-card class="box-card">
        <div slot="header">
          <span>商品规格</span>
          <el-button style="float: right;" type="primary" size="mini" @click="handleSpecAdd">
            添加规格
          </el-button>
        </div>
        <el-form size="mini" ref="specForm" :inline="true" :model="value">
          <el-table size="mini" ref="specTable" :data="specList" highlight-current-row border>
            <el-table-column label="规格名" width="200">
              <template slot-scope="scope">
                <span> {{ scope.row.name }} </span>
              </template>
            </el-table-column>

            <el-table-column label="规格值">
              <template slot-scope="scope">
                <div style="margin-right:15px;display: inline-block" v-for="item in scope.row.values">
                  <el-tag
                    closable
                    :type="types[scope.$index%types.length]"
                    @close="handleTagClose(scope.$index,item)"
                  >
                    {{ item.value }}
                  </el-tag>
                  <mini-card-upload v-show="scope.$index==0" style="margin-top: 5px" v-model="scope.row.picUrl"/>
                </div>
              </template>
            </el-table-column>

            <el-table-column align="center" label="拖拽排序" width="80">
              <template slot-scope="{}">
                <svg-icon class="drag-handler" icon-class="drag"/>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </el-card>

    </div>
    <div class="components-container__footer">
      <el-button @click="handlePrev">上一步，设置商品属性</el-button>
      <el-button type="primary" @click="handleSubmit">提交</el-button>
    </div>
  </div>
</template>

<script>
import {listAttribute} from "@/api/pms/attribute";
import MiniCardUpload from '@/components/Upload/MiniCardUpload'
import Sortable from "sortablejs";

export default {
  name: "GoodsInventory",
  components: {MiniCardUpload},
  props: {
    value: Object
  },

  data() {
    return {
      specList: [],
      rules: {
        attribute: {
          name: [{required: true, message: '请填写参数名称', trigger: 'blur'}],
          value: [{required: true, message: '请填写参数值', trigger: 'blur'}]
        }
      },
      types: ['', 'success', 'info', 'warning', 'danger'],

    }
  },
  created() {
    this.loadData()
  },
  methods: {
    async loadData() {
      // 获取规格列表，type:1表示规格
      const data = await listAttribute({categoryId: this.value.categoryId, type: 1})
      this.specList = data.data
      this.specList.forEach(spec => {
        spec.values = this.value.specList.filter(item => item.attributeId == spec.id)
      })
      this.$nextTick(() => {
        this.setSort()
      })
    },
    handleSpecAdd: function () {
      this.value.attrList.push({})
    },
    handleSpecificationRemove: function (index) {
      this.value.attrList.splice(index, 1)
    },
    handleTagClose: function (rowIndex, specItem) {
      const removeIndex = this.specList[rowIndex].values.indexOf(specItem)
      console.log('removeIndex', removeIndex)
    },
    setSort() {
      const el = this.$refs.specTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
      Sortable.create(el, {
        ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
        setData: function (dataTransfer) {
          dataTransfer.setData('Text', '')
        },
        onEnd: evt => {
          console.log('evt.oldIndex',evt.oldIndex,evt.newIndex)
          const targetRow = this.specList.splice(evt.oldIndex, 1)[0]
          console.log('targetRow',targetRow)
          this.specList.splice(evt.newIndex, 0, targetRow)
          this.$forceUpdate()
        }
      })
    },
    handlePrev: function () {
      this.$emit('prev')
    },
    handleSubmit: function () {
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
