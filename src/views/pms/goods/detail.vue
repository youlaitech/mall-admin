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
              <el-form-item :prop="'specifications[' + scope.$index + '].name'" :rules="rules.specification.name">
                <el-input v-model="scope.row.name" @input="handleSpecificationChange"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="规格值">
            <template slot-scope="scope">
              <el-form-item :prop="'specifications[' + scope.$index + '].value'" :rules="rules.specification.value">
                <el-input v-model="scope.row.value"
                          @input="handleSpecificationChange(scope.row,scope.$index)"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-form-item>
                <el-button icon="el-icon-plus" size="mini" circle
                           @click="handleAddSpecificationValue(scope.row,scope.$index)" title="添加规格值"/>
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
            v-for="(item, index) in form.specifications"
            :label="item.name">
            <template slot-scope="scope">
              {{scope.row.value}}
            </template>
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
              <el-input-number v-model="scope.row.stock" :precision="0" :max="2147483647" :min="0" size="small"/>
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
              <el-input v-model="scope.row.barCode" maxlength="200">
                <el-button slot="append" @click="handleGenerateBarCode(scope.row)">随机</el-button>
              </el-input>
            </template>
          </el-table-column>

        </el-table>
      </el-form>
    </el-card>

    <div class="footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
    </div>
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
          value: [{required: true, message: '请填写参数值', trigger: 'blur'}]
        }
      }
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
      this.form.specifications.push({})
    },
    handleAddSpecificationValue(row, index) {
      this.form.specifications.push({
        name: row.name,
        value: undefined
      })
    },
    handleSpecificationChange() {

    },
    handleRemoveSpecification(index) {
      this.form.specifications.splice(index, 1)
    },
    // 规格表合并单元格
    specificationSpanMethod({row, column, rowIndex, columnIndex}) {
      console.log(row, column, rowIndex, columnIndex)
      if (columnIndex === 1110) {
        return {
          rowspan: rowIndex,
          colspan: 1
        }
      }
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
    cancel() {

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
