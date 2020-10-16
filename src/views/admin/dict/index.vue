<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="10" :xs="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>字典类型</span>
          </div>
          <el-form size="mini" :model="queryParamsForType" ref="queryFormForType" :inline="true">
            <el-form-item>
              <el-button type="success" icon="el-icon-plus" @click="handAddForType">新增</el-button>
              <el-button type="danger" icon="el-icon-delete" :disabled="singleForType" @click="handleDeleteForType">删除
              </el-button>
            </el-form-item>

            <el-form-item prop="name">
              <el-input
                v-model="queryParamsForType.name"
                placeholder="字典类型名称"
                clearable
                @keyup.enter.native="handleQueryForType"/>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="handleQueryForType">搜索</el-button>
              <el-button icon="el-icon-refresh" @click="handleResetQueryForType">重置</el-button>
            </el-form-item>
          </el-form>

          <el-table
            v-loading="loadingForType"
            :data="pageListForType"
          >
            <el-table-column width="80" align="center">
              <template scope="scope">
                <el-radio @change="handleDictTypeChange" v-model="selectedIndexForType"
                          :label="(scope.$index+1)"></el-radio>
              </template>
            </el-table-column>
            <el-table-column label="类型名称" prop="name" width="120"/>
            <el-table-column label="类型编码" prop="code"  :show-overflow-tooltip="true" width="160"/>
            <el-table-column label="状态" align="center" width="80">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.status"
                  :active-value="1"
                  :inactive-value="0"
                  @change="handleStatusChangeForType(scope.row)"
                />
              </template>
            </el-table-column>

            <el-table-column label="操作" align="center" width="150">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  icon="el-icon-edit"
                  size="mini"
                  @click="handleUpdateForType(scope.row)"
                >修改
                </el-button>
                <el-button
                  type="text"
                  size="mini"
                  icon="el-icon-delete"
                  @click="handleDeleteForType(scope.row)"
                >删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination
            v-show="paginationForType.total>0"
            :total="paginationForType.total"
            :page.sync="paginationForType.page"
            :limit.sync="paginationForType.limit"
            @pagination="handleQueryForType"
          />
          <el-dialog :title="typeDialog.title" :visible.sync="typeDialog.visible" width="500px">
            <el-form ref="typeForm" :model="typeForm" :rules="rulesForType" label-width="80px">
              <el-form-item label="字典名称" prop="name">
                <el-input v-model="typeForm.name" placeholder="请输入字典名称"/>
              </el-form-item>
              <el-form-item label="字典编码" prop="code">
                <el-input v-model="typeForm.code" placeholder="请输入字典编码"/>
              </el-form-item>
              <el-form-item label="状态" prop="status">
                <el-radio-group v-model="typeForm.status">
                  <el-radio :label="1">正常</el-radio>
                  <el-radio :label="0">停用</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="备注" prop="remark">
                <el-input v-model="typeForm.remark" type="textarea" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button type="primary" @click="handleSubmitForType">确 定</el-button>
              <el-button @click="typeDialog.visible=false">取 消</el-button>
            </div>
          </el-dialog>
        </el-card>
      </el-col>

      <!-- 字典数据 -->
      <el-col :span="14" :xs="24">
        <el-card>
          <div slot="header" class="clearfix">
            <span>字典数据</span>
          </div>
          <el-form :model="queryParams" ref="queryForm" :inline="true" size="mini">
            <el-form-item>
              <el-button type="success" icon="el-icon-plus" @click="handleAdd">新增</el-button>
              <el-button type="danger" icon="el-icon-delete" :disabled="multiple" click="handleDelete">删除</el-button>
            </el-form-item>
            <el-form-item prop="name">
              <el-input
                v-model="queryParams.name"
                placeholder="字典名称"
                clearable/>
            </el-form-item>
            <el-form-item prop="value">
              <el-input
                v-model="queryParams.typeCode"
                placeholder="类型编码"
                clearable
                @keyup.enter.native="handleQuery"/>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
              <el-button icon="el-icon-refresh" @click="handleResetQuery">重置</el-button>
            </el-form-item>
          </el-form>
          <el-table
            ref="table"
            v-loading="loading"
            :data="pageList"
            @selection-change="handleSelectionChange"
            @row-click="handleRowClick">
            <el-table-column type="selection" min-width="5%"></el-table-column>
            <el-table-column label="字典名称" prop="name" width="130"/>
            <el-table-column label="字典值" prop="value"  width="130"/>
            <el-table-column label="字典类型" prop="typeCode"  width="130"/>
            <el-table-column label="状态" align="center" width="80">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.status"
                  :active-value="1"
                  :inactive-value="0"
                  @change="handleStatusChange(scope.row)"
                />
              </template>
            </el-table-column>
            <el-table-column label="备注" prop="remark"/>
            <el-table-column label="操作" align="center" width="150">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  icon="el-icon-edit"
                  size="mini"
                  @click="handleUpdate(scope.row)"
                >修改
                </el-button>
                <el-button
                  type="text"
                  size="mini"
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

          <el-dialog :title="dialog.title" :visible.sync="dialog.visible" width="500px">
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
              <el-form-item label="字典类型" prop="typeCode">
                <el-input v-model="form.typeCode" :disabled="true"/>
              </el-form-item>
              <el-form-item label="字典名称" prop="text">
                <el-input v-model="form.name" placeholder="请输入字典名称"/>
              </el-form-item>
              <el-form-item label="字典值" prop="value">
                <el-input v-model="form.value" placeholder="请输入字典值"/>
              </el-form-item>
              <el-form-item label="排序" prop="sort">
                <el-input-number v-model="form.sort" style="width: 80px;" controls-position="right" :min="0"/>
              </el-form-item>
              <el-form-item label="状态" prop="status">
                <el-radio-group v-model="form.status">
                  <el-radio :label="1">正常</el-radio>
                  <el-radio :label="0">停用</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="备注" prop="remark">
                <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button type="primary" @click="handleSubmit">确 定</el-button>
              <el-button @click="dialog.visible=false">取 消</el-button>
            </div>
          </el-dialog>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {
    list as listForType,
    detail as detailForType,
    update as updateForType,
    add as addForType,
    del as delForType,
    patch as patchForType
  } from '@/api/admin/dict/type'
  import {list, detail, update, add, del, patch} from '@/api/admin/dict'

  export default {
    name: "index",
    data() {
      return {
        typeIds: [],
        queryParamsForType: {
          name: undefined
        },
        loadingForType: false,
        singleForType: true,
        selectedIndexForType: 1,
        pageListForType: [],
        paginationForType: {
          page: 1,
          limit: 10,
          total: 0
        },
        typeDialog: {
          title: undefined,
          visible: false
        },
        rulesForType: {
          name: [{
            required: true, message: '请输入字典名称', trigger: 'blur'
          }],
          code: [{
            required: true, message: '请输入字典编码', trigger: 'blur'
          }]
        },
        typeForm: {
          id: undefined,
          name: undefined,
          code: undefined,
          status: 1,
          remark: undefined
        },
        queryParams: {
          typeCode: undefined,
          name: undefined,
          value: undefined
        },
        pagination: {
          page: 1,
          limit: 10,
          total: 0
        },
        dialog: {
          title: undefined,
          visible: false
        },
        loading: false,
        single: true,
        multiple: true,
        pageList: [],
        ids: [],
        rules: {
          typeCode: [{
            required: true, message: '请输入字典编码', trigger: 'blur'
          }],
          name: [{
            required: true, message: '请输入字典名称', trigger: 'blur'
          }],
          value: [{
            required: true, message: '请输入字典值', trigger: 'blur'
          }]
        },
        form: {
          id: undefined,
          name: undefined,
          value: undefined,
          typeCode: undefined,
          status: 1,
          remark: undefined
        }
      }
    },
    created() {
      this.handleQueryForType()
    },
    methods: {
      handleQueryForType() {
        this.queryParamsForType.page = this.pagination.page
        this.queryParamsForType.limit = this.pagination.limit
        listForType(this.queryParamsForType).then(response => {
          const data = response.data
          this.pageListForType = data
          this.paginationForType.total = response.total
          this.loadingForType = false
          if (response.total > 0) {
            this.singleForType = false
            this.handleDictTypeChange()
          }
        })
      },
      handleResetQueryForType() {
        this.paginationForType = {
          page: 1,
          limit: 10,
          total: 0
        }
        this.queryParamsForType = {
          name: undefined
        }
        this.handleQueryForType()
      },
      handleDictTypeChange(val) {
        this.selectedIndexForType = val ? val : 1
        this.queryParams.typeCode = this.pageListForType[this.selectedIndexForType - 1].code

        this.handleQuery()
      },
      handleStatusChangeForType(row) {
        const text = row.status === 1 ? '启用' : '停用'
        this.$confirm('确认要"' + text + '""' + row.name + '"数据项吗?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          return patchForType(row.id, {status: row.status})
        }).then(() => {
          this.$message.success(text + '成功')
        }).catch(function () {
          row.status = row.status === 1 ? 0 : 1
        })
      },
      handAddForType() {
        this.resetTypeForm()
        this.typeDialog = {
          title: '新增字典类型',
          visible: true
        }
      },
      handleUpdateForType(row) {
        this.resetTypeForm()
        this.typeDialog = {
          title: '修改字典类型',
          visible: true
        }
        const id = row.id || this.typeIds
        detailForType(id).then(response => {
          this.typeForm = response.data
        })
      },
      handleDeleteForType(row) {
        const ids = row.id || this.typeIds
        this.$confirm('是否确认删除名称为"' + row.name + '"的数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delForType(ids).then(() => {
            this.$message.success('删除成功')
            this.handleQueryForType()
          })
        }).catch(() =>
          this.$message.info('已取消删除')
        )
      },
      handleSubmitForType: function () {
        this.$refs['typeForm'].validate(valid => {
          if (valid) {
            const id = this.typeForm.id
            if (id != undefined) {
              updateForType(this.typeForm.id, this.typeForm).then(() => {
                this.$message.success('修改成功')
                this.typeDialog.visible = false
                this.handleQueryForType()
              })
            } else {
              addForType(this.typeForm).then(() => {
                this.$message.success('新增成功')
                this.typeDialog.visible = false
                this.handleQueryForType()
              })
            }
          }
        })
      },
      resetTypeForm() {
        this.typeForm = {
          id: undefined,
          name: undefined,
          code: undefined,
          status: 1,
          remark: undefined
        }
        if (this.$refs['typeForm']) {
          this.$refs['typeForm'].resetFields()
        }
      },
      // -------------------- 字典数据 -------------------- //
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
          name: undefined
        }
        this.handleQuery()
      },
      handleAdd() {
        this.resetForm()
        this.dialog = {
          title: '新增字典数据',
          visible: true
        }
        this.form.typeCode = this.pageListForType[this.selectedIndexForType-1].code
      },
      handleUpdate(row) {
        this.resetForm()
        this.dialog = {
          title: '修改字典数据',
          visible: true
        }
        const id = row.id || this.ids
        detail(id).then(response => {
          this.form = response.data
        })
      },
      handleDelete() {
        const ids = row.id || this.ids
        this.$confirm('是否确认删除名称为"' + row.name + '"的数据项?', '警告', {
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
      handleStatusChange(row) {
        const text = row.status === 1 ? '启用' : '停用'
        this.$confirm('确认要' + text + '"' + row.name + '"数据项吗?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          return patch(row.id, {status: row.status})
        }).then(() => {
          this.$message.success(text + '成功')
        }).catch(function () {
          row.status = row.status === 1 ? 0 : 1
        })
      },
      resetForm() {
        this.form = {
          id: undefined,
          typeCode: undefined,
          value: undefined,
          name: undefined,
          remark: undefined,
          sort: 1,
          status: 1
        }
        if (this.$refs['form']) {
          this.$refs['form'].resetFields()
        }
      },
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.single = selection.length != 1
        this.multiple = !selection.length
      },
      handleRowClick(row) {
        this.$refs.table.toggleRowSelection(row)
      }
    }
  }
</script>

<style scoped>

</style>
