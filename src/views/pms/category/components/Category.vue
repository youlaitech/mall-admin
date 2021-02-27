<!-- 商品分类层级最多为三层，level字段标识 -->
<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col :sm="12" :xs="24">
        <el-card>
          <div class="clearfix" slot="header">
            <b>
              <svg-icon icon-class="menu"/>
              商品分类列表</b>
          </div>

          <div class="custom-tree-container">
            <div class="block">
              <el-tree
                v-loading="loading"
                ref="category"
                :data="list"
                :props="{ label: 'name', children: 'children' }"
                node-key="id"
                :expand-on-click-node="false"
                default-expand-all
                :accordion="true"
                @node-click="handleNodeClick">
            <span slot-scope="{ node, data }" class="custom-tree-node">
              <span>
                <el-image style="width: 30px; height: 30px;vertical-align: middle"
                          v-show="data.level == 3"
                          :src="data.iconUrl"/>
                {{ data.name }}
              </span>
              <span>
                <el-button
                  v-show="data.level != 3 "
                  type="primary"
                  size="mini"
                  icon="el-icon-plus"
                  circle
                  plain
                  @click="handleAdd(data)"/>
                <el-button
                  v-show="data.id !== 0"
                  type="warning"
                  icon="el-icon-edit"
                  size="mini"
                  circle
                  plain
                  @click="handleUpdate(data)"/>
                <el-button
                  v-show="data.id && (!data.children || data.children.length <= 0)"
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  circle
                  plain
                  @click="handleDelete(node, data)"/>
              </span>
            </span>
              </el-tree>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :sm="12" :xs="24">
        <el-card class="box-card" shadow="always">
          <div class="clearfix" slot="header">
            <b>
              <svg-icon icon-class="menu"/>
              {{ title }}</b>
          </div>

          <el-form  label-width="120px" :model="form" :rules="rules" ref="form">
            <el-form-item label="上级分类" prop="parentId">
              <el-input v-model="currentRow.name"  readonly/>
            </el-form-item>
            <el-form-item label="类目名称" prop="name">
              <el-input v-model="form.name" />
            </el-form-item>
            <el-form-item label="排序" prop="sort">
              <el-input v-model="form.sort" ></el-input>
            </el-form-item>
            <el-form-item label="类目图标" prop="icon">
              <single-upload v-model="form.iconUrl"></single-upload>
            </el-form-item>
            <el-form-item label="是否显示" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSubmit">保存</el-button>
              <el-button icon="el-icon-refresh" @click="resetForm">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>

    </el-row>
  </div>
</template>

<script>
import {
  list,
  detail,
  update,
  add,
  del
} from '@/api/pms/category'
import SingleUpload from '@/components/Upload/SingleUpload'

export default {
  components: {SingleUpload},
  data() {
    return {
      // 遮罩层
      loading: true,
      list: [],
      form: {
        id: undefined,
        name: undefined,
        parentId: 0,
        level: undefined,
        icon: undefined,
        status: 1,
        sort: undefined
      },
      rules: {
        parentId: [{
          required: true, message: '请选择 上级分类', trigger: 'blur'
        }],
        name: [{
          required: true, message: '请输入类目名称', trigger: 'blur'
        }]
      },
      queryParams: {
        queryMode: 'tree'
      },
      title:'新增商品分类',
      currentRow:{id:0,name:'顶级分类'}
    }
  },
  created() {
    this.handleQuery()
  },
  methods: {
    handleQuery() {
      this.resetForm()
      list(this.queryParams).then(response => {
        this.list = [{
          id: 0,
          name: '全部分类',
          children: response.data
        }]
        this.loading = false
      })
    },
    resetForm() {
      this.form = {
        id: undefined,
        name: undefined,
        parentId: 0,
        level: undefined,
        icon: undefined,
        status: 1,
        sort: undefined
      }
      this.currentRow={id:0,name:'顶级分类'}
      if (this.$refs['form']) {
        this.$refs['form'].resetFields()
      }
    },
    handleAdd(row) {
      if (row.id) { // 行点击新增
        this.form.parentId = row.id
      } else { // 工具栏点击新增
        if (this.currentRow) {
          this.form.parentId = this.currentRow.id
        } else {
          this.form.parentId = 0
          this.form.component = 'Layout'
        }
      }
      this.title = '新增商品分类'
    },
    handleUpdate(row) {
      this.resetForm()
      this.title='修改商品分类'
      this.form = JSON.parse(JSON.stringify(row))
    },
    handleDelete(node, row) {
      this.$confirm('确认删除已选中的数据项？', "警告", {
        confirmButtonText: "确定",
        closeButtonText: "取消",
        type: "warning"
      }).then(() => {
          del(row.id).then(() => {
            this.$message.success('删除成功')
            this.handleQuery()
          })
        }
      )
    },
    handleSubmit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          const id = this.form.id
          if (id != undefined) {
            update(id, this.form).then(response => {
              this.$message.success('修改成功')
              this.handleQuery()
            })
          } else {
            add(this.form).then(response => {
              this.$message.success('新增成功')
              this.handleQuery()
            })
          }
        }
      })
    },
    closeDialog() {
      this.resetForm()
      this.dialog = {
        title: undefined,
        visible: false
      }
    },
    handleNodeClick(row) {
      const currentRow = JSON.parse(JSON.stringify(row));
      this.currentRow = currentRow
      this.form = currentRow
      this.title = '修改商品分类'
      this.$emit('categoryClick', row)
    }
  }
}
</script>

<style>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

.el-tree-node__content {
  height: 40px;
}

.el-divider--horizontal {
  margin: 30px 0 15px;
}
</style>
