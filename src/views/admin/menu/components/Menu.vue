<template>
  <div>
    <el-row :gutter="10">
      <el-col :sm="12" :xs="24">
        <el-card class="box-card">
          <div class="clearfix" slot="header">
            <span>菜单列表</span>
          </div>

          <!-- 搜索表单 -->
          <el-form
            ref="queryForm"
            size="small"
            :model="queryParams"
            :inline="true"
          >
            <el-form-item>
              <el-button type="success" icon="el-icon-plus" @click="handleAdd">新增</el-button>
            </el-form-item>
            <el-form-item>
              <el-input
                v-model="queryParams.name"
                placeholder="菜单名称"
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
            v-loading="loading"
            :data="pageList"
            row-key="id"
            highlight-current-row
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
            @row-click="rowClick"
            border>
            <el-table-column label="菜单名称" min-width="11%">
              <template slot-scope="scope">
                <svg-icon :icon-class="scope.row.icon"/>
                {{ scope.row.name }}
              </template>
            </el-table-column>
            <el-table-column label="状态" width="80">
              <template slot-scope="scope">
                <el-tag size="mini" v-if="scope.row.status==1" type="success">正常</el-tag>
                <el-tag size="mini" v-else type="info">停用</el-tag>
              </template>
            </el-table-column>
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
                  type="success"
                  icon="el-icon-plus"
                  size="mini"
                  circle
                  @click="handleAdd(scope.row)"
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


        </el-card>
      </el-col>
      <el-col :sm="12" :xs="24">

        <el-card class="box-card">
          <div class="clearfix" slot="header">
            <span>{{ title }}</span>
          </div>

          <el-form
            ref="form"
            :model="form"
            :rules="rules"
            label-width="80px"
          >

            <el-form-item label="上级菜单">
              <tree-select
                v-model="form.parentId"
                :options="menuOptions"
                placeholder="选择上级菜单"
              />
            </el-form-item>

            <el-form-item label="菜单名称" prop="title">
              <el-input v-model="form.title" placeholder="请输入菜单名称"/>
            </el-form-item>

            <el-form-item label="菜单图标">
              <el-popover
                placement="bottom-start"
                width="460"
                trigger="click"
                @show="$refs['iconSelect'].reset()">
                <IconSelect ref="iconSelect" @selected="handleIconSelected"/>
                <el-input slot="reference" v-model="form.icon" placeholder="点击选择图标" readonly>
                  <svg-icon
                    v-if="form.icon"
                    slot="prefix"
                    :icon-class="form.icon"
                    class="el-input__icon"
                    style="height: 40px;width: 16px; "/>
                  <i v-else slot="prefix" class="el-icon-search el-input__icon"/>
                </el-input>
              </el-popover>
            </el-form-item>

            <el-form-item label="路由路径" prop="path">
              <el-input v-model="form.path"/>
            </el-form-item>

            <el-form-item label="组件" prop="component">
              <el-input v-model="form.component"/>
            </el-form-item>

            <el-form-item label="菜单状态">
              <el-radio-group v-model="form.status">
                <el-radio :label="1">正常</el-radio>
                <el-radio :label="0">禁用</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="排序" prop="sort">
              <el-input-number v-model="form.sort" controls-position="right" :min="0"/>
            </el-form-item>

            <el-form-item label="跳转路径">
              <el-input v-model="form.redirect" placeholder="请输入跳转路径" maxlength="50"/>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="handleSubmit">保存</el-button>
            </el-form-item>

          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {add, del, detail, list, patch, update} from "@/api/admin/menu";
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import TreeSelect from '@riophae/vue-treeselect'
import IconSelect from '@/components/IconSelect'

export default {
  name: "Menu",
  components: {TreeSelect, IconSelect},
  data() {
    return {
      loading: true,
      ids: [],
      single: true,
      multiple: true,
      queryParams: {
        name: undefined,
        queryMode: 'tree'
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
        parentId:0,
        status: 1,
        icon: '',
        sort: 1
      },
      rules: {
        name: [
          {required: true, message: '请输入字典名称', trigger: 'blur'}
        ],
        code: [
          {
            required: true, message: '请输入字典编码', trigger: 'blur'
          }
        ]
      },
      title: '新增',
      menuOptions: [],
      currentRow: {}
    }
  },
  created() {
    this.loadMenuOptions()
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
      this.queryParams = {
        name: undefined,
        queryMode: undefined
      }
      this.handleQuery()
    },
    rowClick(row) {
      this.currentRow = row
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
      console.log(this.currentRow.id)
      this.form.parentId = this.currentRow.id
      console.log(this.form.parentId)
      this.title = '新增'
    },

    handleUpdate(row) {
      this.resetForm()
      this.title = '修改'
      this.form = row
    },

    handleSubmit: function () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          const id = this.form.id
          if (id != undefined) {
            update(id, this.form).then(() => {
              this.$message.success('修改成功')
              this.handleQuery()
            })
          } else {
            add(this.form).then(() => {
              this.$message.success('新增成功')
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
    resetForm() {
      this.form = {
        status: 1,
        icon: ''
      }
      if (this.$refs['form']) {
        this.$refs['form'].resetFields()
      }
    },
    loadMenuOptions() {
      this.menuOptions = []
      list({queryMode: 'treeselect'}).then(response => {
        const menuOption = {id: 0, label: '主类目', children: response.data}
        this.menuOptions.push(menuOption)
      })
    },
    handleIconSelected(name) {
      this.form.icon = name
    },
  }
}
</script>

<style scoped>

</style>
