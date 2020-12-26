<template>
  <div class="app-container">

    <!-- 商品信息 -->
    <el-card class="box-card">
      <div slot="header">
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
      <div slot="header">
        <span>商品参数</span>

        <el-button style="float: right;" type="primary" size="mini" @click="handleAddAttr">添加参数</el-button>
      </div>

      <el-form size="mini"
               ref="attrForm"
               :model="form"
               :inline="true"
      >
        <el-table
          :data="form.attrs"
          highlight-current-row
          border>
          <el-table-column property="name" label="参数名称">
            <template slot-scope="scope">
              <el-form-item :prop="'attrs[' + scope.$index + '].name'" :rules="rules.attr.name">
                <el-input v-model="scope.row.name"></el-input>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column property="value" label="参数值">
            <template slot-scope="scope">
              <el-form-item :prop="'attrs[' + scope.$index + '].value'" :rules="rules.attr.value">
                <el-input v-model="scope.row.value"></el-input>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-form-item>
                <el-button type="danger" icon="el-icon-minus" circle @click="handleRemoveAttr(scope.$index)"/>
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
      </div>
      <el-form size="mini"
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
      <el-form size="mini"
               ref="skuForm"
               :model="form"
               :inline="true">
        <el-table
          :data="form.skuList"
          highlight-current-row
          border>
          <el-table-column
            width="350"
            label="名称">
            <template slot-scope="scope">
              <el-form-item>
                <el-form-item :prop="'skuList[' + scope.$index + '].name'" :rules="rules.sku.name">
                  <el-input v-model="scope.row.name" style="width: 300px"/>
                </el-form-item>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column
            prop="price"
            label="现价(元)">
            <template slot-scope="scope">
              <el-form-item :prop="'skuList[' + scope.$index + '].price'">
                <el-input-number v-model="scope.row.price" :precision="2" :min="0" :max="2147483647"/>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column
            prop="originPrice"
            label="原价(元)">
            <template slot-scope="scope">
              <el-form-item :prop="'skuList[' + scope.$index + '].originPrice'">
                <el-input-number v-model="scope.row.originPrice" :precision="2" :min="0" :max="2147483647"/>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column
            label="库存"
            prop="stock">
            <template slot-scope="scope">
              <el-form-item :prop="'skuList[' + scope.$index + '].stock'">
                <el-input-number v-model="scope.row.stock" :precision="0" :max="2147483647" :min="0" size="small"/>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column property="pic" label="SKU图片" width="80">
            <template slot-scope="scope">
              <el-form-item :prop="'skuList[' + scope.$index + '].pic'">
                <mini-card-upload v-model="scope.row.picUrl"></mini-card-upload>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column
            prop="code"
            label="商品码">
            <template slot-scope="scope">
              <el-form-item :prop="'skuList[' + scope.$index + '].code'">
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

