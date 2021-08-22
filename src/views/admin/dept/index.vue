<template>
  <div class="app-container">
    <el-form ref="queryForm" size="small" :inline="true" :model="queryParams">
      <el-form-item>
        <el-button icon="el-icon-plus" type="success" @click="handleAdd">新增</el-button>
      </el-form-item>

      <el-form-item>
        <el-input
          v-model="queryParams.name"
          placeholder="部门名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          @click="handleQuery"
        >搜索
        </el-button>
        <el-button icon="el-icon-refresh" @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      :data="tableList"
      row-key="id"
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      border
    >
      <el-table-column prop="name" label="部门名称"/>
      <el-table-column prop="status" label="状态" width="100">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status==1" type="success">正常</el-tag>
          <el-tag v-else type="info">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="显示排序" width="200"/>
      <el-table-column label="操作" align="center" width="150">
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
            type="success"
            icon="el-icon-plus"
            size="mini"
            circle
            plain
            @click.stop="handleAdd(scope.row)"
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

    <!-- 添加或修改部门对话框 -->
    <el-dialog
      :title="dialog.title"
      :visible.sync="dialog.visible"
      width="600px"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="80px"
      >

        <el-form-item label="上级部门" prop="parentId">
          <tree-select
            v-model="form.parentId"
            :options="deptOptions"
            placeholder="选择上级部门"
          />
        </el-form-item>

        <el-form-item label="部门名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入部门名称"/>
        </el-form-item>

        <el-form-item label="显示排序" prop="sort">
          <el-input-number v-model="form.sort" controls-position="right" style="width: 100px" :min="0"/>
        </el-form-item>
        <el-form-item label="部门状态">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
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
import {getDeptTableList,getDeptSelectList, detail, update, add, del} from '@/api/admin/dept'
import TreeSelect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  components: {TreeSelect},
  data() {
    return {
      loading: true,
      tableList: [],
      deptOptions: [],
      queryParams: {
        name: undefined,
        status: undefined
      },
      dialog: {
        title: undefined,
        visible: false
      },
      form: {
        parentId: undefined,
        name: undefined,
        sort: 1,
        status: 1
      },
      rules: {
        parentId: [
          {required: true, message: '上级部门不能为空', trigger: 'blur'}
        ],
        name: [
          {required: true, message: '部门名称不能为空', trigger: 'blur'}
        ],
        /*        mobile: [
                  {
                    pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
                    message: '请输入正确的手机号码',
                    trigger: 'blur'
                  }
                ],
                email: [
                  {
                    type: 'email',
                    message: "'请输入正确的邮箱地址",
                    trigger: ['blur', 'change']
                  }
                ]*/
      }
    }
  },
  created() {
    this.handleQuery()
  },
  methods: {
    handleQuery() {
      getDeptTableList(this.queryParams).then(response => {
        this.tableList = response.data
        this.loading = false
      })
    },
    handleReset() {
      this.queryParams = {
        name: undefined,
        status: undefined
      }
      this.handleQuery()
    },
    async handleAdd(row) {
      this.resetForm()
      this.dialog = {
        title: '新增部门',
        visible: true
      }
      await this.loadDeptOptions()
      if (row) {
        this.form.parentId = row.id
      }
    },
    async handleUpdate(row) {
      this.resetForm()
      this.dialog = {
        title: '修改部门',
        visible: true
      }
      // 部门下拉数据
      await this.loadDeptOptions()
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
      const ids = [row.id || this.ids].join(',')
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
        parentId: undefined,
        name: undefined,
        sort: 1,
        status: 1
      }
    },
    loadDeptOptions() {
      getDeptSelectList().then(response => {
        this.deptOptions = [{
          id: 0,
          label: '无',
          children: response.data
        }]
      })
    }
  }
}
</script>
