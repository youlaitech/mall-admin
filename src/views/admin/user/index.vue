<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--部门数据-->
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input
            v-model="deptName"
            placeholder="部门名称"
            clearable
            size="small"
            prefix-icon="el-icon-search"
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
        <el-form ref="queryForm" :model="queryParams" size="small" :inline="true" label-width="68px">
          <el-form-item>
            <el-button icon="el-icon-plus" type="primary" @click="handleAdd">新增</el-button>
            <el-button type="success" icon="el-icon-edit" :disabled="single" @click="handleUpdate">修改
            </el-button>
            <el-button type="danger" icon="el-icon-delete" :disabled="multiple" @click="handleDelete">删除
            </el-button>
          </el-form-item>

          <el-form-item label="用户名" prop="username">
            <el-input
              v-model="queryParams.username"
              placeholder="用户名"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="手机号码" prop="mobile">
            <el-input
              v-model="queryParams.mobile"
              placeholder="手机号码"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select
              v-model="queryParams.status"
              placeholder="用户状态"
              clearable
            >
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
          @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50" align="center"/>
          <el-table-column label="用户编号" prop="id" width="180"/>
          <el-table-column label="用户名" prop="username"/>
          <el-table-column label="用户昵称" prop="nickName"/>
          <el-table-column label="角色" prop="roleGroup"/>
          <el-table-column label="部门" prop="deptName"/>
          <el-table-column label="手机号码" prop="tel" width="120"/>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                :active-value="1"
                :inactive-value="0"
                @change="handleStatusChange(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="250"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
              >修改
              </el-button>
              <el-button
                v-if="scope.row.id !=1"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
              >删除
              </el-button>
              <el-button
                type="text"
                icon="el-icon-key"
                @click="handleResetPassword(scope.row)"
              >重置密码
              </el-button>
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
      </el-col>
    </el-row>
    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="dialog.title" :visible.sync="dialog.visible" width="800px">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="form.username" :disabled="form.id != undefined" placeholder="请输入用户名"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户昵称" prop="nickname">
              <el-input v-model="form.nickName" placeholder="请输入用户昵称"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户性别">
              <el-select v-model="form.gender" placeholder="请选择">
                <el-option label="未知" value="0"/>
                <el-option label="男" value="1"/>
                <el-option label="女" value="2"/>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="角色">
              <el-select v-model="form.roleIds" multiple placeholder="请选择">
                <el-option
                  v-for="item in roleOptions"
                  :key="parseInt(item.id)"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号码" prop="tel">
              <el-input v-model="form.tel" placeholder="请输入手机号码" maxlength="11"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="归属部门" prop="deptId">
              <tree-select v-model="form.deptId" :options="deptOptions" placeholder="请选择归属部门"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <el-radio-group v-model="form.status">
                  <el-radio :label="1">正常</el-radio>
                  <el-radio :label="0">停用</el-radio>
                </el-radio-group>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"/>
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
  import {list, detail, update, add, del, patch} from '@/api/admin/user'
  import {list as deptList} from '@/api/admin/dept'
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
        form: {},
        // 表单校验
        rules: {
          username: [
            {required: true, message: '用户名不能为空', trigger: 'blur'}
          ],

          deptId: [
            {required: true, message: '归属部门不能为空', trigger: 'blur'}
          ],
          email: [
            {
              type: 'email',
              message: "'请输入正确的邮箱地址",
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
      handleResetQuery() {
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
        if (!value) return true
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
        this.single = selection.length != 1
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
            if (id != undefined) {
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
      handleResetPassword(row) {
        this.$prompt('请输入"' + row.username + '"的新密码', '提示', {
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
        roleList().then(response => {
          this.roleOptions = response.data
        })
      },
      loadDeptOptions() {
        deptList({queryMode:'treeselect'}).then(response => {
          this.deptOptions = [{
            id: 0,
            label: '有来科技',
            children: response.data
          }]
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
