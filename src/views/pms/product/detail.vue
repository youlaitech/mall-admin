<template>
  <div class="app-container">

    <!-- 商品信息 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>商品介绍</span>
      </div>
      <el-form
        ref="spuForm"
        :rules="rules"
        :model="form"
        label-width="150px">

        <el-form-item label="商品名称" prop="spu.name">
          <el-input v-model="form.spu.name"/>
        </el-form-item>

        <el-form-item label="原价" prop="spu.originPrice">
          <el-input v-model="form.spu.originPrice"/>
        </el-form-item>

        <el-form-item label="现价" prop="spu.price">
          <el-input v-model="form.spu.price"/>
        </el-form-item>

        <el-form-item label="是否在售" prop="spu.status">
          <el-radio-group v-model="form.spu.status">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="商品相册" prop="spu.album">
          <multi-upload v-model="form.spu.picUrls"></multi-upload>
        </el-form-item>

        <el-form-item label="单位" prop="spu.unit">
          <el-input v-model="form.spu.unit"/>
        </el-form-item>

        <el-form-item label="所属类目" prop="spu.categoryId">
          <el-cascader v-model="form.spu.categoryId"
                       :options="categoryOptions"
                       expand-trigger="hover"
                       clearable
                       @change="handleCategoryChange"/>
        </el-form-item>
        <el-form-item label="所属品牌" prop="spu.categoryId">
          <el-select v-model="form.spu.brandId" clearable>
            <el-option v-for="item in brandOptions" :key="item.id" :label="item.name" :value="item.id"/>
          </el-select>
        </el-form-item>

        <el-form-item label="商品简介" prop="spu.description">
          <el-input v-model="form.spu.description"/>
        </el-form-item>

        <el-form-item label="商品详情" prop="spu.detail">
          <tinymce ref="editor" v-model="form.spu.detail" :height="400"/>
        </el-form-item>

      </el-form>
    </el-card>

    <!-- 商品参数 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>商品参数</span>
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
              {{ scope.row.name }}
            </template>
          </el-table-column>

          <el-table-column property="value" label="参数值">
            <template slot-scope="scope">
              <el-form-item :prop="'attributes[' + scope.$index + '].value'" :rules="rules.attribute.value">
                <el-input v-model="scope.row.value"></el-input>
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
      </div>
      <el-form size="mini"
               ref="specForm"
               :model="form"
               :inline="true">
        <el-table
          :data="form.specs"
          highlight-current-row
          border>
          <el-table-column label="规格名称">
            <template slot-scope="scope">
              {{ scope.row.name }}
            </template>
          </el-table-column>
          <el-table-column label="规格值">
            <template slot-scope="scope">

              <el-tag
                v-for="item in scope.row.values"
                closable
                :disable-transitions="false"
                @close="handleClose(scope.$index,item)">
                {{ item.value }}
              </el-tag>

              <el-input
                class="input-new-tag"
                v-if="isVisible(scope.$index)"
                :v-model="inputValueArr[scope.$index]"
                size="mini"
                @keyup.enter.native="handleInputConfirm(scope.$index)"
                @blur="handleInputConfirm(scope.$index)"
              />
              <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.$index)">+ 添加规格</el-button>

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
          highlight-current-row
          border>

          <el-table-column
            label="规格">
            <template slot-scope="scope">
              <el-form-item>
                {{ scope.row.specification }}
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column
            prop="price"
            label="现价(元)">
            <template slot-scope="scope">
              <el-form-item :prop="'specs[' + scope.$index + '].price'" :rules="rules.specification.price">
                <el-input-number v-model="scope.row.price" :precision="2" :min="0" :max="2147483647"/>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column
            prop="originPrice"
            label="原价(元)">
            <template slot-scope="scope">
              <el-form-item :prop="'specs[' + scope.$index + '].originPrice'"
                            :rules="rules.specification.originPrice">
                <el-input-number v-model="scope.row.originPrice" :precision="2" :min="0" :max="2147483647"/>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column
            label="库存"
            prop="stock">
            <template slot-scope="scope">
              <el-form-item :prop="'specs[' + scope.$index + '].stock'">
                <el-input-number v-model="scope.row.stock" :precision="0" :max="2147483647" :min="0" size="small"/>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column property="pic" label="SKU图片" width="80">
            <template slot-scope="scope">
              <el-form-item :prop="'specs[' + scope.$index + '].pic'">
                <mini-card-upload v-model="scope.row.pic"></mini-card-upload>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column
            prop="code"
            label="商品条码">
            <template slot-scope="scope">
              <el-form-item :prop="'specs[' + scope.$index + '].code'">
                <el-input v-model="scope.row.code" maxlength="200">
                  <el-button slot="append" @click="handleGenerateCode(scope.row)">随机</el-button>
                </el-input>
              </el-form-item>
            </template>
          </el-table-column>

        </el-table>
      </el-form>
    </el-card>

    <div class="footer">
      <el-button @click="closeDialog">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
    </div>
  </div>
</template>

<script>

import {add, update, detail} from '@/api/pms/product'
import {list as categoryList, attrCategoryList, specCategoryList} from '@/api/pms/category'
import {list as brandList} from '@/api/pms/brand'


import SingleUpload from '@/components/Upload/SingleUpload'
import MultiUpload from '@/components/Upload/MultiUpload'
import MiniCardUpload from '@/components/Upload/MiniCardUpload'
import Tinymce from '@/components/Tinymce'

