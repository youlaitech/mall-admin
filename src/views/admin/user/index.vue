<template>
  <div class="app-container">
    <el-row :gutter="40">
      <!--部门数据-->
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input
            v-model="deptName"
            clearable
            placeholder="请输入部门名称"
            prefix-icon="el-icon-search"
            size="small"
            style="margin-bottom: 20px"
          />
        </div>
        <div class="head-container">
          <el-tree
            ref="tree"
            :data="deptOptions"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            default-expand-all
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>

      <el-col :span="20" :xs="24">
        <el-form ref="queryForm" :inline="true" :model="queryParams" label-width="68px" size="small">
          <el-form-item>
            <el-button
              icon="el-icon-plus"
              type="primary"
              @click="handleAdd"
              v-has-permission="['sys:user:add']"
            >新增
            </el-button>
            <el-button
              :disabled="single"
              icon="el-icon-edit"
              type="success"
              style="margin-left:15px"
              @click="handleUpdate"
              v-has-permission="['sys:user:edit']"
            >修改
            </el-button>
            <el-button
              :disabled="multiple"
              icon="el-icon-delete"
              type="danger"
              style="margin-left:15px"
              v-has-permission="['sys:user:delete']"
              @click="handleDelete"
            >删除
            </el-button>
          </el-form-item>

          <el-form-item prop="nickname">
            <el-input
              v-model="queryParams.nickname"
              clearable
              placeholder="用户昵称"
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item prop="mobile" style="margin-left: 10px">
            <el-input
              v-model="queryParams.mobile"
              clearable
              placeholder="手机号码"
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item prop="status" style="margin-left: 10px">
            <el-select
              v-model="queryParams.status"
              clearable
              size="small"
              style="width: 150px"
              placeholder="全部"
            >
              <el-option label="正常" value="1"/>
              <el-option label="停用" value="0"/>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="primary" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>

        <el-table
          v-loading="loading"
          element-loading-text="数据载入中"
          element-loading-spinner="el-icon-loading"
          border
          :data="pageList"
          @selection-change="handleSelectionChange" >
          <el-table-column align="center" type="selection" width="50"/>
          <el-table-column align="center" label="用户编号" prop="id" width="100"/>
          <el-table-column align="center" label="用户名" prop="username" width="150"/>
          <el-table-column align="center" label="用户昵称" prop="nickname" width="150"/>
          <el-table-column align="center" label="性别" prop="gender" width="150">
            <template slot-scope="scope">
              <span v-if="scope.row.gender===1">男</span>
              <span v-if="scope.row.gender===2">女</span>
              <span v-if="scope.row.gender===0">未知</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="部门" prop="deptName" width="150"/>
          <el-table-column align="center" label="角色名称" prop="roleNames" />
          <el-table-column align="center" label="手机号码" prop="mobile" width="150"/>
          <el-table-column align="center" label="状态" width="150">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                :active-value="1"
                :inactive-value="0"
                @change="handleStatusChange(scope.row)"
              />
            </template>
          </el-table-column>

          <el-table-column align="center" label="操作" width="200">
            <template slot-scope="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                circle
                plain
                @click.stop="handleUpdate(scope.row)"
                v-has-permission="['sys:user:edit']" />
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                circle
                plain
                @click.stop="handleDelete(scope.row)"
                v-has-permission="['sys:user:delete']"/>
              <el-button
                type="info"
                icon="el-icon-key"
                size="mini"
                circle
                plain
                @click.stop="handleResetPassword(scope.row)"
                v-has-permission="['sys:user:reset']"/>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="pagination.total>0"
          :limit.sync="pagination.limit"
          :page.sync="pagination.page"
          :total="pagination.total"
          @pagination="handleQuery"
        />
      </el-col>
    </el-row>
    <!-- 新增或修改参数配置对话框 -->
    <el-dialog :title="dialog.title" :visible.sync="dialog.visible" width="800px">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" :disabled="form.id !== undefined" placeholder="请输入用户名"/>
        </el-form-item>
        <el-form-item label="用户昵称" prop="nickname">
          <el-input v-model="form.nickname" placeholder="请输入用户昵称"/>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="form.gender" placeholder="请选择">
            <el-option label="未知" :value="0"/>
            <el-option label="男" :value="1"/>
            <el-option label="女" :value="2"/>
          </el-select>
        </el-form-item>
        <el-form-item label="角色" prop="roleIds">
        <el-select v-model="form.roleIds" multiple placeholder="请选择角色" style="width: 250px">
          <el-option
            v-for="item in roleOptions"
            :label="item.name"
            :value="item.id.toString()"/>
        </el-select>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="form.mobile" maxlength="11" placeholder="请输入手机号码"/>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" maxlength="50" placeholder="请输入邮箱"/>
        </el-form-item>
        <el-form-item label="所属部门" prop="deptId">
          <tree-select v-model="form.deptId" :options="deptOptions" placeholder="请选择所属部门"/>
        </el-form-item>
        <el-form-item label="状态">
        <el-radio-group v-model="form.status">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="0">停用</el-radio>
          </el-radio-group>
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
  import {add, del, detail, list, patch, update} from '@/api/admin/user'
  import {getDeptSelectList } from '@/api/admin/dept'
  import {list as roleList} from '@/api/admin/role'
  import TreeSelect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'

  export default {
    components: {TreeSelect},
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
          username: undefined,
          mobile: undefined
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
        // 部门名称
        deptName: undefined,
        // 部门树选项
        deptOptions: undefined,
        // 角色选项
        roleOptions: [],
        // 表单参数
        form: {
          roleIds: []
        },
        // 表单校验
        rules: {
          username: [
            {required: true, message: '用户名不能为空', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '用户密码不能为空', trigger: 'blur'}
          ],
          roleId: [
            {required: true, message: '用户角色不能为空', trigger: 'blur'}
          ],
          deptId: [
            {required: true, message: '归属部门不能为空', trigger: 'blur'}
          ],
          email: [
            {
              type: 'email',
              message: '\'请输入正确的邮箱地址',
              trigger: ['blur', 'change']
            }
          ],
          mobile: [
            {
              pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
              message: '请输入正确的手机号码',
              trigger: 'blur'
            }
          ]
        }
      }
    },
    watch: {
      // 根据名称筛选部门树
      deptName(val) {
        this.$refs.tree.filter(val)
      }
    },
    created() {
      this.loadData()
    },
    methods: {
      async loadData() {
        this.handleQuery()
        await this.loadDeptOptions()
      },
      handleQuery() {
        this.queryParams.page = this.pagination.page
        this.queryParams.limit = this.pagination.limit
        list(this.queryParams).then(response => {
          const {data, total} = response
          this.pageList = data
          this.pagination.total = total
          this.loading = false
        })
      },
      handleReset() {
        this.pagination = {
          page: 1,
          limit: 10,
          total: 0
        }
        this.queryParams = {
          username: undefined,
          mobile: undefined
        }
        this.handleQuery()
      },
      // 筛选节点
      filterNode(value, data) {
        if (!value) {
          return true
        }
        return data.label.indexOf(value) !== -1
      },
      // 部门节点单击事件
      handleNodeClick(data) {
        this.queryParams.deptId = data.id
        this.handleQuery()
      },
      // 用户状态修改
      handleStatusChange(row) {
        const text = row.status === 1 ? '启用' : '停用'
        this.$confirm('确认要"' + text + row.username + '"用户吗?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          return patch(row.id, {status: row.status})
        }).then(() => {
          this.$message.success(text + '成功')
        }).catch(function () {
          row.status = row.status === 0 ? 1 : 0
        })
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.single = selection.length !== 1
        this.multiple = !selection.length
      },
      async handleAdd() {
        this.resetForm()
        this.dialog = {
          title: '新增用户',
          visible: true
        }
        await this.loadRoleOptions()
        await this.loadDeptOptions()
      },
      async handleUpdate(row) {
        this.resetForm()
        this.dialog = {
          title: '修改用户',
          visible: true
        }
        await this.loadRoleOptions()
        await this.loadDeptOptions()
        const id = row.id || this.ids
        detail(id).then(response => {
          this.form = response.data
        })
      },
      handleSubmit: function () {
        this.$refs['form'].validate(valid => {
          if (valid) {
            const id = this.form.id
            if (id !== undefined) {
              update(this.form.id, this.form).then(() => {
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
        const ids = row.id || this.ids.join(',')
        this.$confirm('是否确认删除选中的数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          return del(ids)
        }).then(() => {
          this.$message.success('删除成功')
          this.handleQuery()
        }).catch(() =>
          this.$message.info('已取消删除')
        )
      },
      handleResetPassword(row) {
        this.$prompt('请输入' + row.username + '"的新密码', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValidator: (value) => {
            if (!value || value.trim().length < 1) {
              return '请填写新密码'
            }
          }
        }).then(({value}) => {
          patch(row.id, {
            password: value
          }).then(() => {
            this.$message.success('修改成功，新密码是：' + value)
          })
        }).catch(() => {
        })
      },
      loadRoleOptions() {
        roleList({queryMode: 'list'}).then(response => {
          this.roleOptions = response.data
        })
      },
      loadDeptOptions() {
        getDeptSelectList().then(response => {
          this.deptOptions = response.data
        })
      },
      // 表单重置
      resetForm() {
        this.form = {
          id: undefined,
          deptId: undefined,
          username: undefined,
          nickname: undefined,
          mobile: undefined,
          email: undefined,
          gender: undefined,
          status: 1,
          remark: undefined,
          roleIds: []
        }
        if (this.$refs['form']) {
          this.$refs['form'].resetFields()
        }
      }
    }
  }
</script>
