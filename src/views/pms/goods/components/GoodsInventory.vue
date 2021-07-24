<template>
  <div class="components-container">
    <div class="components-container__main">
      <el-card class="box-card">
        <div slot="header">
          <span>商品规格</span>
          <el-button style="float: right;" type="primary" size="mini" @click="handleSpecAdd">
            添加规格项
          </el-button>
        </div>
        <el-form size="mini" ref="specForm" :inline="true" :model="value">
          <el-table size="mini" ref="specTable" :data="specList" row-key="id" fit highlight-current-row border>
            <el-table-column align="center" label="" width="50">
              <template slot-scope="{}">
                <svg-icon class="drag-handler" icon-class="drag"/>
              </template>
            </el-table-column>
            <el-table-column label="规格名" width="200">
              <template slot-scope="{row}">
                <el-input type="text" v-model="row.name" size="mini"></el-input>
              </template>
            </el-table-column>
            <el-table-column>
              <template slot="header">
                规格值
                <el-link type="danger" style="font-size:12px" :underline="false">（默认第一条规格包含图片）</el-link>
              </template>
              <template slot-scope="scope">
                <div style="margin-right:15px;display: inline-block" v-for="item in scope.row.values">
                  <el-tag
                    closable
                    :type="types[scope.$index%types.length]"
                    @close="handleSpecValueRemove(scope.$index,item)">
                    {{ item.value }}
                  </el-tag>
                  <mini-card-upload v-show="scope.$index==0" style="margin-top: 5px" v-model="scope.row.picUrl"/>
                </div>
                <el-input
                  style="width: 80px;vertical-align: top"
                  size="mini"
                  v-if="tagInputs[scope.$index].visible"
                  v-model="tagInputs[scope.$index].value"
                  @keyup.enter.native="handleSpecValueInput(scope.$index)"
                  @blur="handleSpecValueInput(scope.$index)"/>
                <el-button v-else size="mini" icon="el-icon-plus" style="vertical-align: top"
                           @click="handleSpecValueAdd(scope.$index)">添加规格值
                </el-button>
              </template>
            </el-table-column>

            <el-table-column width="60" label="操作">
              <template slot-scope="scope">
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  circle
                  plain
                  @click.stop="handleSpecRemove(scope.$index)"/>
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
      tagInputs: [{value: undefined, visible: false}], // 规格值标签临时值和显隐控制
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    async loadData() {
      // type: 1-规格；2-属性
      const data = await listAttribute({categoryId: this.value.categoryId, type: 1})
      this.specList = data.data
      this.specList.forEach((item, index) => {
        this.tagInputs.push({})
        this.$set(this.tagInputs[index],"value",undefined);
        this.$set(this.tagInputs[index],"visible",false);
        item.values = this.value.specList.filter(data => data.attributeId == item.id)
      })
      this.$nextTick(() => {
        this.setSort()
      })
    },
    handleSpecAdd: function () {
      if (this.specList.length >= 3) {
        this.$message.warning('最多支持3组规格')
        return
      }
      this.specList.push({})
      this.tagInputs[this.specList.length - 1] = {value: undefined, visible: false}
    },
    handleSpecRemove: function (index) {
      this.specList.splice(index, 1)
      this.tagInputs.splice(index, 1)
    },
    handleSpecValueRemove: function (rowIndex, specItem) {
      const removeIndex = this.specList[rowIndex].values.indexOf(specItem)
    },
    handleSpecValueInput: function (rowIndex) {
      const currSpecValue = this.tagInputs[rowIndex].value

    },
    handleSpecValueAdd: function (rowIndex) {
      this.tagInputs[rowIndex].visible = true
    },
    setSort() {
      const el = this.$refs.specTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
      Sortable.create(el, {
        ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
        setData: function (dataTransfer) {
          dataTransfer.setData('Text', '')
        },
        onEnd: evt => {
          // oldIndex 拖拽行当前所在索引
          // newIndex 拖拽行目标索引
          const targetRow = this.specList.splice(evt.oldIndex, 1)[0] //  返回被删除的行
          this.specList.splice(evt.newIndex, 0, targetRow) // 拼接
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
