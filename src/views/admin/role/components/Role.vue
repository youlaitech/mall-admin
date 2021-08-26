<template>
  <div>
    <el-card class="box-card" shadow="always">
      <div class="clearfix" slot="header">
        <b>
          <svg-icon icon-class="menu"/>
          角色列表</b>
      </div>
      <el-form
        ref="queryForm"
        :model="queryParams"
        size="mini"
        :inline="true"
      >
        <el-form-item>
          <el-button type="success" icon="el-icon-plus" @click="handleAdd">新增</el-button>
        </el-form-item>
        <el-form-item prop="name">
          <el-input
            v-model="queryParams.name"
            placeholder="角色名称"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" plain icon="el-icon-search" @click="handleQuery">搜索
          </el-button>
        </el-form-item>
      </el-form>

      <el-table
        ref="roleTable"
        v-loading="loading"
        :data="pageList"
        @selection-change="handleSelectionChange"
        @row-click="handleRowClick"
        border
        highlight-current-row>
        <el-table-column width="55" align="center">
          <template slot-scope="scope">
            <el-radio v-model="checkedRoleId" :label="scope.row.id"><span></span></el-radio>
          </template>
        </el-table-column>

        <el-table-column label="角色名称" prop="name"/>
        <el-table-column label="角色编码" prop="code"/>
        <el-table-column label="操作" align="center" width="100">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              circle
              plain
              @click.stop="handleEdit(scope.row)"
            />
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              circle
              plain
              @click.stop="handleDelete(scope.row)"
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

      <!-- 角色弹窗 -->
      <el-dialog
        :title="dialog.title"
        :visible.sync="dialog.visible"
        width="450px"
      >
        <el-form
          ref="form"
          :model="form"
          :rules="rules"
          @close="closeDialog"
          label-width="80px"
        >
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入角色名称"/>
          </el-form-item>

          <el-form-item label="角色编码" prop="code">
            <el-input v-model="form.code" placeholder="请输入角色编码"/>
          </el-form-item>

          <el-form-item label="排序" prop="sort">
            <el-input-number v-model="form.sort" controls-position="right" :min="0" style="width: 100px"/>
          </el-form-item>

          <el-form-item label="状态">
            <el-radio-group v-model="form.status">
              <el-radio :label="1">正常</el-radio>
              <el-radio :label="0">停用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
          <el-button @click="closeDialog">取 消</el-button>
        </div>
      </el-dialog>

    </el-card>
  </div>
</template>

<script>
import {getRolePageList, update, add, del} from '@/api/admin/role'

export default {
  data() {
    return {
      checkedRoleId: undefined,
      forbidden: true,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      queryParams: {
        queryMode: 'page',
        name: undefined
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
      // 表单参数
      form: {
        sort: 1,
        status: 1
      },
      // 表单校验
      rules: {
        name: [
          {required: true, message: '角色名称不能为空', trigger: 'blur'}
        ],
        code: [
          {required: true, message: '角色编码不能为空', trigger: 'blur'}
        ]
      }
    }
  },
  created() {
    this.handleQuery()
  },
  methods: {
    handleQuery() {
      this.queryParams.page = this.pagination.page
      this.queryParams.limit = this.pagination.limit
      getRolePageList(this.queryParams).then(response => {
        this.pageList = response.data
        this.pagination.total = response.total
        this.loading = false
      })
    },
    handleReset() {
      this.pagination = {
        page: 1,
        limit: 10,
        total: 0
      }
      this.queryParams.name = undefined,
        this.handleQuery()
    },
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    handleAdd() {
      this.resetForm()
      this.dialog = {
        title: '新增角色',
        visible: true
      }
    },
    handleEdit(row) {
      this.resetForm()
      this.dialog = {
        title: '修改角色',
        visible: true
      }
      this.form = row
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
    handleSubmit: function () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          const id = this.form.id
          if (id != undefined) {
            update(id, this.form).then(() => {
              this.$message.success('修改成功')
              this.dialog.visible = false
              this.handleQuery()
            })
          } else {
            add(this.form).then(() => {
              this.$message.success('新增成功')
              this.dialog.visible = false
              this.handleQuery()
            })
          }
        }
      })
    },
    resetForm() {
      this.form = {
        sort: 1,
        status: 1
      }
    },
    closeDialog() {
      this.resetForm()
      this.dialog = {
        title: undefined,
        visible: false
      }
    },
    handleRowClick(row) {
      this.checkedRoleId = row.id // 勾选行
      const currentRow = JSON.parse(JSON.stringify(row));
      this.$emit('roleClick', currentRow)
    }
  }
}
</script>
