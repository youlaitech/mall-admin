<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryParams" size="small" :inline="true">
      <el-form-item>
        <el-button type="primary" icon="el-icon-plus" @click="handleAdd">新增</el-button>
        <el-button type="success" icon="el-icon-edit" :disabled="single" @click="handleUpdate">修改</el-button>
        <el-button type="danger" icon="el-icon-delete" :disabled="multiple" @click="handleDelete">删除</el-button>
      </el-form-item>
      <el-form-item label="客户端ID" prop="clientId">
        <el-input
          v-model="queryParams.clientId"
          placeholder="客户端ID"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="handleResetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="pageList" border @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="序号" type="index" width="55" align="center"/>
      <el-table-column label="客户端ID" prop="clientId" width="200"/>
      <el-table-column label="客户端密钥" prop="clientSecret" width="100"/>
      <el-table-column label="域" width="100" prop="scope"/>
      <el-table-column label="自动放行" prop="autoapprove" :formatter="autoapproveFormat" width="100"/>
      <el-table-column label="授权方式" prop="authorizedGrantTypes" :formatter="authorizedGrantTypesFormat"/>
      <el-table-column label="认证令牌时效(单位：秒)" width="200" prop="accessTokenValidity"/>
      <el-table-column label="刷新令牌时效(单位：秒)" width="200" prop="refreshTokenValidity"/>
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
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除
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

    <!-- 添加或修改资源配置对话框 -->
    <el-dialog :title="dialog.title" :visible.sync="dialog.visible" width="700px">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">

        <el-row>
          <el-col :span="12">
            <el-form-item label="客户端ID" prop="clientId">
              <el-input v-model="form.clientId" placeholder="请输入客户端ID"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户端密钥" prop="clientSecret">
              <el-input v-model="form.clientSecret" placeholder="请输入客户端密钥"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="域" prop="scope">
              <el-input v-model="form.scope" placeholder="请输入域"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="自动放行" prop="autoapprove">
              <el-radio-group v-model="form.autoapprove">
                <el-radio label="true">是</el-radio>
                <el-radio label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="授权方式" prop="authorizedGrantTypes">
          <el-checkbox-group v-model="form.authorizedGrantTypes">
            <el-checkbox v-for="item in authorizedGrantTypesOptions" :label="item.value">{{ item.name }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-row>
          <el-col :span="12">
            <el-form-item label="认证令牌时效" prop="accessTokenValidity">
              <el-input v-model="form.accessTokenValidity" placeholder="请输入认证令牌时效"/>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="刷新令牌时效" prop="refreshTokenValidity">
              <el-input v-model="form.refreshTokenValidity" placeholder="请输入刷新令牌时效"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="回调地址" prop="webServerRedirectUri">
              <el-input v-model="form.webServerRedirectUri" placeholder="请输入回调地址"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="权限" prop="authorities">
              <el-input v-model="form.authorities" placeholder="请输入权限"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="扩展信息" prop="additionalInformation">
          <el-input v-model="form.additionalInformation" type="textarea" placeholder="JSON格式"/>
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
import {list, detail, update, add, del} from '@/api/admin/client'
import {list as dictList} from '@/api/admin/dict'

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
        clientId: undefined
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
      // 授权方式
      authorizedGrantTypesOptions: [],
      // 表单参数
      form: {
        authorizedGrantTypes: [],
        clientSecret: undefined,
        clientId: undefined,
        accessTokenValidity: undefined,
        refreshTokenValidity: undefined,
        webServerRedirectUri: undefined,
        authorities: undefined,
        additionalInformation: undefined,
        autoapprove:'false'
      },
      // 表单校验
      rules: {
        clientId: [
          {required: true, message: '客户端ID不能为空', trigger: 'blur'}
        ],
        clientSecret: [
          {required: true, message: '客户端密钥不能为空', trigger: 'blur'}
        ],
        scope: [
          {required: true, message: '域不能为空', trigger: 'blur'}
        ],
        authorizedGrantTypes: [
          {required: true, message: '请选择授权方式', trigger: 'blur'}
        ]
      }
    }
  },
  async created() {
    await this.loadAuthorizedGrantTypesOptions()
    this.handleQuery()
  },
  methods: {
    loadAuthorizedGrantTypesOptions() {
      dictList({typeCode: 'grant_type'}).then(response => {
        this.authorizedGrantTypesOptions = response.data
      })
    },
    handleQuery() {
      this.queryParams.page = this.pagination.page
      this.queryParams.limit = this.pagination.limit
      list(this.queryParams).then(response => {
        this.pageList = response.data
        this.pagination.total = response.total
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
        clientId: undefined
      }
      this.handleQuery()
    },
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.clientId)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    handleAdd() {
      this.resetForm()
      this.loadAuthorizedGrantTypesOptions()
      this.dialog = {
        title: '新增资源',
        visible: true
      }
    },
    handleUpdate(row) {
      this.resetForm()
      this.loadAuthorizedGrantTypesOptions()
      this.dialog = {
        title: '修改资源',
        visible: true
      }
      const id = row.clientId || this.ids
      detail(id).then(response => {
        const {data} = response
        this.form = data
        if (data.authorizedGrantTypes) {
          this.form.authorizedGrantTypes = data.authorizedGrantTypes.split(',')
        }
      })
    },
    handleDelete(row) {
      const ids = row.clientId || this.ids
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
    handleSubmit: function () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          const id = this.form.clientId
          this.form.authorizedGrantTypes = this.form.authorizedGrantTypes.join(',')
          console.log('选中的授权方式', this.form.authorizedGrantTypes)

          if (id != undefined) {
            update(this.form.clientId, this.form).then(() => {
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
        authorizedGrantTypes: [],
        clientSecret: undefined,
        clientId: undefined,
        accessTokenValidity: undefined,
        refreshTokenValidity: undefined,
        webServerRedirectUri: undefined,
        authorities: undefined,
        additionalInformation: undefined,
        autoapprove:'false'
      }
      if (this.$refs['form']) {
        this.$refs['form'].resetFields()
      }
    },
    // 自动放行字典翻译
    autoapproveFormat(row) {
      return row.autoapprove == 'true' ? '是' : '否'
    },
    // 授权方式字典翻译
    authorizedGrantTypesFormat(row) {
      const grantTypes = row.authorizedGrantTypes
      if (!grantTypes) return

      let temp = []
      grantTypes.split(',').forEach(type => {
        temp.push(this.authorizedGrantTypesOptions.filter(item => item.value == type)[0].name)
      })

      return temp.join(' | ')
    }
  }
}
</script>
