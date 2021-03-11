<template>
  <div class="app-container">
    <!-- 商品信息 -->
    <el-card class="box-card">
      <div slot="header">
        <span>商品信息</span>
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
          <multi-upload v-model="form.spu.pics"></multi-upload>
        </el-form-item>

        <el-form-item label="单位" prop="spu.unit">
          <el-input v-model="form.spu.unit"/>
        </el-form-item>

        <el-form-item label="商品分类" prop="spu.categoryId">
          <el-cascader
            v-model="form.spu.categoryId"
            :options="categoryOptions"
            expand-trigger="hover"
            clearable
            @change="handleCategoryChange"
            style="width:400px"
          />
        </el-form-item>
        <el-form-item label="商品品牌" prop="spu.categoryId">
          <el-select
            v-model="form.spu.brandId"
            clearable
            style="width:400px" >
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
      <div slot="header">
        <span>商品参数</span>
        <el-button style="float: right;" type="primary" size="mini" @click="handleAttrAdd">添加参数</el-button>
      </div>

      <el-form
        :disabled="!form.spu.categoryId"
        size="mini"
        ref="attrForm"
        :model="form"
        :inline="true">
        <el-table
          :data="form.attrValues"
          highlight-current-row
          border>
          <el-table-column property="name" label="参数名称">
            <template slot-scope="scope">
              <el-form-item :prop="'attrValues[' + scope.$index + '].name'" :rules="rules.attr.name">
                <el-input v-model="scope.row.name"></el-input>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column property="value" label="参数值">
            <template slot-scope="scope">
              <el-form-item :prop="'attrValues[' + scope.$index + '].value'" :rules="rules.attr.value">
                <el-input v-model="scope.row.value"></el-input>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-form-item>
                <el-button type="danger" icon="el-icon-minus" circle @click="handleAttrRemove(scope.$index)"/>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
    </el-card>

    <!-- 商品规格 -->
    <el-card class="box-card">
      <div slot="header">
        <span>商品规格</span>
        <el-tag v-if="!form.spu.categoryId" style="float: right;" type="warning">请选择商品分类</el-tag>
      </div>
      <el-form
        :disabled="!form.spu.categoryId"
        size="mini"
        :model="form"
        :inline="true">
        <el-table
          :data="form.specValues"
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
                @close="handleClose(scope.$index,item)"
                :type="colors[scope.$index%colors.length]"
              >
                {{ item.value }}
              </el-tag>

              <el-input
                class="input-new-tag"
                v-if="!isLoading&&inputVisibleArr[scope.$index][currentColumnIndex]==true"
                v-model="inputValueArr[scope.$index][currentColumnIndex]"
                size="mini"
                @keyup.enter.native="handleInputConfirm(scope.$index)"
                @blur="handleInputConfirm(scope.$index)"
              />
              <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.$index)">+ 添加</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
    </el-card>

    <!-- 商品库存 -->
    <el-card class="box-card">
      <div slot="header">
        <span>商品库存</span>
      </div>
      <el-form
        size="mini"
        ref="skuForm"
        :model="form"
        :inline="true">

        <el-table
          :data="form.skus"
          highlight-current-row
          border>
          <el-table-column
            width="350"
            label="名称">
            <template slot-scope="scope">
              <el-form-item>
                <el-form-item :prop="'skus[' + scope.$index + '].name'" :rules="rules.sku.name">
                  <el-input v-model="scope.row.name" style="width: 300px"/>
                </el-form-item>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column
            prop="price"
            label="现价(元)">
            <template slot-scope="scope">
              <el-form-item :prop="'skus[' + scope.$index + '].price'">
                <el-input-number v-model="scope.row.price" :precision="2" :min="0" :max="2147483647"/>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column
            prop="originPrice"
            label="原价(元)">
            <template slot-scope="scope">
              <el-form-item :prop="'skus[' + scope.$index + '].originPrice'">
                <el-input-number v-model="scope.row.originPrice" :precision="2" :min="0" :max="2147483647"/>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column
            label="库存"
            prop="inventory">
            <template slot-scope="scope">
              <el-form-item :prop="'skus[' + scope.$index + '].inventory'">
                <el-input-number v-model="scope.row.inventory" :precision="0" :max="2147483647" :min="0" size="small"/>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column property="pic" label="规格图片" width="80">
            <template slot-scope="scope">
              <el-form-item :prop="'skus[' + scope.$index + '].pic'">
                <mini-card-upload v-model="scope.row.pic"></mini-card-upload>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column
            prop="code"
            label="商品码">
            <template slot-scope="scope">
              <el-form-item :prop="'skus[' + scope.$index + '].code'">
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
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
    </div>
  </div>
</template>

<script>

