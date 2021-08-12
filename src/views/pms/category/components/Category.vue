<!-- 商品分类层级最多为三层，level字段标识 -->
<template>
  <div class="components-container">

    <el-card>
      <div class="clearfix" slot="header">
        <b>
          <svg-icon icon-class="menu"/>
          商品分类</b>
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
                  @click.stop="handleAdd(data)"/>
                <el-button
                  v-show="data.id !== 0"
                  type="warning"
                  icon="el-icon-edit"
                  size="mini"
                  circle
                  plain
                  @click.stop="handleUpdate(data)"/>
                <el-button
                  v-show="data.id && (!data.children || data.children.length <= 0)"
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  circle
                  plain
                  @click.stop="handleDelete(node, data)"/>
              </span>
            </span>
          </el-tree>
        </div>
      </div>
    </el-card>


    <el-dialog
      :title="dialog.title"
      :visible.sync="dialog.visible"
      width="800px">

      <el-form
        label-width="120px"
        :model="form"
        :rules="rules"
        ref="form"
        style="width: 80%;">
        <el-form-item label="上级分类" prop="parentId">
          <el-input v-model="parent.name" readonly/>
        </el-form-item>
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name"/>
        </el-form-item>
        <el-form-item label="分类图标" prop="iconUrl">
          <single-upload v-model="form.iconUrl"></single-upload>
        </el-form-item>
        <el-form-item label="显示状态" prop="visible">
          <el-radio-group v-model="form.visible">
            <el-radio :label="1">显示</el-radio>
            <el-radio :label="0">隐藏</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="form.sort"></el-input>
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
        <el-button @click="dialog.visible=false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  list,
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
        iconUrl: undefined,
        visible: 1,
        sort: 1
      },
      rules: {
        parentId: [{
          required: true, message: '请选择上级分类', trigger: 'blur'
        }],
        name: [{
          required: true, message: '请输入分类名称', trigger: 'blur'
        }]
      },
      dialog: {
        title: undefined,
        visible: false
      },
      parent: {},
      current: {}
    }
  },
  created() {
    this.handleQuery()
  },
  methods: {
    handleQuery() {
      this.resetForm()
      list().then(response => {
        this.list = [{
          id: 0,
          name: '全部分类',
          parentId:0,
          level: 0,
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
        level: 0,
        iconUrl: undefined,
        visible: 1,
        sort: 1
      }
      this.parent = {id: 0, name: '顶级分类', level: 0}
      if (this.$refs['form']) {
        this.$refs['form'].resetFields()
      }
    },
    handleAdd(row) {
      this.resetForm()
      if (row.id != null) { // 行点击新增
        this.parent = {
          id: row.id,
          name: row.name,
          level: row.level
        }
      }

      this.dialog = {
        title: '新增分类',
        visible: true
      }
    },
    handleUpdate(row) {
      this.resetForm()
      this.handleNodeClick(row)
      this.form = this.current
      this.dialog = {
        title: '新增商品分类',
        visible: true
      }
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
            update(id, this.form).then(() => {
              this.$message.success('修改成功')
              this.handleQuery()
              this.closeDialog()
            })
          } else {
            this.form.parentId = this.parent.id
            this.form.level = this.parent.level + 1

            add(this.form).then(() => {
              this.$message.success('新增成功')
              this.handleQuery()
              this.closeDialog()
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
      const parentNode = this.$refs.category.getNode(row.parentId)

      this.parent = {
        id: parentNode.key,
        name: parentNode.label,
        level: row.level
      }
      this.current = JSON.parse(JSON.stringify(row))
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
