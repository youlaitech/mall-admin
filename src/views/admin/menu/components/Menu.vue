<template>
  <div class="components-container">
    <el-card class="box-card" shadow="always">
      <div class="clearfix" slot="header">
        <b>
          <svg-icon icon-class="menu"/>
          菜单列表</b>
      </div>
      <!-- 搜索表单 -->
      <el-form
        ref="queryForm"
        size="mini"
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
          <el-button icon="el-icon-refresh" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 数据表格 -->
      <el-table
        v-loading="loading"
        :data="tableList"
        row-key="id"
        highlight-current-row
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        @row-click="handleRowClick"
        border
        size="mini"
      >
        <el-table-column label="菜单名称">
          <template slot-scope="scope">
            <svg-icon :icon-class="scope.row.icon?scope.row.icon:'build'"/>
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="130">
          <template slot-scope="scope">
            <el-button
              type="success"
              icon="el-icon-plus"
              size="mini"
              circle
              plain
              @click.stop="handleAdd(scope.row)"
            />
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
    </el-card>

    <el-dialog
      :title="dialog.title"
      :visible.sync="dialog.visible"
      width="200">
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="80px">
        <el-form-item label="上级菜单" prop="parentId">
          <tree-select
            v-model="form.parentId"
            :options="menuOptions"
            placeholder="选择上级菜单"
            @select="handleMenuSelect"
          />
        </el-form-item>

        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入菜单名称"/>
        </el-form-item>

        <el-form-item label="路由Path" prop="routePath">
          <el-input v-model="form.routePath" :placeholder="form.parentId==0?'/system':'user'" style="width: 95%"/>
          <el-tooltip effect="dark"
                      content="vue-router编程式路由跳转方式之一，例：this.$router.push({path:'/admin/user',query:{id:1}})"
                      placement="right">
            <i class="el-icon-info" style="margin-left: 5px;color:darkseagreen"></i>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="组件路径" prop="component">
          <el-input v-model="form.component" :readonly="form.parentId==0?true:false"
                    placeholder="system/user/index">
            <template v-if="form.parentId!=0" slot="prepend">src/views/</template>
            <template v-if="form.parentId!=0" slot="append">.vue</template>
          </el-input>
        </el-form-item>

        <el-form-item label="菜单图标">
          <el-popover
            placement="bottom-start"
            width="460"
            trigger="click"
            @show="$refs['iconSelect'].reset()">
            <IconSelect ref="iconSelect" @selected="handleIconSelected"/>
            <el-input slot="reference" v-model="form.icon" placeholder="点击选择图标">
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

        <el-form-item label="状态">
          <el-radio-group v-model="form.visible">
            <el-radio :label="1">显示</el-radio>
            <el-radio :label="0">隐藏</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" style="width: 100px" controls-position="right" :min="0"/>
        </el-form-item>

        <el-form-item label="跳转路径">
          <el-input v-model="form.redirect" placeholder="请输入跳转路径" maxlength="50"/>
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
import {getMenuTableList,getMenuSelectList, add, del, patch, update} from "@/api/admin/menu";
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
        name: undefined
      },
      tableList: [],
      dialog: {
        title: undefined,
        visible: false
      },
      form: {
        parentId: 0,
        visible: 1,
        icon: undefined,
        sort: 1,
        component: 'Layout',
        routeName: undefined,
        routePath: undefined
      },
      rules: {
        parentId: [
          {required: true, message: '请选择顶级菜单', trigger: 'blur'}
        ],
        name: [
          {required: true, message: '请输入菜单名称', trigger: 'blur'}
        ],
      },
      title: '新增菜单',
      menuOptions: [],
      currentRow: undefined
    }
  },
  created() {
    this.loadMenuOptions()
    this.handleQuery()
  },
  methods: {
    handleQuery() {
      this.resetForm()
      getMenuTableList(this.queryParams).then(response => {
        this.tableList = response.data
        this.loading = false
      })
    },
    handleReset() {
      this.queryParams.name = undefined
      this.handleQuery()
      this.loadMenuOptions()
    },
    handleRowClick(row) {
      const currentRow = JSON.parse(JSON.stringify(row));
      this.currentRow = currentRow
      this.form = currentRow
      this.title = '修改菜单'
      this.$emit('menuClick', row)
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

    handleAdd(row) {
      this.resetForm()
      this.dialog = {
        title: '新增菜单',
        visible: true
      }
      if (row.id) { // 行点击新增
        this.form.parentId = row.id
        this.form.component = undefined
      } else { // 工具栏点击新增
        if (this.currentRow) {
          this.form.parentId = this.currentRow.id
          this.form.component = undefined
        } else {
          this.form.parentId = 0
          this.form.component = 'Layout'
        }
      }
      this.title = '新增菜单'
    },
    handleEdit(row) {
      this.resetForm()
      this.dialog = {
        title: '修改菜单',
        visible: true
      }
      this.form = JSON.parse(JSON.stringify(row))
    },
    handleSubmit: function () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          const id = this.form.id
          if (id != undefined) {
            update(id, this.form).then(() => {
              this.$message.success('修改成功')
              this.handleQuery()
              this.loadMenuOptions()
              this.closeDialog()
            })
          } else {
            add(this.form).then(() => {
              this.$message.success('新增成功')
              this.handleQuery()
              this.loadMenuOptions()
              this.closeDialog()
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
          this.loadMenuOptions()
        })
      }).catch(() =>
        this.$message.info('已取消删除')
      )
    },
    resetForm() {
      this.form = {
        visible: 1,
        parentId: 0,
        icon: undefined,
        sort: 1,
        component: 'Layout',
        routeName: undefined,
        routePath: undefined
      }
      if (this.$refs['form']) {
        this.$refs['form'].resetFields()
      }
    },
    loadMenuOptions() {
      this.menuOptions = []
      getMenuSelectList().then(response => {
        const menuOption = {id: 0, label: '无', children: response.data}
        this.menuOptions.push(menuOption)
        this.$forceUpdate()
      })
    },
    handleIconSelected(name) {
      this.form.icon = name
      this.$forceUpdate()
    },
    handleMenuSelect(node) {
      if (node.id == 0) {
        this.form.component = 'Layout'
      } else {
        this.form.component = undefined
      }
    },
    closeDialog() {
      this.resetForm()
      this.dialog = {
        title: undefined,
        visible: false
      }
    }
  }
}
</script>

<style scoped>

</style>
