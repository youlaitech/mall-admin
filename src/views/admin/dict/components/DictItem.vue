<template>
  <div class="app-container">
    <!-- 搜索表单 -->
    <el-form :model="queryParams" ref="queryForm" :inline="true" size="mini">
      <el-form-item>
        <el-button type="success" icon="el-icon-plus" @click="handleAdd">新增</el-button>
        <el-button type="danger" icon="el-icon-delete" :disabled="multiple" click="handleDelete">删除</el-button>
      </el-form-item>
      <el-form-item prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="字典项名称"
          clearable/>
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
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" min-width="5%"/>
      <el-table-column label="字典项名称" prop="name"/>
      <el-table-column label="字典项值" prop="value"/>
      <el-table-column label="字典名称">
        {{ dict.name }}
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="1"
            :inactive-value="0"
            @change="handleStatusChange(scope.row)"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
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

    <pagination
      v-show="pagination.total>0"
      :total="pagination.total"
      :page.sync="pagination.page"
      :limit.sync="pagination.limit"
      @pagination="handleQuery"
    />


    <!-- 表单弹窗 -->
    <el-dialog
      :title="dialog.title"
      :visible.sync="dialog.visible"
      width="500px"
      @close="closeDialog"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="字典名称">
          <el-input v-model="dict.name" :disabled="true"/>
        </el-form-item>
        <el-form-item label="字典项名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入字典项名称"/>
        </el-form-item>
        <el-form-item label="字典项值" prop="value">
          <el-input v-model="form.value" placeholder="请输入字典项值"/>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" style="width: 80px;" controls-position="right" :min="0"/>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="0">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
        <el-button @click="closeDialog">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {add, del, detail, list, patch, update} from "@/api/admin/dict-item";

export default {
  name: "DictItem",
  data() {
    return {
      loading: false,
      ids: [],
      single: true,
      multiple: true,
      queryParams: {
        name: undefined,
        dictCode: undefined,
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
      form: {},
      rules: {
        name: [
          {required: true, message: '请输入字典项名称', trigger: 'blur'}
        ],
        value: [
          {required: true, message: '请输入字典项值', trigger: 'blur'}
        ]
      },
      dict: {}
    }
  },
  methods: {
    handleQuery() {
      if (!this.dict.code) {
        return
      }
      this.loading = true
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
        dictCode: this.dict.code,
        queryMode: 'page'
      }
      this.handleQuery()
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
        title: '新增字典项',
        visible: true
      }
      this.form.dictCode = this.dict.code
    },

    handleUpdate(row) {
      this.resetForm()
      this.dialog = {
        title: '修改字典项',
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
      this.form = {}
      if (this.$refs['form']) {
        this.$refs['form'].resetFields()
      }
    },
    dictClick(dict) {
      if (dict) {
        this.queryParams.dictCode = dict.code
        this.dict = dict
        this.handleQuery()
      } else {
        this.pageList = []
      }
    }
  }
}
</script>

<style scoped>

</style>
