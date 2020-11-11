<template>
  <div class="app-container">

    <!-- 商品信息 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>商品介绍</span>
      </div>
      <el-form
        ref="goodsForm"
        :rules="rules"
        :model="form"
        label-width="150px">

        <el-form-item label="商品名称" prop="goods.name">
          <el-input v-model="form.goods.name"/>
        </el-form-item>

        <el-form-item label="原始价格" prop="goods.originPrice">
          <el-input v-model="form.goods.originPrice"/>
        </el-form-item>

        <el-form-item label="当前价格" prop="goods.price">
          <el-input v-model="form.goods.price"/>
        </el-form-item>

        <el-form-item label="是否在售" prop="goods.status">
          <el-radio-group v-model="form.goods.status">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="商品主图" prop="goods.pic">
          <single-upload v-model="form.goods.pic"></single-upload>
        </el-form-item>

        <el-form-item label="商品图册" prop="goods.album">
          <multi-upload v-model="form.goods.album"></multi-upload>
        </el-form-item>

        <el-form-item label="所属类目" prop="goods.categoryId">
          <el-cascader v-model="form.goods.categoryId" :options="categoryOptions"
                       expand-trigger="hover" clearable/>
        </el-form-item>
        <el-form-item label="所属品牌" prop="goods.categoryId">
          <el-select v-model="form.goods.brandId" clearable>
            <el-option v-for="item in brandOptions" :key="item.id" :label="item.name" :value="item.id"/>
          </el-select>
        </el-form-item>

        <el-form-item label="商品简介" prop="goods.description">
          <el-input v-model="form.goods.description"/>
        </el-form-item>

        <el-form-item label="商品详情" prop="goods.detail">
          <tinymce ref="editor" v-model="form.goods.detail" :height="400"/>
        </el-form-item>

      </el-form>
    </el-card>

    <!-- 商品参数 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>商品参数</span>
        <el-button style="float: right;" type="primary" size="mini" @click="handleAddAttribute">添加参数
        </el-button>
      </div>
      <el-form size="mini"
               ref="attributeForm"
               :model="form"
               :inline="true"
      >
        <el-table
          :data="form.attributes"
          highlight-current-row
          border>
          <el-table-column property="name" label="参数名称">
            <template slot-scope="scope">
              <el-form-item :prop="'attributes[' + scope.$index + '].name'" :rules="rules.attribute.name">
                <el-input v-model="scope.row.name"></el-input>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column property="value" label="参数值">
            <template slot-scope="scope">
              <el-form-item :prop="'attributes[' + scope.$index + '].value'" :rules="rules.attribute.value">
                <el-input v-model="scope.row.value"></el-input>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-form-item>
                <el-button type="danger" icon="el-icon-minus" circle @click="handleRemoveAttribute(scope.$index)"/>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
    </el-card>

    <!-- 商品规格 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>商品规格</span>
        <el-button style="float: right;" type="primary" size="mini" @click="handleAddSpecification">添加规格
        </el-button>
      </div>
      <el-form size="mini"
               ref="specificationForm"
               :model="form"
               :inline="true">
        <el-table
          :data="form.specifications"
          :span-method="specificationSpanMethod"
          highlight-current-row
          border>
          <el-table-column label="规格名称">
            <template slot-scope="scope">
              {{ scope.row.name }}
            </template>
          </el-table-column>
          <el-table-column label="规格值">
            <template slot-scope="scope">
              {{ scope.row.value }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-form-item>
                <el-button icon="el-icon-edit" size="mini" circle
                           @click="handleEditSpecification(scope.row,scope.$index)" title="修改规格"/>
                <el-button type="danger" icon="el-icon-minus" circle @click="handleRemoveSpecification(scope.$index)"/>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
    </el-card>

    <!-- 商品库存 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>商品库存</span>
      </div>

      <el-form size="mini"
               ref="skuForm"
               :model="form"
               :inline="true">

        <el-table
          :data="form.skuList"
          :span-method="skuSpanMethod"
          highlight-current-row
          border>

          <el-table-column
            v-for="title in specifications"
            :label="title"
            :prop="'specification_' + title">
          </el-table-column>

          <el-table-column
            prop="price"
            label="价格(元)">
            <template slot-scope="scope">
              <el-form-item :prop="'specifications[' + scope.$index + '].price'" :rules="rules.specification.price">
                <el-input-number v-model="scope.row.price" :precision="2" :min="0.01" :max="2147483647"/>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column
            prop="price"
            label="吊牌价(元)">
            <template slot-scope="scope">
              <el-form-item :prop="'specifications[' + scope.$index + '].price'" :rules="rules.specification.price">
                <el-input-number v-model="scope.row.originPrice" :precision="2" :min="0.01" :max="2147483647"/>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column
            label="库存"
            prop="stock">
            <template slot-scope="scope">
              <el-form-item :prop="'specifications[' + scope.$index + '].stock'">
                <el-input-number v-model="scope.row.stock" :precision="0" :max="2147483647" :min="0" size="small"/>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column property="pic" label="SKU图片">
            <template slot-scope="scope">
              <el-form-item :prop="'specifications[' + scope.$index + '].pic'">
                <mini-card-upload v-model="scope.row.pic"></mini-card-upload>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column
            prop="barCode"
            label="商品条码">
            <template slot-scope="scope">
              <el-form-item :prop="'specifications[' + scope.$index + '].barCode'">
                <el-input v-model="scope.row.barCode" maxlength="200">
                  <el-button slot="append" @click="handleGenerateBarCode(scope.row)">随机</el-button>
                </el-input>
              </el-form-item>
            </template>
          </el-table-column>

        </el-table>
      </el-form>
    </el-card>

    <div class="footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
    </div>

    <el-dialog
      :title="specificationDialog.title"
      :visible.sync="specificationDialog.visible"
      @close="closeSpecificationDialog"
      top="20vh"
      width="500px">
      <el-form label-width="120px" :model="specificationForm" :rules="specificationRules" ref="specificationForm">
        <el-form-item label="规格名称" prop="name">
          <el-select v-model="specificationForm.name" filterable allow-create default-first-option
                     placeholder="请填写或输入规格名称">
            <el-option v-for="name in new Set(form.specifications.map(d=>d.name))" :label="name" :value="name"/>
          </el-select>
        </el-form-item>
        <el-form-item label="规格值" prop="value" style="width:320px">
          <el-input v-model="specificationForm.value"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeSpecificationDialog">取 消</el-button>
        <el-button type="primary" @click="handleSubmitSpecification">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import {add, update} from '@/api/pms/goods'
import {list as categoryList} from '@/api/pms/category'
import {list as brandList} from '@/api/pms/brand'


import SingleUpload from '@/components/Upload/SingleUpload'
import MultiUpload from '@/components/Upload/MultiUpload'
import MiniCardUpload from '@/components/Upload/MiniCardUpload'
import Tinymce from '@/components/Tinymce'

export default {
  name: "GoodsDetail",
  components: {SingleUpload, MultiUpload, MiniCardUpload, Tinymce},
  data() {
    return {
      categoryOptions: [],
      brandOptions: [],
      form: {
        goods: {
          id: undefined,
          name: undefined,
          categoryId: undefined,
          brandId: undefined,
          originPrice: undefined,
          price: undefined,
          pic: undefined,
          album: [],
          unit: undefined,
          description: undefined,
          detail: undefined,
          status: 1
        },
        skuList: [],
        attributes: [],
        specifications: []
      },
      rules: {
        goods: {
          name: [{required: true, message: '请填写商品名称', trigger: 'blur'}],
          originPrice: [{required: true, message: '请填写商品原始价格', trigger: 'blur'}],
          price: [{required: true, message: '请填写商品当前价格', trigger: 'blur'}],
        },
        attribute: {
          name: [{required: true, message: '请填写参数名称', trigger: 'blur'}],
          value: [{required: true, message: '请填写参数值', trigger: 'blur'}]
        },
        specification: {
          name: [{required: true, message: '请填写规格名称', trigger: 'blur'}],
          value: [{required: true, message: '请填写规格值', trigger: 'blur'}]
        }
      },
      specificationDialog: {
        title: undefined,
        visible: false,
        type: undefined
      },
      specificationForm: {
        name: undefined,
        value: undefined,

        // 辅助属性
        index: undefined,
      },
      specificationRules: {
        name: [{required: true, message: '请填写规格名称', trigger: 'blur'}],
        value: [{required: true, message: '请填写规格值', trigger: 'blur'}]
      },
      cacheSkuList: [],
      specifications: []
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    async loadData() {
      await this.loadCategoryOptions()
      await this.loadBrandOptions()

    },
    loadCategoryOptions() {
      categoryList({queryMode: 2}).then(response => {
        this.categoryOptions = response.data
      })
    },
    loadBrandOptions() {
      brandList({queryMode: 2}).then(response => {
        this.brandOptions = response.data
      })
    },

    handleAddAttribute() {
      this.form.attributes.push({})
    },
    handleRemoveAttribute(index) {
      this.form.attributes.splice(index, 1)
    },

    handleAddSpecification() {
      this.specificationDialog.title = '添加规格'
      this.specificationDialog.visible = true
      this.specificationDialog.type = 'add'
    },
    handleEditSpecification(row, index) {
      this.specificationDialog.title = '修改规格'
      this.specificationDialog.visible = true
      this.specificationDialog.type = 'edit'
      this.specificationForm = {...row, ...{index: index}}
    },
    handleRemoveSpecification(index) {
      this.form.specifications.splice(index, 1)
    },
    handleSubmitSpecification() {
      const type = this.specificationDialog.type
      const {name, value, index} = this.specificationForm
      const repeatIndex = this.form.specifications.findIndex((v, i) => {
        if (type === 'edit') {
          // 与选中修改行规格重复为正常情况
          return i != index && v.name == name && v.value == value
        }
        return v.name == name && v.value == value
      })

      if (repeatIndex !== -1) {
        this.$message.error('规格已存在，请勿重复添加')
        return false
      }
      if (type === 'edit') {
        this.$set(this.form.specifications, index, this.specificationForm)
      } else {
        this.form.specifications.push({...this.specificationForm})
      }
      // 生成规格列表
      this.generateSkuList()
      this.closeSpecificationDialog()
    },
    closeSpecificationDialog() {
      this.specificationForm = {}
      this.specificationDialog.title = undefined
      this.specificationDialog.visible = false
    },
    // 规格表合并单元格
    specificationSpanMethod({row, column, rowIndex, columnIndex}) {
      if (columnIndex === 1110) {
        return {
          rowspan: rowIndex,
          colspan: 1
        }
      }
    },
    generateSkuList() {
      // 根据specifications创建临时规格列表
      // [
      //    {'name':'颜色','value':'蓝色'},
      //    {'name':'颜色','value':'黑色'},
      //    {'name':'颜色','value':'玫瑰金'} ,
      //    {'name':'内存','value':'4G'},
      //    {'name':'内存','value':'6G'},
      //    {'name':'内存','value':'8G'},
      //    {'name':'存储','value':'32G'},
      //    {'name':'存储','value':'64G'},
      //    {'name':'存储','value':'128G'}
      // ]
      let specifications = JSON.parse(JSON.stringify(this.form.specifications)) // 深拷贝
      // 归并
      // [
      //    { 'name':'颜色','value':'蓝色,黑色,玫瑰金' },
      //    { 'name':'存储','value':'4G+32G,6G+128G,8G+256G'},
      // ]
      const list = specifications.reduce((c, n) => {
        const idx = c.t.indexOf(n.name);
        if (idx > -1) {
          c.v[idx].value = c.v[idx].value + ',' + n.value
        } else {
          c.v.push(n);
          c.t.push(n.name)
        }
        return c
      }, {v: [], t: []}).v
      console.log('list', list)

      const test = list.reduce((prev, curr) => {
        console.log('prev',prev,'curr',curr)
        current.value.split(',').forEach(c => {
          next.value.split(',').forEach(n => {
            return c.concat(n)
          })
        })
      }, {})

      console.log(test)

      /*
            this.specifications = []
            this.form.skuList = []

            list.forEach(item => {
              console.log(item.value)
              this.specifications.push(item.name)
              item.value.split(',').forEach(value => {
                let sku = {}
                sku['specification_' + item.name] = value
                this.form.skuList.push(sku)
              })
            })
      */

      /*item.value.split(',').forEach(v => {
        let obj = {}

        this.form.skuList.push({})
      })*/
    },
    skuSpanMethod({row, column, rowIndex, columnIndex}) {

    },
    handleGenerateBarCode(row) {
      row.barCode = new Date().getTime() + ''
      this.$forceUpdate()
    },
    handleSubmit() {
      console.log("表单数据", this.form)
    },
    close() {

    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  width: 80%;
  margin: 0 auto 50px;

  .footer {
    position: fixed;
    bottom: 20px;
    right: 20px;
  }

  .box-card {
    margin-top: 20px;
  }

}

</style>
