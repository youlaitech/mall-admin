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
        <el-form size="mini" ref="specForm" :inline="true">
          <el-table size="mini" ref="specTable" :data="specList" row-key="id" fit highlight-current-row border>
            <el-table-column align="center" label="" width="50">
              <template slot-scope="{}">
                <svg-icon class="drag-handler" icon-class="drag"/>
              </template>
            </el-table-column>
            <el-table-column label="规格名" width="200">
              <template slot-scope="{row}">
                <el-input type="text" v-model="row.name" size="mini"
                          @input="handleSpecNameInput(row,row.index)"></el-input>
              </template>
            </el-table-column>
            <el-table-column>
              <template slot="header">
                规格值
                <el-link type="danger" style="font-size:12px" :underline="false">（默认第一条规格包含图片）</el-link>
              </template>
              <template slot-scope="{row}">
                <div style="margin-right:15px;display: inline-block" v-for="item in row.values">
                  <el-tag
                    closable
                    :type="types[row.index%types.length]"
                    @close="handleSpecValueRemove(row.index,item)">
                    {{ item.value }}
                  </el-tag>
                  <mini-card-upload v-if="row.index==0" style="margin-top: 5px" v-model="row.picUrl"/>
                </div>
                <el-input
                  style="width: 80px;vertical-align: top"
                  size="mini"
                  v-if="tagInputs[row.index].visible"
                  v-model="tagInputs[row.index].value"
                  @keyup.enter.native="handleSpecValueInput(row.index)"
                  @blur="handleSpecValueInput(row.index)"/>
                <el-button v-else size="mini" icon="el-icon-plus" style="vertical-align: top"
                           @click="handleSpecValueAdd(row.index)">添加规格值
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

      <el-card class="box-card">
        <div slot="header">
          <span>商品库存</span>
        </div>
        <el-form size="mini" ref="skuForm" :inline="true">
          <el-table size="mini" ref="stockTable" :data="skuList" fit highlight-current-row border>
            <el-table-column
              v-for="(item,index) in specTempList"
              align="center"
              :prop="'specValue'+(index+1)"
              :label="item.name">
            </el-table-column>
            <el-table-column prop="sn" label="商品编码" align="center">
            </el-table-column>
            <el-table-column prop="price" label="现价（元）" align="center">
            </el-table-column>
            <el-table-column prop="originPrice" label="原价（元）" align="center">
            </el-table-column>
            <el-table-column prop="stock" label="库存" align="center">
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
  name: "GoodsStock",
  components: {MiniCardUpload},
  props: {
    value: Object
  },

  data() {
    return {
      specList: [],
      specTempList: [],
      rules: {
        attribute: {
          name: [{required: true, message: '请填写参数名称', trigger: 'blur'}],
          value: [{required: true, message: '请填写参数值', trigger: 'blur'}]
        }
      },
      types: ['', 'success', 'warning', 'danger'],
      tagInputs: [{value: undefined, visible: false}], // 规格值标签临时值和显隐控制
      skuList: []
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    async loadData() {
      // type: 1-规格；2-属性
      const {data} = await listAttribute({categoryId: this.value.categoryId, type: 1})
      this.specList = data
      this.specList.forEach((item, index) => {
        this.tagInputs.push({})
        this.$set(this.tagInputs[index], "value", undefined);
        this.$set(this.tagInputs[index], "visible", false);
        item.values = this.value.specList.filter(data => data.attributeId == item.id)
      })
      this.handleSpecSort()
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
      const index = this.specList.length - 1
      this.tagInputs.push({})
      this.$set(this.tagInputs[index], "value", undefined);
      this.$set(this.tagInputs[index], "visible", false);
      this.handleSpecSort()
    },
    handleSpecRemove: function (index) {
      this.specList.splice(index, 1)
      this.tagInputs.splice(index, 1)
      this.handleSpecSort()
    },
    handleSpecSort: function () {
      this.specList.forEach((item, index) => {
        item.index = index
      })
    },
    handleSpecValueRemove: function (rowIndex, specItem) {
      const removeIndex = this.specList[rowIndex].values.indexOf(specItem)
    },
    handleSpecValueInput: function (rowIndex) {
      const currSpecValue = this.tagInputs[rowIndex].value
      const specValues = this.specList[rowIndex].values
      if (specValues && specValues.length > 0 && specValues.map(item => item.value).includes(currSpecValue)) {
        this.$message.warning("规格值重复，请重新输入")
        return false
      }
      if (currSpecValue) {
        if (specValues && specValues.length > 0) {
          this.specList[rowIndex].values[specValues.length] = {'value': currSpecValue}
        } else {
          this.specList[rowIndex].values = [{'value': currSpecValue}]
        }
      }
      this.tagInputs[rowIndex].value = undefined
      this.tagInputs[rowIndex].visible = false

      // 生成SKU列表
      this.handleSkuGenerate()
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
          this.handleSpecSort()
        }
      })
    },
    handleSkuGenerate: function () {
      // [
      //    { 'id':1,'name':'颜色','values':[{id:1,value:'白色'},{id:2,value:'黑色'},{id:3,value:'蓝色'}] },
      //    { 'id':2,'name':'版本','values':[{id:1,value:'6+128G'},{id:2,value:'8+128G'},{id:3,value:'8G+256G'}] }
      // ]
      const specList = JSON.parse(JSON.stringify(this.specList)) // 深拷贝

      this.skuList = specList.reduce((acc, curr) => {
        let result = []
        acc.forEach((item, index) => {  // item=> {}
          // curr => { 'id':1,'name':'颜色','values':[{id:1,value:'白色'},{id:2,value:'黑色'},{id:3,value:'蓝色'}] }
          curr.values.forEach(v => {  // v=>{id:1,value:'白色'}
            if (!v.id) {
              v.id = 'x' + index
            }
            let temp = {}
            Object.assign(temp, item) // item=>{name:'白色 ',specs:1,}
            temp.specValues += v.value + '_' // 规格值拼接
            temp.specIds += v.id + '_' // 规格ID拼接
            result.push(temp)
          })
        })
        return result
      }, [{specValues: '', specIds: ''}])

      this.skuList.forEach(sku => {
        sku.specValues.substring(0, sku.specValues.length - 1).split('_').forEach((value, index) => {
          const key = 'specValue' + (index + 1)
          sku[key] = value
        })
      })
    },
    handleSpecNameInput: function () {
      this.specTempList = JSON.parse(JSON.stringify(this.specList));
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
