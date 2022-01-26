<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryParams" size="small" :inline="true">
      <el-form-item>
        <el-button type="primary" icon="el-icon-plus" @click="handleAdd">新增</el-button>
        <el-button type="success" icon="el-icon-edit" :disabled="single" @click="handleUpdate">修改</el-button>
        <el-button type="danger" icon="el-icon-delete" :disabled="multiple" @click="handleDelete">删除</el-button>
      </el-form-item>
      <el-form-item label="广告名称" prop="id">
        <el-input
          v-model="queryParams.name"
          placeholder="广告名称"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" :data="pageList" border @selection-change="handleSelectionChange">
      <el-table-column type="selection" min-width="5" align="center"/>
      <el-table-column type="index" label="序号" width="50" align="center"/>
      <el-table-column prop="name" label="广告名称" min-width="10"/>
      <el-table-column label="广告图片" min-width="10">
        <template slot-scope="scope">
          <el-popover
            placement="right"
            title=""
            trigger="hover">
            <img :src="scope.row.pic"/>
            <img slot="reference" :src="scope.row.pic" :alt="scope.row.pic"
                 style="max-height: 60px;max-width: 60px">
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="startTime" label="开始时间" min-width="10"/>
      <el-table-column prop="endTime" label="到期时间" min-width="10"/>
      <el-table-column prop="status" label="状态" min-width="6" :formatter="statusFormat"/>
      <el-table-column prop="sort" label="排序" min-width="6"/>
      <el-table-column label="操作" align="center" min-width="10"  class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)">
            修改
          </el-button>
          <el-button
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="pagination.total>0"
      :total="pagination.total"
      :page.sync="pagination.pageNum"
      :limit.sync="pagination.pageSize"
      @pagination="handleQuery"/>

    <el-dialog :title="dialog.title" :visible.sync="dialog.visible" width="700px">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="广告名称" required prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="开始时间" required prop="startTime">
              <el-date-picker
                v-model="form.startTime"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="到期时间" required prop="endTime">
              <el-date-picker
                v-model="form.endTime"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="广告图片" prop="pic">
          <single-upload v-model="form.pic"></single-upload>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="排序" prop="sort">
              <el-input v-model="form.sort" style="width: 200px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio :label="1">开启</el-radio>
                <el-radio :label="0">关闭</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="广告链接" prop="url">
          <el-input v-model="form.url"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="form.remark"></el-input>
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
import {list, detail, update, add, del} from '@/api/sms/advert'
import SingleUpload from "@/components/Upload/SingleUpload";

export default {
  components: {
    SingleUpload
  },
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
      pagination: {
        pageNum:1,
        pageSize:10,
        total: 0
      },
      pageList: [],
      dialog: {
        title: undefined,
        visible: false
      },
      // 菜单列表
      menuOptions: [],
      // 表单参数
      form: {
        id: undefined,
        name: undefined,
        pic: undefined,
        startTime: undefined,
        endTime: undefined,
        status: 1,
        sort: undefined,
        url: undefined,
        remark: undefined
      },
      // 表单校验
      rules: {
        name: [
          {required: true, message: '请输入广告名称', trigger: 'blur'}
        ],
        pic: [
          {required: true, message: '请上传广告图片', trigger: 'blur'}
        ]
      }
    }
  },
  async created() {
    this.handleQuery()
  },
  methods: {
    handleQuery() {
      this.queryParams.pageNum = this.pagination.pageNum
      this.queryParams.pageSize = this.pagination.pageSize
      list(this.queryParams).then(response => {
        this.pageList = response.data
        this.pagination.total = response.total
        this.loading = false
      })
    },
    handleReset() {
      this.pagination = {
        pageNum:1,
        pageSize:10,
        total: 0
      }
      this.queryParams = {
        id: undefined
      }
      this.handleQuery()
    },
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    handleAdd() {
      this.resetForm()
      this.dialog = {
        title: '新增广告',
        visible: true
      }
    },
    handleUpdate(row) {
      this.resetForm()
      this.dialog = {
        title: '修改广告',
        visible: true
      }
      const id = row.id || this.ids
      detail(id).then(response => {
        const {data} = response
        this.form = data
        if (data.authorizedGrantTypes) {
          this.form.authorizedGrantTypes = data.authorizedGrantTypes.split(',')
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
    resetForm() {
      this.form = {
        id: undefined,
        name: undefined,
        pic: undefined,
        startTime: undefined,
        endTime: undefined,
        status: 1,
        sort: undefined,
        url: undefined,
        remark: undefined
      }
      if (this.$refs['form']) {
        this.$refs['form'].resetFields()
      }
    },
    // 状态翻译
    statusFormat(row) {
      return row.status == 1 ? '开启' : '关闭'
    }
  }
}
</script>
