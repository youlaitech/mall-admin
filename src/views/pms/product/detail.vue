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
      </div>

      <el-button style="float: right;" type="primary" size="mini" @click="handleAddAttr">添加参数
      </el-button>

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
              {{ scope.row.name }}
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
                v-if="inputVisibleArr[scope.$index][currentColumnIndex]==true"
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
            label="名称">
            <template slot-scope="scope">
              <el-form-item>
                <el-form-item :prop="'skuList[' + scope.$index + '].name'" :rules="rules.sku.name">
                  <el-input v-model="scope.row.name"></el-input>
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
            label="商品条码">
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

        inputVisibleArr: [[false]],
        inputValueArr: [['']],
        currentColumnIndex: 0,
        colors: ['', 'success', 'info', 'warning', 'danger']
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

        if (value && value.length > 0) {
          const categoryId = value[value.length - 1]
          this.form.spu.categoryId = categoryId
          attrCategoryList({categoryId: categoryId}).then(response => {
            this.form.attrs = response.data
          })

          specCategoryList({categoryId: categoryId}).then(response => {
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
                    // sku处理
                    data.skuList.map(sku => {
                      sku.name = data.spu.name + ' ' + sku.name // sku名称 = spu名称 + 规格组合
                      sku.price *= 100
                      sku.originPrice *= 100
                    })

                    console.log('提交表单数据', data)
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
      },
      closeDialog() {
        console.log('close')
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
        if (!this.form.spu.name) {
          this.$message.warning("请输入商品名称")
          return
        }
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
        this.form.specs[rowIndex].values.push({
          id: new Date().getTime(),
          specCategoryId: this.form.specs[rowIndex].categoryId,
          value: inputValue
        });
        this.inputVisibleArr[rowIndex][this.currentColumnIndex] = false;
        this.inputValueArr[rowIndex][this.currentColumnIndex] = ''


        // 生成sku
        this.generateSkuList()

      },
      generateSkuList() {
        let specs = JSON.parse(JSON.stringify(this.form.specs)) // 深拷贝

        // [
        //    { 'name':'颜色','values':['白色','黑色','蓝色'] },
        //    { 'name':'内存','values':['4G','6G','8G'] },
        //    { 'name':'存储','values':['64G','128G','256G']},
        // ]
        // accumulator 累加值  current 当前值
        this.form.skuList = specs.reduce((acc, curr) => {
          const result = []
          acc.forEach(a => {
            curr.values.forEach(v => {
              const obj = {}
              Object.assign(obj, a)
              obj.name += ' ' + curr.name + ':' + v.value
              obj.specValueIds.push(v.id)
              result.push(obj)
            })
          })
          return result
        }, [{name: '', specValueIds: []}]) // -> initialValue 初始值

        this.form.skuList.forEach(item => {
          item.originPrice = 0
          item.price = 0
          item.stock = 100
          item.picUrl = this.form.spu.picUrls[0]
          item.code = new Date().getTime()
          item.specValueIds = item.specValueIds.join(',')
        })

        console.log('sku列表', this.form.skuList)
      },
      handleAddAttr() {
        this.form.attrs.push({})
      },
      handleRemoveAttr(index) {
        this.form.attrs.splice(index, 1)
      },
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
