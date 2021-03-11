<template>
  <div class="app-container">
    <el-card class="box-card" shadow="always">
      <div class="clearfix" slot="header">
        <b>
          <svg-icon icon-class="menu"/>
          商品规格
        </b>
      </div>
      <el-row>
        <el-col :span="12">
          <el-tag v-if="category && category.name" type="primary">{{ category.name }}</el-tag>
          <el-tag v-else type="info"><i class="el-icon-info"></i> 请选择商品分类</el-tag>
        </el-col>
        <el-col :span="12" style="text-align: right">
          <el-button type="primary" icon="el-icon-check" size="mini" @click="handleSubmit">提交</el-button>
        </el-col>
      </el-row>

      <el-row style="margin-top: 10px">
        <el-form
          :disabled="!category||category.children.length!==0"
          label-width="100"
          :model="form"
          ref="form">
          <el-form-item
            v-for="(item, index) in form.specifications"
            :label="'规格' + (index+1)"
            :prop="'specifications.' + index + '.name'"
            :rules="rules.specification.name">
            <el-input v-model="item.name" style="width:300px"/>

            <el-button
              v-if="index===0"
              type="success"
              icon="el-icon-plus"
              circle
              plain
              size="mini"
              @click.prevent="handleAdd(index)"
              style="margin-left: 15px"
            />

            <el-button
              type="danger"
              icon="el-icon-delete"
              plain
              circle
              size="mini"
              @click.prevent="handleRemove(index)"
              style="margin-left: 15px"
            />

          </el-form-item>
        </el-form>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import {list, saveBatch} from "@/api/pms/spec";

export default {
  name: "Specification",
  data() {
    return {
      category: undefined,
      form: {
        specifications: [{
          id: undefined,
          categoryId: undefined,
          name: undefined
        }]
      },
      rules: {
        specification: {
          name: [{
            required: true, message: '请输入规格名称'
          }]
        }
      }
    }
  },
  methods: {
    handleSubmit() {

      this.form.specifications.forEach(item => {
        item.categoryId = this.category.id
      })

      saveBatch(this.form.specifications).then(() => {
        this.$message.success('提交成功')
      })
    },
    categoryClick(category) {
      this.category = category
      list({categoryId: category.id}).then(response => {
        const {data} = response
        if (data.length > 0) {
          this.form.specifications = response.data
        } else {
          this.form.specifications = [{}]
        }
      })
    },
    handleAdd() {
      this.form.specifications.push({})
    },
    handleRemove(index) {
      if (this.form.specifications.length == 1) {
        this.form.specifications = [{}]
        return
      }
      this.form.specifications.splice(index, 1)
    }
  }
}
</script>

<style scoped>

</style>
