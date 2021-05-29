<template>
  <div class="perm-container">
    <el-card class="box-card" shadow="always">
      <div class="clearfix" slot="header">
        <b>
          <svg-icon icon-class="route"/>
          {{ menuName }}权限列表</b>
      </div>
      <!-- 搜索表单 -->
      <el-form
        ref="queryForm"
        size="mini"
        :model="queryParams"
        :inline="true">
        <el-form-item>
          <el-button type="success" :disabled="disabled" icon="el-icon-plus" @click="handleAdd">新增</el-button>
          <el-button type="danger" icon="el-icon-delete" :disabled="multiple" @click="handleDelete">删除</el-button>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="queryParams.name"
            placeholder="权限名称"
            clearable
            @keyup.enter.native="handleQuery"/>
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
        size="mini">
        <el-table-column type="selection" width="40" align="center"/>
        <el-table-column label="权限名称" prop="name" width="150"/>
        <el-table-column label="URL权限标识">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.method=='*'" type="info">*_</el-tag>
            <el-tag v-if="scope.row.method=='GET'" type="primary">GET_</el-tag>
            <el-tag v-if="scope.row.method=='POST'" type="success">POST_</el-tag>
            <el-tag v-if="scope.row.method=='PUT'" type="warning">PUT_</el-tag>
            <el-tag v-if="scope.row.method=='DELETE'" type="danger">DELETE_</el-tag>
            {{ scope.row.urlPerm }}
          </template>
        </el-table-column>
        <el-table-column label="按钮权限标识" prop="btnPerm" width="150"/>
        <el-table-column label="操作" align="center" width="100">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              circle
              plain
              @click="handleEdit(scope.row)"/>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              circle
              plain
              @click="handleDelete(scope.row)"/>
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
        width="700px">
        <el-form
          ref="form"
          :model="form"
          :rules="rules"
          label-width="120px">

          <el-form-item label="权限名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入权限名称"/>
          </el-form-item>

          <el-form-item label="URL权限标识" prop="urlPerm">
            <el-input placeholder="例：/system/users" v-model="urlPerm.requestPath" class="input-with-select">
              <el-select v-model="urlPerm.serviceName" style="width: 130px;" slot="prepend" placeholder="所属服务"
                         clearable>
                <el-option value="erp-auth" label="认证中心服务"/>
                <el-option value="saas-ecommerce" label="电商服务"/>
                <el-option value="saas-system" label="系统服务"/>
              </el-select>
              <el-select v-model="urlPerm.requestMethod" style="width: 120px;margin-left: 20px" slot="prepend"
                         placeholder="请求方式" clearable>
                <el-option value="*" label="不限"/>
                <el-option value="GET" label="GET"/>
                <el-option value="POST" label="POST"/>
                <el-option value="PUT" label="PUT"/>
                <el-option value="DELETE" label="DELETE"/>
              </el-select>
            </el-input>
            <el-link type="primary" v-show="urlPerm.requestMethod">
              {{ urlPerm.requestMethod }}_/{{ urlPerm.serviceName }}{{ urlPerm.requestPath }}
            </el-link>
          </el-form-item>

          <el-form-item label="按钮权限标识" prop="btnPerm">
            <el-input v-model="form.btnPerm" placeholder="例：sys:user:add"/>
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
import request from "@/utils/request";

export default {
  name: "permission",
  props: ["type"], //权限类型: 1-接口权限 2-操作权限
  data() {
    return {
      loading: false,
      ids: [],
      single: true,
      multiple: true,
      queryParams: {
        queryMode: 'page',
        name: undefined,
        menuId: undefined,
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
      form: {
        name: undefined,
        urlPerm: undefined,
        btnPerm: undefined
      },
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
      urlPerm: {
        requestMethod: undefined,
        serviceName: undefined,
        requestPath: undefined

      }
    }
  },
  methods: {
    handleQuery() {
      this.queryParams.page = this.pagination.page
      this.queryParams.limit = this.pagination.limit

      this.queryParams.menuId = this.menu.id
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
        title: this.menuName + '新增权限',
        visible: true
      }
    },

    handleEdit(row) {
      this.resetForm()
      this.dialog = {
        title: this.menuName + '编辑权限',
        visible: true
      }
      const id = row.id
      detail(id).then(response => {
        const {data} = response
        // 处理URL权限
        const urlPerm = data.urlPerm
        this.form = data
        if (urlPerm) {
          const permArr = urlPerm.split('_')
          const requestMethod = permArr[0]
          const serviceName = permArr[1].substring(1, permArr[1].substr(1).indexOf('/') + 1)
          const requestPath = permArr[1].substring(permArr[1].substr(1).indexOf('/') + 1)
          this.urlPerm = {
            requestMethod: requestMethod,
            serviceName: serviceName,
            requestPath: requestPath
          }
        }
      })
    },
    handleSubmit: function () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          // 两个权限必选一个
          if (!this.form.requestPath && !this.form.btnPerm) {
            this.$message.warning('请至少填写一种权限')
            return false
          }

          if (!this.form.requestPath) {
            if (!this.urlPerm.requestMethod) {
              this.$message.warning('URL权限的请求方式不能为空')
              return false
            }
            if (!this.urlPerm.serviceName) {
              this.$message.warning('URL权限的所属服务不能为空')
              return false
            }
          }
          this.form.urlPerm = this.urlPerm.requestMethod + '_/' + this.urlPerm.serviceName + this.urlPerm.requestPath;
          this.form.menuId = this.menu.id
          if (this.form.id != undefined) {
            update(this.form.id, this.form).then(() => {
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
        menuId: this.menu.id,
      }
      this.urlPerm = {}
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
      this.queryParams.menuId = undefined
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

