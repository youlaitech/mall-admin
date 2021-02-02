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
          <el-button type="danger" icon="el-icon-delete" :disabled="multiple" @click="handleDelete">删除</el-button>
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
          <el-dropdown>
            <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索<i
              class="el-icon-arrow-down el-icon--right"></i></el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-form-item>
      </el-form>

      <el-table
        v-loading="loading"
        :data="pageList"
        @selection-change="handleSelectionChange"
        @row-click="rowClick"
        border
        highlight-current-row
      >
        <el-table-column type="selection" width="40" align="center"/>
        <el-table-column label="序号" type="index" align="center" width="60"/>
        <el-table-column label="角色名称" prop="name"/>
        <el-table-column label="排序" prop="sort" width="60"/>
        <el-table-column label="状态" align="center" width="80">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="0"
              @change="handleStatusChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="100">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              circle
              plain
              @click.stop="handleUpdate(scope.row)"
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
  import {list, update, add, del, patch} from '@/api/admin/role'

  export default {
    data() {
      return {
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
        // 菜单列表
        menuOptions: [],
        // 表单参数
        form: {
          sort: 1,
          status: 1
        },
        // 表单校验
        rules: {
          name: [
            {required: true, message: '角色名称不能为空', trigger: 'blur'}
          ]
        },
        permissionDialog: {
          visible: false
        },
        permissionForm: {
          id: undefined,
          name: undefined,
          permissionIds: []
        },
        permissionRule: {},
        permissionOptions: []
      }
    },
    created() {
      this.handleQuery()
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
        this.queryParams.name = undefined,
          this.handleQuery()
      },
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.single = selection.length != 1
        this.multiple = !selection.length
      },
      handleStatusChange(row) {
        const text = row.status === 1 ? '启用' : '禁用'
        this.$confirm('确认要"' + text + row.name + '"数据项吗?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          return patch(row.id, {status: row.status})
        }).then(() => {
          this.$message.success(text + '成功')
        }).catch(function () {
          row.status = row.status === 1 ? 0 : 1
        })
      },
      handleAdd() {
        this.resetForm()
        this.dialog = {
          title: '新增角色',
          visible: true
        }
      },
      handleUpdate(row) {
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
          status: 1,
        }
        if (this.$refs['form']) {
          this.$refs['form'].resetFields()
        }
      },
      closeDialog() {
        this.resetForm()
        this.dialog = {
          title: undefined,
          visible: false
        }
      },
      rowClick(row) {
        this.$emit('roleClick', row)
      }
    }
  }
</script>
