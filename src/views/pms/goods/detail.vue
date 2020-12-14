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

        <el-form-item label="商品主图" prop="spu.pic">
          <single-upload v-model="form.spu.pic"></single-upload>
        </el-form-item>

        <el-form-item label="商品图册" prop="spu.album">
          <multi-upload v-model="form.spu.pics"></multi-upload>
        </el-form-item>

        <el-form-item label="单位" prop="spu.unit">
          <el-input v-model="form.spu.unit"/>
        </el-form-item>

        <el-form-item label="所属类目" prop="spu.categoryId">
          <el-cascader v-model="form.spu.categoryId" :options="categoryOptions"
                       expand-trigger="hover" clearable
                       @change="handleCategoryChange"
          />
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
        <el-button v-if="!spuId" style="float: right;" type="primary" size="mini" @click="handleAddSpecification">添加规格
        </el-button>
      </div>
      <el-form size="mini"
               ref="specificationForm"
               :model="form"
               :inline="true">
        <el-table
          :data="form.specifications"
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
          <el-table-column v-if="!spuId" label="操作" width="150">
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
              <el-form-item :prop="'specifications[' + scope.$index + '].price'" :rules="rules.specification.price">
                <el-input-number v-model="scope.row.price" :precision="2" :min="0" :max="2147483647"/>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column
            prop="originPrice"
            label="原价(元)">
            <template slot-scope="scope">
              <el-form-item :prop="'specifications[' + scope.$index + '].originPrice'"
                            :rules="rules.specification.originPrice">
                <el-input-number v-model="scope.row.originPrice" :precision="2" :min="0" :max="2147483647"/>
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

          <el-table-column property="pic" label="SKU图片" width="80">
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
      <el-form label-width="120px" :model="specificationForm" :rules="specificationRules">
        <el-form-item label="规格名称" prop="name">
          <el-select v-model="specificationForm.name" filterable allow-create default-first-option
                     placeholder="请输入或选择规格名称">
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

  import {add, update, detail} from '@/api/pms/goods'
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
            pic: undefined,
            pics: [],
            unit: undefined,
            description: undefined,
            detail: undefined,
            status: 1
          },
          attributes: [],
          specifications: [],
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
        specificationTitles: []
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
        categoryList({queryMode: 2}).then(response => {
          this.categoryOptions = response.data
        })
      },
      handleCategoryChange(value) {
        this.form.spu.categoryId = value[value.length - 1]
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
        const that = this
        this.$confirm("删除规格将导致库存信息重新生成，确认删除？", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          that.form.specifications.splice(index, 1)
          that.generateSkuList()
        })
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
      generateSkuList() {
        let specifications = JSON.parse(JSON.stringify(this.form.specifications)) // 深拷贝
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
        specifications = specifications.reduce((accumulator, current) => {
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
        this.form.skuList = specifications.reduce((prev, current, index) => {
          const result = []
          // prev = [{'颜色':'白色'},{'颜色':'黑色'},{'颜色':'蓝色'}]
          prev.forEach(item => {
            // item = {'颜色':'白色'}
            current.values.forEach(value => {
              const obj = {}
              Object.assign(obj, item)
              obj[current.name] = value
              if (index === specifications.length - 1) {
                Object.assign(obj, {price: 0, originPrice: 0, stock: 0, pic: undefined, barCode: undefined})
              }
              result.push(obj)
            })
          })
          return result
        }, [{}])

        this.form.skuList.map(sku => {
          let {originPrice, price, stock, pic, barCode, ...specification} = sku
          sku.specification = JSON.stringify(specification)
        })
      },
      handleGenerateBarCode(row) {
        row.barCode = new Date().getTime() + ''
        this.$forceUpdate()
      },
      handleSubmit() {
        // 表单验证
        this.$refs["spuForm"].validate((valid) => {
          if (valid) {
            this.$refs["attributeForm"].validate((valid) => {
              if (valid) {
                this.$refs["specificationForm"].validate((valid) => {
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
