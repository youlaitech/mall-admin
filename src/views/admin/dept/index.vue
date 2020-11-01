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
        <el-select
          v-model="queryParams.status"
          placeholder="部门状态"
          clearable
        >
          <el-option label="正常" value="1"/>
          <el-option label="禁用" value="0"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          @click="handleQuery"
        >搜索
        </el-button>
        <el-button icon="el-icon-refresh" @click="handleResetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      :data="pageList"
      row-key="id"
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="name" label="部门名称"/>
      <el-table-column prop="sort" label="显示排序" width="200"/>
      <el-table-column prop="status" label="状态" :formatter="statusFormat" width="100"/>
      <el-table-column prop="leader" label="负责人" width="200"/>
      <el-table-column prop="mobile" label="联系电话" width="200"/>
      <el-table-column prop="email" label="邮箱" width="200"/>
      <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
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
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级部门" prop="parentId">
              <tree-select
                v-model="form.parentId"
                :options="deptOptions"
                placeholder="选择上级部门"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入部门名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="sort">
              <el-input-number v-model="form.sort" controls-position="right" :min="0"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="负责人" prop="leader">
              <el-input v-model="form.leader" placeholder="请输入负责人" maxlength="20"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="mobile">
              <el-input v-model="form.mobile" placeholder="请输入联系电话" maxlength="11"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门状态">
              <el-radio-group v-model="form.status">
                <el-radio :label="1">正常</el-radio>
                <el-radio :label="0">禁用</el-radio>
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
  import {list, detail, update, add, del} from '@/api/admin/dept'
  import TreeSelect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'

  export default {
    components: {TreeSelect},
    data() {
      return {
        loading: true,
        pageList: [],
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
          leader: undefined,
          mobile: undefined,
          email: undefined,
          status: 1
        },
        rules: {
          parentId: [
            {required: true, message: '上级部门不能为空', trigger: 'blur'}
          ],
          name: [
            {required: true, message: '部门名称不能为空', trigger: 'blur'}
          ],
          mobile: [
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
          ]
        }
      }
    },
    created() {
      this.handleQuery()
    },
    methods: {
      handleQuery() {
        this.queryParams.mode = 1
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
      statusFormat(row) {
        return row.status === 1 ? '正常' : '停用'
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
        const ids = row.id || this.ids
        this.$confirm('确认删除已勾选的数据项?', '警告', {
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
          leader: undefined,
          mobile: undefined,
          email: undefined,
          status: 1
        }
        if (this.$refs['form']) {
          this.$refs['form'].resetFields()
        }
      },
      loadDeptOptions() {
        this.queryParams.mode = 2
        this.deptOptions = []
        list(this.queryParams).then(response => {
          const deptOption = {id: 0, label: '有来科技'}
          if (response.data) {
            deptOption.children = response.data
          }
          this.deptOptions.push(deptOption)
        })
      }
    }
  }
</script>
