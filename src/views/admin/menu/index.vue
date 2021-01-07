<template>
  <div class="app-container">
    <el-form ref="queryForm" size="small" :model="queryParams" :inline="true">
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
        <el-select v-model="queryParams.visible" placeholder="菜单状态" clearable>
          <el-option label="正常" value="1"/>
          <el-option label="停用" value="0"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="handleResetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      :data="pageList"
      row-key="id"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      border>
      <el-table-column prop="title" label="菜单名称" :show-overflow-tooltip="true" min-width="11%"/>
      <el-table-column prop="icon" label="图标" align="center" min-width="11%">
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.icon"/>
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序" min-width="11%"/>
      <el-table-column prop="name" label="路由名称" min-width="11%"/>
      <el-table-column prop="path" label="路由路径" min-width="11%"/>
      <el-table-column prop="component" label="组件路径" min-width="11%"/>
      <el-table-column prop="visible" label="是否显示" :formatter="visibleFormat" min-width="11%"/>
      <el-table-column label="操作" align="center" min-width="12%" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改
          </el-button>
          <el-button
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
          >新增
          </el-button>
          <el-button
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :title="dialog.title"
      :visible.sync="dialog.visible"
      width="600px"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级菜单">
              <tree-select
                v-model="form.parentId"
                :options="menuOptions"
                placeholder="选择上级菜单"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="菜单图标">
              <el-popover
                placement="bottom-start"
                width="460"
                trigger="click"
                @show="$refs['iconSelect'].reset()">
                <IconSelect ref="iconSelect" @selected="selected"/>
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
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单名称" prop="name">
              <el-input v-model="form.title" placeholder="请输入菜单名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序" prop="sort">
              <el-input-number v-model="form.sort" controls-position="right" :min="0"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="路由名称" prop="path">
              <el-input v-model="form.name" placeholder="请输入路由名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="路由路径" prop="path">
              <el-input v-model="form.path" placeholder="请输入路由路径"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="组件路径" prop="component">
              <el-input v-model="form.component" placeholder="请输入组件路径"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="跳转路径">
              <el-input v-model="form.redirect" placeholder="请输入跳转路径" maxlength="50"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="菜单状态">
              <el-radio-group v-model="form.visible">
                <el-radio :label="1">显示</el-radio>
                <el-radio :label="0">隐藏</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
        <el-button @click="dialog.visible=false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>

  import {list, detail, update, add, del} from '@/api/admin/menu'
  import TreeSelect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  import IconSelect from '@/components/IconSelect'

  export default {
    components: {TreeSelect, IconSelect},
    data() {
      return {
        loading: true,
        pageList: [],
        menuOptions: [],
        queryParams: {
          name: undefined
        },
        dialog: {
          title: undefined,
          visible: false
        },
        form: {
          id: undefined,
          title: undefined,
          parentId: undefined,
          name: undefined,
          path: undefined,
          components: undefined,
          redirect: undefined,
          icon: undefined,
          sort: undefined,
          visible: 1, // 默认可见
          status: 1 // 默认可用
        },
        rules: {
          name: [
            {required: true, message: '菜单名称不能为空', trigger: 'blur'}
          ],
          sort: [
            {required: true, message: '菜单顺序不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    created() {
      this.handleQuery()
    },
    methods: {
      handleQuery() {
        this.queryParams.queryMode = 'tree'
        list(this.queryParams).then(response => {
          this.pageList = response.data
          this.loading = false
        })
      },
      handleResetQuery() {
        this.queryParams = {
          name: undefined,
          status: undefined
        }
        this.handleQuery()
      },
      visibleFormat(row) {
        if (row.type == 2) {
          return ''
        }
        if (row.visible == 1) {
          return '显示'
        } else if (row.visible == 0) {
          return '隐藏'
        } else {
          return ''
        }
      },
      selected(name) {
        this.form.icon = name
      },
      async handleAdd(row) {
        this.resetForm()
        this.dialog = {
          title: '新增菜单',
          visible: true
        }
        await this.loadMenuOptions()
        if (row) {
          this.form.parentId = row.id
        }
      },
      async handleUpdate(row) {
        this.resetForm()
        this.dialog = {
          title: '修改菜单',
          visible: true
        }
        await this.loadMenuOptions()
        detail(row.id).then(response => {
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
      handleDelete(row) {
        const ids = row.id || this.ids
        this.$confirm('确认删除已选中的数据项?', '警告', {
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
          id: undefined,
          name: undefined,
          parentId: undefined,
          path: undefined,
          components: undefined,
          perms: undefined,
          type: 1, // 默认菜单
          icon: undefined,
          sort: undefined,
          visible: 1, // 默认可见
          status: 1 // 默认可用
        }
        if (this.$refs['form']) {
          this.$refs['form'].resetFields()
        }
      },
      loadMenuOptions() {
        this.queryParams.queryMode = 2
        this.menuOptions = []
        list(this.queryParams).then(response => {
          const menuOption = {id: 0, label: '主类目', children: response.data}
          this.menuOptions.push(menuOption)
        })
      }

    }
  }
</script>