import {add, update, detail} from '@/api/pms/product'
import {list as categoryList, attrList, specList} from '@/api/pms/category'
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
        attrs: [],
        specs: [],
        skuList: []
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
      cacheSkuList: [],
      cacheSpecs: []
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
          data.skuList.map(item => {
            item.originPrice /= 100
            item.price /= 100
          })

          data.skuList.forEach(item => {
            item.specValueIds = item.specValueIds.split(',').sort().join(',')
          })
          this.cacheSkuList = JSON.parse(JSON.stringify(data.skuList)) // 深复制

          const values = data.specs

          specList({categoryId: data.spu.categoryId}).then(response => {
            const specs = response.data
            this.inputVisibleArr = []
            this.inputValueArr = []

            specs.forEach((spec, rowIndex) => {
              this.inputVisibleArr.push([])
              this.inputValueArr.push([])
              values.forEach((value) => {
                if (value.specId == spec.id) {
                  spec.values.push(value)
                  this.inputVisibleArr[rowIndex].push(false)
                  this.inputValueArr[rowIndex].push('')
                }
              })
            })
            data.specs = specs
            this.cacheSpecs = JSON.parse(JSON.stringify(specs)) // 深复制
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
            this.form.attrs.push({attrId: item.id, name: item.name})
          })
        })
        specList({categoryId: categoryId}).then(response => {
          const {data} = response
          this.form.specs = data

          for (let i = 0; i < data.length; i++) {
            this.inputVisibleArr.push([false])
            this.inputValueArr.push([''])
          }
        })
      } else {
        this.form.attrs = []
        this.form.specs = []
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
      const removeIndex = this.form.specs[rowIndex].values.indexOf(value)
      this.form.specs[rowIndex].values.splice(removeIndex, 1)
      this.inputVisibleArr[rowIndex].splice(removeIndex, 1)
      this.inputValueArr[rowIndex].splice(removeIndex, 1)
      this.currentColumnIndex--
      this.generateSkuList()
    },

    showInput(rowIndex) {
      this.currentColumnIndex = this.form.specs[rowIndex].values.length
      this.$set(this.inputVisibleArr[rowIndex], this.currentColumnIndex, true)
    },

    handleInputConfirm(rowIndex) {
      let inputValue = this.inputValueArr[rowIndex][this.currentColumnIndex];
      if (!inputValue) {
        this.$message.warning("请输入规格值")
        return
      }
      // 规格值重复判断
      const i = this.form.specs[rowIndex].values.findIndex(item => item.value == inputValue)
      if (i > -1) {
        this.$message.warning("规格值已存在，请重新输入")
        return
      }

      let specValue
      if (this.spuId) { // 先尝试从缓存取
        specValue = this.cacheSpecs[rowIndex].values.find(item => item.value == inputValue)
      }
      if (!specValue) {
        specValue = {
          id: new Date().getTime(),
          specId: this.form.specs[rowIndex].id,
          value: inputValue
        }
      }
      this.form.specs[rowIndex].values.push(specValue);
      this.inputVisibleArr[rowIndex][this.currentColumnIndex] = false;
      this.inputValueArr[rowIndex][this.currentColumnIndex] = ''

      this.generateSkuList()
    },
    // 笛卡尔积生成sku
    generateSkuList() {
      let specs = JSON.parse(JSON.stringify(this.form.specs)) // 深拷贝
      // [
      //    { 'id':1,'name':'颜色','values':[{id:1,value:'白色'},{id:2,value:'黑色'},{id:3,value:'蓝色'}] },
      //    { 'id':2,'name':'版本','values':[{id:1,value:'6+128G'},{id:2,value:'8+128G'},{id:3,value:'8G+256G'}] }
      // ]
      // accumulator 累加值  current 当前值
      this.form.skuList = specs.reduce((acc, curr) => {
        let result = []
        acc.forEach(a => {  // a=> {}
          // curr => { 'id':1,'name':'颜色','values':[{id:1,value:'白色'},{id:2,value:'黑色'},{id:3,value:'蓝色'}] }
          curr.values.forEach(v => {  // v=>{id:1,value:'白色'}
            let temp = {}
            Object.assign(temp, a); // a=>{name:'白色 ',specValueIds:1,}
            temp.name += v.value + ' '
            temp.specValueIds += v.id + ','
            result.push(temp)
          })
        })

        return result
      }, [{name: '', specValueIds: ''}]) // -> initialValue 初始值


      this.form.skuList.forEach(item => {
        let cacheSku
        if (this.spuId) { // 先尝试从缓存取
          const specValueIds = item.specValueIds.substring(0, item.specValueIds.length - 1).split(',').sort().join(',')
          cacheSku = this.cacheSkuList.find(item => item.specValueIds == specValueIds)
        }

        if (cacheSku) { // 缓存取值
          console.log('缓存取sku',cacheSku,item)
          item.id=cacheSku.id
          item.originPrice = cacheSku.originPrice
          item.price = cacheSku.price
          item.stock = cacheSku.stock
          item.picUrl = cacheSku.picUrl
          item.code = cacheSku.code
        }else{ // 默认
          item.name = this.form.spu.name + ' ' + item.name
          item.originPrice = this.form.spu.originPrice
          item.price = this.form.spu.price
          item.stock = 9999
          item.picUrl = this.form.spu.picUrls[0]
          item.code = new Date().getTime()
          item.specValueIds = item.specValueIds.substring(0, item.specValueIds.length - 1)
        }
      })

    },
    handleAddAttr() {
      this.form.attrs.push({})
    },
    handleRemoveAttr(index) {
      this.form.attrs.splice(index, 1)
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
              if (!this.form.specs || this.form.specs.length <= 0) {
                this.$message.warning('商品规格不存在')
                return false
              }

              for (let i = 0; i < this.form.specs.length; i++) {
                const item = this.form.specs[i]
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
                      originPrice: data.spu.originPrice * 100
                    }
                  }
                  // 规格处理
                  data.specs = data.specs.map(item => item.values).reduce((acc, crr) => {
                    return acc.concat(crr)
                  })
                  // sku处理
                  data.skuList.map(sku => {
                    sku.price *= 100
                    sku.originPrice *= 100
                  })

                  if (!this.spuId) {
                    add(data).then(response => {
                      this.$message.success('保存成功')
                      const that = this
                      setTimeout(function () {
                        that.close()
                        that.$router.push({name: 'Goods'})
                      }, 1000)
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
          picUrls: [],
          unit: undefined,
          description: undefined,
          detail: undefined,
          status: 1
        },
        attrs: [],
        specs: [],
        skuList: []
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
