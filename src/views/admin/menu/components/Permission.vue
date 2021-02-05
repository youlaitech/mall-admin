<template>
  <div class="perm-container">
    <el-card class="box-card" shadow="always">
      <div class="clearfix" slot="header">
        <b>
          <svg-icon icon-class="route"/>
          {{ menuName }}{{type==1?'路由权限':'按钮权限'}}</b>
      </div>

      <!-- 搜索表单 -->
      <el-form
        ref="queryForm"
        size="mini"
        :model="queryParams"
        :inline="true"
      >
        <el-form-item>
          <el-button type="success" :disabled="disabled" icon="el-icon-plus" @click="handleAdd">新增</el-button>
          <el-button type="danger" icon="el-icon-delete" :disabled="multiple" @click="handleDelete">删除</el-button>
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
          <el-button icon="el-icon-refresh" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 数据表格 -->
      <el-table
        ref="table"
        :data="pageList"
        v-loading="loading"
        @selection-change="handleSelectionChange"
        border
        size="mini"
      >
        <el-table-column type="selection" width="40" align="center"/>
        <el-table-column label="权限名称" prop="name" width="80"/>
        <el-table-column label="权限标识" prop="perm"/>
        <el-table-column label="请求方式" width="80">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.method=='*'" type="info">不限</el-tag>
            <el-tag v-if="scope.row.method=='GET'" type="primary">GET</el-tag>
            <el-tag v-if="scope.row.method=='POST'" type="success">POST</el-tag>
            <el-tag v-if="scope.row.method=='PUT'" type="warning">PUT</el-tag>
            <el-tag v-if="scope.row.method=='DELETE'" type="danger">DELETE</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="权限类型" width="80">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.type==1" type="success">路由</el-tag>
            <el-tag v-if="scope.row.type==2" type="primary">按钮</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="90">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              circle
              plain
              @click="handleUpdate(scope.row)"
            />
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              circle
              plain
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

      <el-dialog
        :title="dialog.title"
        :visible.sync="dialog.visible"
        width="500px"
      >
        <el-form
          ref="form"
          :model="form"
          :rules="rules"
          label-width="80px"
        >
          <el-form-item label="所属模块">
            <el-input v-model="menu.name" readonly></el-input>
          </el-form-item>

          <el-form-item label="权限名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入权限名称"/>
          </el-form-item>

          <el-form-item v-if="type==1" label="请求方式" prop="method">
            <el-select v-model="form.method">
              <el-option value="*" label="不限"/>
              <el-option value="GET" label="GET"/>
              <el-option value="POST" label="POST"/>
              <el-option value="PUT" label="PUT"/>
              <el-option value="DELETE" label="DELETE"/>
            </el-select>
          </el-form-item>

          <el-form-item label="权限标识" prop="perm">
            <el-input v-model="form.perm" :placeholder="(type==1?'/system/users/**':'system:user:add')"/>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
          <el-button @click="dialog.visible=false">取 消</el-button>
        </div>
      </el-dialog>

    </el-card>
  </div>
</template>

<script>
  import {add, del, detail, list, update} from "@/api/admin/permission";

  export default {
    name: "permission",
    props: ["type"], //权限类型: 1-路由权限 2-按钮权限
    data() {
      return {
        loading: false,
        ids: [],
        single: true,
        multiple: true,
        queryParams: {
          queryMode: 'page',
          name: undefined,
          moduleId: undefined,
          type: undefined
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
            {required: true, message: '请输入权限名称', trigger: 'blur'}
          ],
          perm: [
            {required: true, message: '请输入权限标识', trigger: 'blur'}
          ],
          method: [
            {required: true, message: '请选择请求方式', trigger: 'blur'}
          ]
        },
        disabled: true,
        menu: {},
        menuName: undefined,
      }
    },
    methods: {
      handleQuery() {
        this.queryParams.page = this.pagination.page
        this.queryParams.limit = this.pagination.limit

        this.queryParams.moduleId = this.menu.id
        this.queryParams.type = this.type

        list(this.queryParams).then(response => {
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
        this.queryParams.name = undefined
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
          title: '新增' + (this.type == 1 ? '路由' : '按钮') + '权限',
          visible: true
        }
      },

      handleUpdate(row) {
        this.resetForm()
        this.dialog = {
          title: '修改' + (this.type == 1 ? '路由' : '按钮') + '权限',
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
            this.form.type = this.type
            this.form.moduleId = this.menu.id
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
          type: this.type,
          moduleId: this.menu.id
        }
        if (this.$refs['form']) {
          this.$refs['form'].resetFields()
        }
      },
      menuClick(row) {
        this.disabled = false
        this.menu = row
        this.menuName = '【' + this.menu.name + '】'
        this.handleQuery()
      },
      resetPermission() {
        this.disabled = true
        this.pageList = []
        this.queryParams.moduleId = undefined
        this.menu = {}
        this.menuName = undefined
      }
    }
  }
</script>

<style scoped>
  .perm-container {
    margin-bottom: 20px;
  }
</style>

