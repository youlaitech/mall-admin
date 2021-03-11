<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryParams" :inline="true">
      <el-form-item>
        <el-button type="primary" @click="handleAdd">新增</el-button>
        <el-button type="success" @click="handleUpdate" :disabled="single">修改</el-button>
        <el-button type="danger" @click="handleDelete" :disabled="multiple">删除</el-button>
      </el-form-item>
      <el-form-item  prop="name">
        <el-input v-model="queryParams.name" placeholder="品牌名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      id="dataTable"
      ref="multipleTable"
      :data="pageList"
      @selection-change="handleSelectionChange"
      @row-click="handleRowClick"
      border>
      <el-table-column
        type="selection"
        min-width="5%"
      >
      </el-table-column>
      <el-table-column
        prop="name"
        label="品牌名称"
        min-width="10"
      >
      </el-table-column>
      <el-table-column
        prop="firstLetter"
        label="检索首字母"
        min-width="10"
      >
      </el-table-column>
      <el-table-column
        prop="logo"
        label="logo"
        min-width="10"
      >
        <template slot-scope="scope">
          <el-popover
            placement="right"
            trigger="click"
          >
            <img :src="scope.row.logo">
            <img slot="reference"
                 :src="scope.row.logo"
                 :alt="scope.row.logo"
                 style="max-height: 60px;max-width: 60px"
            />
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        prop="sort"
        label="排序"
        min-width="10"
      >
      </el-table-column>
      <el-table-column
        prop="status"
        label="是否显示"
        min-width="10"
      >
        <template slot-scope="scope">
          <el-switch
            @change="handleStatusChange(scope.row)"
            :active-value="1"
            :inactive-value="0"
            v-model="scope.row.status">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        min-width="10"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="pagination.total>0"
      :total="pagination.total"
      :page.sync="pagination.page"
      :limit.sync="pagination.limit"
      @pagination="handleQuery"/>

    <el-dialog
      :title="dialog.title"
      :visible.sync="dialog.visible"
      @close="cancel"
      top="5vh"
      width="40%">
      <el-form id="dataForm" label-width="120px" :model="form" :rules="rules" ref="form">
        <el-form-item label="品牌名称" prop="name">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="检索首字母" prop="firstLetter">
          <el-input v-model="form.firstLetter" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="logo" prop="logo" label-width="120px">
          <single-upload v-model="form.logo"></single-upload>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="form.sort" auto-complete="off" style="width: 180px"></el-input>
        </el-form-item>
        <el-form-item label="是否显示" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {list, detail, update, add, del, patch} from '@/api/pms/brand'
  import SingleUpload from '@/components/Upload/SingleUpload'

  export default {
    components: {SingleUpload},
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
        pagination: {
          page: 1,
          limit: 10,
          total: 0
        },
        queryParams: {
          name: undefined
        },
        pageList: [],
        dialog: {
          title: undefined,
          visible: false,
        },
        form: {
          name: undefined,
          firstLetter: undefined,
          logo: undefined,
          status: 1,
          sort: undefined
        },
        rules: {
          name: [{
            required: true, message: '请输入品牌名称', trigger: 'blur'
          }]
        }
      }
    },
    created() {
      this.handleQuery()
    },
    methods: {
      handleQuery() {
        this.queryParams.page = this.pagination.page
        this.queryParams.limit = this.pagination.limit
        list(this.queryParams).then(response => {
          this.loading = false
          const {data, total} = response
          this.pageList = data
          this.total = total
        });
      },
      handleReset() {
        this.pagination = {
          page: 1,
          limit: 10,
          total: 0
        }
        this.queryParams = {
          name: undefined
        };
        this.handleQuery()
      },
      handleRowClick(row) {
        this.$refs.multipleTable.toggleRowSelection(row);
      },
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id);
        this.single = selection.length != 1
        this.multiple = !selection.length
      },
      resetForm() {
        this.form = {
          name: undefined,
          firstLetter: undefined,
          logo: undefined,
          status: 1,
          sort: undefined
        }
        if (this.$refs['form']) {
          this.$refs['form'].resetFields()
        }
      },
      handleAdd() {
        this.dialog = {
          title: "新增品牌",
          visible: true
        }
      },
      handleUpdate(row) {
        this.dialog = {
          title: "修改品牌",
          visible: true
        }
        const id = row.id || this.ids
        detail(id).then(response => {
          this.form = response.data
        })
      },
      handleDelete(row) {
        const ids = row.id || this.ids;
        this.$confirm('确认删除已选中的数据项？', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
            del(ids).then(() => {
              this.$message.success("删除成功")
              this.handleQuery()
            })
          }
        ).catch(() =>
          this.$message.info("已取消删除")
        )
      },
      handleSubmit() {
        this.$refs["form"].validate((valid) => {
          if (valid) {
            const id = this.form.id
            if (id != undefined) {
              update(id, this.form).then(() => {
                this.$message.success("修改成功")
                this.dialog.visible = false
                this.handleQuery()
              })
            } else {
              add(this.form).then(() => {
                this.$message.success("新增成功")
                this.dialog.visible = false
                this.handleQuery()
              })
            }
          }
        })
      },
      cancel() {
        this.resetForm()
        this.dialog = {
          title: undefined,
          visible: false
        }
      },
      handleStatusChange(row) {
        const text = row.status === 1 ? '开启' : '关闭'
        this.$confirm('确认"' + text + row.name + '"数据项吗?', '警告', {
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
      }
    }
  }
</script>

<style scoped>

</style>