export default {
  name: "ProductDetail",
  components: {SingleUpload, MultiUpload, MiniCardUpload, Tinymce},
  data() {
    return {
      spuId: undefined,
      categoryOptions: [],
      brandOptions: [],
      form: {
        spu: {
          id: undefined,
          name: undefined,
          categoryId: undefined,
          brandId: undefined,
          originPrice: undefined,
          price: undefined,
          picUrls: [],
          unit: undefined,
          description: undefined,
          detail: undefined,
          status: 1
        },
        attributes: [],
        specs: [],
        skuList: []
      },
      rules: {
        spu: {
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
      specForm: {
        name: undefined,
        value: undefined,

        // 辅助属性
        index: undefined,
      },
      specificationRules: {
        name: [{required: true, message: '请填写规格名称', trigger: 'blur'}],
        value: [{required: true, message: '请填写规格值', trigger: 'blur'}]
      },
      specificationTitles: [],
      inputVisibleArr: [false],
      inputValueArr: ['']
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    async loadData() {
      await this.loadCategoryOptions()
      await this.loadBrandOptions()
      const spuId = this.$route.query.id
      this.spuId = spuId
      if (spuId) {
        detail(spuId).then(response => {
          const data = response.data
          // 金额转换
          data.spu.originPrice /= 100
          data.spu.price /= 100
          data.skuList.map(item => {
            item.originPrice /= 100
            item.price /= 100
          })
          this.form = data
        })
      }
    },
    loadCategoryOptions() {
      categoryList({queryMode: 'cascader'}).then(response => {
        this.categoryOptions = response.data
      })
    },
    handleCategoryChange(value) {
      const categoryId = value[value.length - 1]
      this.form.spu.categoryId = categoryId
      attrCategoryList({categoryId: categoryId}).then(response => {
        this.form.attributes = response.data
      })

      specCategoryList({categoryId: categoryId}).then(response => {
        this.form.specs = response.data
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
    generateSkuList() {
      let specs = JSON.parse(JSON.stringify(this.form.specs)) // 深拷贝
      // [
      //    {'name':'颜色','value':'白色'},
      //    {'name':'颜色','value':'黑色'},
      //    {'name':'颜色','value':'蓝色'} ,
      //    {'name':'内存','value':'4G'},
      //    {'name':'内存','value':'6G'},
      //    {'name':'内存','value':'8G'},
      //    {'name':'存储','value':'64G'},
      //    {'name':'存储','value':'128G'},
      //    {'name':'存储','value':'256G'}
      // ]
      // accumulator 累加值  current 当前值
      this.specificationTitles = []
      specs = specs.reduce((accumulator, current) => {
        const index = accumulator.findIndex(item => item.name == current.name)
        if (index !== -1) {
          accumulator[index].values.push(current.value)
        } else {
          this.specificationTitles.push(current.name) // sku表格头部标题
          accumulator.push({name: current.name, values: [current.value]})
        }
        return accumulator
      }, [])

      // [
      //    { 'name':'颜色','values':['白色','黑色','蓝色'] },
      //    { 'name':'内存','values':['4G','6G','8G'] },
      //    { 'name':'存储','values':['64G','128G','256G']},
      // ]
      this.form.skuList = specs.reduce((prev, current, index) => {
        const result = []
        // prev = [{'颜色':'白色'},{'颜色':'黑色'},{'颜色':'蓝色'}]
        prev.forEach(item => {
          // item = {'颜色':'白色'}
          current.values.forEach(value => {
            const obj = {}
            Object.assign(obj, item)
            obj[current.name] = value
            if (index === specs.length - 1) {
              Object.assign(obj, {price: 0, originPrice: 0, stock: 0, pic: undefined, code: undefined})
            }
            result.push(obj)
          })
        })
        return result
      }, [{}])

      this.form.skuList.map(sku => {
        let {originPrice, price, stock, pic, code, ...specification} = sku
        sku.specification = JSON.stringify(specification)
      })
    },
    handleGenerateCode(row) {
      row.code = new Date().getTime() + ''
      this.$forceUpdate()
    },
    handleSubmit() {
      // 表单验证
      this.$refs["spuForm"].validate((valid) => {
        if (valid) {
          this.$refs["attributeForm"].validate((valid) => {
            if (valid) {
              this.$refs["specForm"].validate((valid) => {
                if (valid) {
                  this.$refs["skuForm"].validate((valid) => {
                    if (valid) {

                      // 对象深度复制
                      let data = JSON.parse(JSON.stringify(this.form));

                      // spu处理
                      data.spu = {
                        ...data.spu, ...{
                          price: data.spu.price * 100,
                          originPrice: data.spu.originPrice * 100
                        }
                      }
                      // sku处理
                      data.skuList.map(sku => {
                        sku.price *= 100
                        sku.originPrice *= 100
                      })
                      if (!this.spuId) {
                        add(data).then(response => {
                          this.$router.push({name: 'Goods'})
                        })
                      } else {
                        update(this.spuId, data).then(response => {
                          this.$router.push({name: 'Goods'})
                        })
                      }
                    }
                  })
                }
              })
            }
          })
        }
      })
    },
    closeDialog() {
      console.log('close')
    },

    handleClose(index, value) {
      this.form.specs[index].values.splice(this.form.specs[index].values.indexOf(value), 1);
    },

    showInput(index) {
      this.inputVisibleArr[index] = true;
    },

    handleInputConfirm(index) {
      console.log('确认')
      let inputValue = this.inputValueArr[index];
      if (inputValue) {
        this.form.specs[index].values.push({value: inputValue});
      }
      this.inputVisibleArr[index] = false;
      this.inputValueArr[index] = '';
    },
    isVisible(index) {
      return this.inputVisibleArr[index]
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

.el-tag + .el-tag {
  margin-left: 10px;
}

.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
