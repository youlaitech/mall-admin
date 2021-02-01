<template>
  <div>
    <!-- 搜索表单 -->
    <el-form
      ref="queryForm"
      size="small"
      :model="queryParams"
      :inline="true"
    >
      <el-form-item>
        <el-button type="success" :disabled="disabled" icon="el-icon-plus" @click="handleAdd">新增</el-button>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="queryParams.name"
          placeholder="权限名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 数据表格 -->
    <el-table
      ref="table"
      :data="pageList"
      v-loading="loading"
      @row-click="rowClick"
      @selection-change="handleSelectionChange"
      border
      size="mini"
    >
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="权限名称" prop="name" width="120"/>
      <el-table-column label="权限标识" prop="code"/>
      <el-table-column label="类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type==1" type="success">路由</el-tag>
          <el-tag v-if="scope.row.type==2" type="primary">按钮</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="所属模块" prop="menuName"/>
      <el-table-column label="操作" align="center" width="150">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            circle
            @click="handleUpdate(scope.row)"
          />
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            circle
            @click="handleDelete(scope.row)"
          />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {add, del, detail, list, patch, update} from "@/api/admin/permission";

export default {
  name: "permission",
  data() {
    return {
      loading: false,
      ids: [],
      single: true,
      multiple: true,
      queryParams: {
        name: undefined,
        queryMode: 'page'
      },
      pagination: {
        page: 1,
        limit: 10,
        total: 0
      },
      pageList: [],
      dialog: {
        title: undefined,
        visible: false
      },
      form: {
        status: 1
      },
      rules: {
        name: [
          {required: true, message: '请输入字典名称', trigger: 'blur'}
        ],
        code: [
          {required: true, message: '请输入字典编码', trigger: 'blur'}
        ]
      },
      disabled: true,
      menu: {}
    }
  },
  methods: {
    handleQuery() {
      this.queryParams.page = this.pagination.page
      this.queryParams.limit = this.pagination.limit
      list(this.queryParams).then(response => {
        this.pageList = response.data
        this.pagination.total = response.total
        this.loading = false
      })
    },
    resetQuery() {
      this.pagination = {
        page: 1,
        limit: 10,
        total: 0
      }
      this.queryParams = {
        name: undefined,
        queryMode: 'page'
      }
      this.handleQuery()
    },
    rowClick(row) {
      this.$emit('dictClick', row)
    },
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    handleStatusChange(row) {
      const text = row.status === 1 ? '启用' : '停用'
      this.$confirm('确认要"' + text + row.name + '"数据项吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        return patch(row.id, 1, {status: row.status})
      }).then(() => {
        this.$message.success(text + '成功')
      }).catch(function () {
        row.status = row.status === 1 ? 0 : 1
      })
    },

    handleAdd() {
      this.resetForm()
      this.dialog = {
        title: '新增字典',
        visible: true
      }
    },

    handleUpdate(row) {
      this.resetForm()
      this.dialog = {
        title: '修改字典',
        visible: true
      }
      const id = row.id || this.ids
      detail(id).then(response => {
        this.form = response.data
      })
    },

    handleSubmit: function () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          const id = this.form.id
          if (id != undefined) {
            update(id, this.form).then(() => {
              this.$message.success('修改成功')
              this.closeDialog()
              this.handleQuery()
            })
          } else {
            add(this.form).then(() => {
              this.$message.success('新增成功')
              this.closeDialog()
              this.handleQuery()
            })
          }
        }
      })
    },

    handleDelete(row) {
      const ids = [row.id || this.ids].join(',')
      this.$confirm('确认删除已选中的数据项？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        del(ids).then(() => {
          this.$message.success('删除成功')
          this.handleQuery()
        })
      }).catch(() =>
        this.$message.info('已取消删除')
      )
    },
    closeDialog() {
      this.resetForm()
      this.dialog = {
        title: undefined,
        visible: false
      }
    },
    resetForm() {
      this.form = {
        status: 1
      }
      if (this.$refs['form']) {
        this.$refs['form'].resetFields()
      }
    },
    menuClick(row) {
      this.disabled = false
      this.menu = row
    }
  }
}
</script>

<style scoped>

</style>