import {add, update, detail} from '@/api/pms/spu'
import {list as categoryList} from '@/api/pms/category'
import {list as attrList} from '@/api/pms/attribute'
import {list as specList} from '@/api/pms/spec'
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
          priUrl: undefined,
          pics: [],
          unit: undefined,
          description: undefined,
          detail: undefined,
          status: 1
        },
        attrValues: [],
        specValues: [],
        skus: []
      },
      rules: {
        spu: {
          name: [{required: true, message: '请填写商品名称', trigger: 'blur'}],
          originPrice: [{required: true, message: '请填写商品原始价格', trigger: 'blur'}],
          price: [{required: true, message: '请填写商品当前价格', trigger: 'blur'}],
        },
        attr: {
          name: [{required: true, message: '请填写参数名称', trigger: 'blur'}],
          value: [{required: true, message: '请填写参数值', trigger: 'blur'}]
        },
        sku: {
          name: [{required: true, message: '请填写sku名称', trigger: 'blur'}],
        }
      },

      inputVisibleArr: [],
      inputValueArr: [],
      currentColumnIndex: 0,
      colors: ['', 'success', 'info', 'warning', 'danger'],
      isLoading: false,
      cacheSkus: [],
      cacheSpecValues: []
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
        this.isLoading = true
        detail(spuId).then(response => {
          const data = response.data
          // 金额转换
          data.spu.originPrice /= 100
          data.spu.price /= 100
          data.skus.map(item => {
            item.originPrice /= 100
            item.price /= 100
          })

          data.skus.forEach(item => {
            item.specificationValueIds = item.specificationValueIds.split(',').sort().join(',')
          })
          this.cacheSkus = JSON.parse(JSON.stringify(data.skus)) // 深复制

          const values = data.specValues

          specList({categoryId: data.spu.categoryId}).then(response => {
            const specValues = response.data
            this.inputVisibleArr = []
            this.inputValueArr = []

            specValues.forEach((spec, rowIndex) => {
              this.inputVisibleArr.push([])
              this.inputValueArr.push([])
              values.forEach((value) => {
                if (value.specificationId == spec.id) {
                  spec.values.push(value)
                  this.inputVisibleArr[rowIndex].push(false)
                  this.inputValueArr[rowIndex].push('')
                }
              })
            })
            data.specValues = specValues
            this.cacheSpecValues = JSON.parse(JSON.stringify(specValues)) // 深复制
            this.isLoading = false
          })
          this.form = data
        })
      } else {
        this.resetForm()
      }
    },

    loadCategoryOptions() {
      categoryList({queryMode: 'cascader'}).then(response => {
        this.categoryOptions = response.data
      })
    },
    handleCategoryChange(value) {
      if (value && value.length > 0) {
        const categoryId = value[value.length - 1]
        this.form.spu.categoryId = categoryId
        attrList({categoryId: categoryId}).then(response => {
          response.data.forEach(item => {
            this.form.attrValues.push({attrId: item.id, name: item.name})
          })
        })
        specList({categoryId: categoryId}).then(response => {
          const {data} = response
          this.form.specValues = data

          for (let i = 0; i < data.length; i++) {
            this.inputVisibleArr.push([false])
            this.inputValueArr.push([''])
          }
        })
      } else {
        this.form.attrValues = []
        this.form.specValues = []
      }
    },
    loadBrandOptions() {
      brandList({queryMode: 'list'}).then(response => {
        this.brandOptions = response.data
      })
    },

    handleGenerateCode(row) {
      row.code = new Date().getTime()
      this.$forceUpdate()
    },

    handleClose(rowIndex, value) {
      const removeIndex = this.form.specValues[rowIndex].values.indexOf(value)
      this.form.specValues[rowIndex].values.splice(removeIndex, 1)
      this.inputVisibleArr[rowIndex].splice(removeIndex, 1)
      this.inputValueArr[rowIndex].splice(removeIndex, 1)
      this.currentColumnIndex--
      this.generateskus()
    },

    showInput(rowIndex) {
      this.currentColumnIndex = this.form.specValues[rowIndex].values.length
      this.$set(this.inputVisibleArr[rowIndex], this.currentColumnIndex, true)
    },

    handleInputConfirm(rowIndex) {
      let inputValue = this.inputValueArr[rowIndex][this.currentColumnIndex];
      if (!inputValue) {
        this.$message.warning("请输入规格值")
        return
      }
      // 规格值重复判断
      const i = this.form.specValues[rowIndex].values.findIndex(item => item.value == inputValue)
      if (i > -1) {
        this.$message.warning("规格值已存在，请重新输入")
        return
      }

      let specValue
      if (this.spuId) { // 先尝试从缓存取
        specValue = this.cacheSpecValues[rowIndex].values.find(item => item.value == inputValue)
      }
      if (!specValue) {
        specValue = {
          id: new Date().getTime(),
          specificationId: this.form.specValues[rowIndex].id,
          value: inputValue
        }
      }
      this.form.specValues[rowIndex].values.push(specValue);
      this.inputVisibleArr[rowIndex][this.currentColumnIndex] = false;
      this.inputValueArr[rowIndex][this.currentColumnIndex] = ''

      this.generateskus()
    },
    // 笛卡尔积生成sku
    generateskus() {
      let specValues = JSON.parse(JSON.stringify(this.form.specValues)) // 深拷贝
      // [
      //    { 'id':1,'name':'颜色','values':[{id:1,value:'白色'},{id:2,value:'黑色'},{id:3,value:'蓝色'}] },
      //    { 'id':2,'name':'版本','values':[{id:1,value:'6+128G'},{id:2,value:'8+128G'},{id:3,value:'8G+256G'}] }
      // ]
      // accumulator 累加值  current 当前值
      this.form.skus = specValues.reduce((acc, curr) => {
        let result = []
        acc.forEach(a => {  // a=> {}
          // curr => { 'id':1,'name':'颜色','values':[{id:1,value:'白色'},{id:2,value:'黑色'},{id:3,value:'蓝色'}] }
          curr.values.forEach(v => {  // v=>{id:1,value:'白色'}
            let temp = {}
            Object.assign(temp, a); // a=>{name:'白色 ',specificationValueIds:1,}
            temp.name += v.value + ' '
            temp.specificationValueIds += v.id + ','
            result.push(temp)
          })
        })

        return result
      }, [{name: '', specificationValueIds: ''}]) // -> initialValue 初始值


      this.form.skus.forEach(item => {
        let cacheSku
        if (this.spuId) { // 先尝试从缓存取
          const specificationValueIds = item.specificationValueIds.substring(0, item.specificationValueIds.length - 1).split(',').sort().join(',')
          cacheSku = this.cacheSkus.find(item => item.specificationValueIds == specificationValueIds)
        }

        if (cacheSku) { // 缓存取值
          console.log('缓存取sku', cacheSku, item)
          item.name = this.form.spu.name + ' ' + item.name
          item.specificationValueIds = item.specificationValueIds.substring(0, item.specificationValueIds.length - 1)
          item.id = cacheSku.id
          item.originPrice = cacheSku.originPrice
          item.price = cacheSku.price
          item.inventory = cacheSku.inventory
          item.pic = cacheSku.pic
          item.code = cacheSku.code
        } else { // 默认
          console.log('新生成sku')
          item.name = this.form.spu.name + ' ' + item.name
          item.specificationValueIds = item.specificationValueIds.substring(0, item.specificationValueIds.length - 1)
          item.originPrice = this.form.spu.originPrice
          item.price = this.form.spu.price
          item.inventory = 9999
          item.pic = this.form.spu.pics[0]
          item.code = new Date().getTime()
        }
      })

    },
    handleAttrAdd() {
      if (!this.form.spu.categoryId) {
        this.$message.warning("请选择商品分类")
        return
      }
      this.form.attrValues.push({})
    },
    handleAttrRemove(index) {
      this.form.attrValues.splice(index, 1)
    },
    close() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.go(-1);
    },
    handleSubmit() {
      // 表单验证
      this.$refs["spuForm"].validate((valid) => {
        if (valid) {
          this.$refs["attrForm"].validate((valid) => {
            if (valid) {
              // 规格值验证 el-tag
              if (!this.form.specValues || this.form.specValues.length <= 0) {
                this.$message.warning('商品规格不存在')
                return false
              }

              for (let i = 0; i < this.form.specValues.length; i++) {
                const item = this.form.specValues[i]
                if (!item.values || item.values.length <= 0) {
                  this.$message.warning(item.name + '规格至少有一个规格值')
                  return false
                }
              }

              this.$refs["skuForm"].validate((valid) => {
                if (valid) {
                  // 对象深度复制
                  let data = JSON.parse(JSON.stringify(this.form));
                  // spu处理
                  data.spu = {
                    ...data.spu, ...{
                      price: data.spu.price * 100,
                      originPrice: data.spu.originPrice * 100,
                      pic: data.spu.pics[0] //主图取相册第一张
                    }
                  }
                  // 规格处理
                  data.specValues = data.specValues.map(item => item.values).reduce((acc, crr) => {
                    return acc.concat(crr)
                  })
                  // sku处理
                  data.skus.map(sku => {
                    sku.price *= 100
                    sku.originPrice *= 100
                    // 排序
                    sku.specificationValueIds = sku.specificationValueIds.split(',').sort().join(',')
                  })

                  const that = this
                  if (!this.spuId) {
                    add(data).then(response => {
                      this.$message.success('保存成功')
                      setTimeout(function () {
                        that.close()
                        that.$router.push({name: 'Goods'})
                      }, 1000)
                    })
                  } else {
                    update(this.spuId, data).then(response => {
                      this.$message.success('保存成功')
                      setTimeout(function () {
                        that.close()
                        that.$router.push({name: 'Goods'})
                      }, 1000)
                    })
                  }
                }
              })
            }
          })
        }
      })
    },

    resetForm() {
      this.form = {
        spu: {
          id: undefined,
          name: undefined,
          categoryId: undefined,
          brandId: undefined,
          originPrice: undefined,
          price: undefined,
          pics: [],
          unit: undefined,
          description: undefined,
          detail: undefined,
          status: 1
        },
        attrValues: [],
        specValues: [],
        skus: []
      }
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
