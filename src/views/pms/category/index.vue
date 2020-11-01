<template>
  <div class="app-container">
    <el-form :inline="true" ref="queryForm" :model="queryParams">
      <el-form-item>
        <el-button type="primary" @click="handleAdd()">新增</el-button>
      </el-form-item>
      <el-form-item label="分类名称" prop="name">
        <el-input v-model="queryParams.name" placeholder="分类名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="handleResetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table
      id="dataTable"
      row-key="id"
      :data="list"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}">

      <el-table-column
        prop="name"
        label="分类名称"
        min-width="15%"
      >
      </el-table-column>

      <el-table-column
        prop="icon"
        label="分类图标"
        min-width="11%">
        <template slot-scope="scope">
          <el-popover
            placement="right"
            title=""
            trigger="click">
            <img :src="scope.row.icon">
            <img slot="reference" :src="scope.row.icon"
                 style="max-height: 40px;max-width: 40px">
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column
        prop="status"
        label="是否显示"
        min-width="11%">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="1"
            :inactive-value="0"
            @change="handleIsShowChange(scope.row)">
          </el-switch>
        </template>
      </el-table-column>

      <el-table-column
        prop="sort"
        label="排序"
        min-width="11%"
      >
      </el-table-column>

      <el-table-column
        label="操作"
        align="center"
        min-width="20%"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            v-show="scope.row.level===1"
            @click="handleAdd(scope.row)"
          >新增
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleEdit(scope.row)"
          >修改
          </el-button>
          <el-button
            size="mini"
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
      @close="cancel"
      top="5vh"
      width="50%">
      <el-form id="dataForm"
               label-width="150px"
               :model="form"
               :rules="rules"
               ref="form"
      >
        <el-form-item label="上级分类" prop="parentId">
          <el-select v-model="form.parentId">
            <el-option :label="item.name" :value="item.id" v-for="item in categoryOptions"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入分类名称"/>
        </el-form-item>
        <el-form-item label="分类图标" prop="icon">
          <single-upload v-model="form.icon"></single-upload>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="form.sort"/>
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
import {list, detail, update, add, del, patch} from '@/api/pms/category'
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
      queryParams: {
        name: undefined
      },
      list: [],
      categoryOptions: [],
      dialog: {
        title: undefined,
        visible: false
      },
      form: {
        status: 1
      },
      rules: {
        name: [{
          required: true, message: '请填写分类名称', trigger: 'blur'
        }]
      },
    }
  },
  methods: {
    handleQuery() {
      list(this.queryParams).then(response => {
        this.list = response.data
      })
    },
    handleResetQuery() {
      this.queryParams = {
        name: undefined
      }
      this.resetForm("queryForm")
      this.handleQuery()
    },
    // 树形下拉选择器
    loadFirstLevelCategoryList() {
      categoryFirstLevelList().then(response => {
        this.categoryOptions = response.data
      });
    },

    handleAdd(row) {
      this.handleResetForm()
      this.dialog = {
        title: "新增分类",
        visible: true
      }
      this.loadFirstLevelCategoryList()
      if (row) {
        this.form.parentId = row.id
        this.form.level = 2
      } else {
        this.form.parentId = "0"
        this.form.level = 1
      }
    },
    handleEdit(row) {
      this.handleResetForm()
      this.loadFirstLevelCategoryList()
      const id = row.id || this.ids
      this.dialog = {
        title: "修改分类",
        visible: true
      }
      categoryDetail(id).then(response => {
        this.form = response.data
      })
    },
    handleSubmit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          const id = this.form.id
          if (id != undefined) {
            categoryUpdate(id, this.form).then(() => {
              this.$message.success("修改成功")
              this.dialog.visible = false
              this.handleQuery()
            })
          } else {
            categoryAdd(this.form).then(() => {
              this.$message.success("新增成功")
              this.dialog.visible = false
              this.handleQuery()
            })
          }
        }
      })
    },
    handleDelete(row) {
      const ids = row.id || this.ids
      this.$confirm('是否确认删除选中的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        categoryDelete(ids).then(() => {
          this.$message.success("删除成功")
          this.handleQuery()
        })
      }).catch(() =>
        this.$message.info("已取消删除")
      )
    },
    handleRowClick(row) {
      this.$refs.multipleTable.toggleRowSelection(row);
    },
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    cancel() {
      this.dialog.visible = false
      this.handleResetForm()
    },
    handleResetForm() {
      this.resetForm("form")
      this.form = {
        status: 1
      }
    },
    handleIsShowChange(row) {
      categoryIsShowUpdate(row.id, row.status).then(() => {
        this.$message.success("更新分类可见状态成功")
      })
    }
  },

  created() {
    this.handleQuery()
  }
}
</script>

<style scoped>

</style>
