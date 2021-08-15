<template>
  <div class="components-container">
    <el-card class="box-card" shadow="always">
      <div class="clearfix" slot="header">
        <b>
          <svg-icon icon-class="menu"/>
          商品{{ attributeTypeName }}</b>
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
          :disabled="!category||!category.children||category.children.length!==0"
          label-width="100"
          :model="form"
          ref="form">
          <el-form-item
            v-for="(item, index) in form.attributes"
            :label="attributeTypeName + (index+1)"
            :prop="'attributes.' + index + '.name'"
            :rules="rules.attribute.name">
            <el-input v-model="item.name" style="width: 300px"/>

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
import {listAttribute, saveBatch} from "@/api/pms/attribute";

export default {
  name: "Attribute",
  props: ['attributeType'],
  data() {
    const attributeNameValidator = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入' + this.attributeTypeName + '名称'))
      } else {
        callback();
      }
    };
    return {
      attributeTypeName: this.attributeType == 1 ? '规格' : '属性',
      category: undefined,
      form: {
        categoryId: undefined,
        type: undefined,
        attributes: [{
          id: undefined,
          name: undefined
        }]
      },

      rules: {
        attribute: {
          name: [{
            required: true,
            validator: attributeNameValidator,
            trigger: 'blur'
          }]
        }
      }
    }
  },
  methods: {
    handleSubmit() {
      this.form.categoryId = this.category.id
      this.form.type = this.attributeType
      saveBatch(this.form).then(() => {
        this.$message.success('提交成功')
      })
    },
    categoryClick(category) {
      this.category = category
      listAttribute({categoryId: category.id, type: this.attributeType}).then(response => {
        const {data} = response
        if (data.length > 0) {
          this.form.attributes = response.data
        } else {
          this.form.attributes = [{}]
        }
      })
    },
    handleAdd() {
      this.form.attributes.push({})
    },
    handleRemove(index) {
      if (this.form.attributes.length == 1) {
        this.form.attributes = [{}]
        return
      }
      this.form.attributes.splice(index, 1)
    }
  }
}
</script>

<style scoped>

</style>
