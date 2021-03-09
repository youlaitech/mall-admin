<template>
  <div class="app-container">
    <!-- 搜索表单 -->
    <el-form
      ref="queryForm"
      :model="queryParams"
      size="small"
      :inline="true"
    >
      <el-form-item>
        <el-button
          :disabled="multiple"
          icon="el-icon-delete"
          type="danger"
          style="margin-left:15px"
          @click="handleDelete"
        >删除
        </el-button>
      </el-form-item>

      <el-form-item>
        <el-date-picker
          v-model="dateRange"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"/>
      </el-form-item>

      <el-form-item prop="clientIP">
        <el-input
          v-model="queryParams.clientIP"
          placeholder="客户端IP"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 数据表格 -->
    <el-table v-loading="loading"
              :data="pageList"
              border
              @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="序号" type="index" width="55" align="center"/>
      <el-table-column label="用户名" prop="username" width="100"/>
      <el-table-column label="登录时间" prop="loginTime" width="200"/>
      <el-table-column label="客户端IP" prop="clientIP" width="200"/>
      <el-table-column label="所属地区" prop="region" width="200"/>
      <el-table-column label="请求耗时(ms)" prop="elapsedTime" width="150"/>
      <el-table-column label="访问令牌" prop="token" :show-overflow-tooltip="true" />

      <el-table-column label="描述" prop="description" width="150"/>
      <el-table-column label="操作" align="center" width="250">
        <template slot-scope="scope">
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            plain
            @click.stop="handleDelete(scope.row)">
            删除
          </el-button>

          <el-button
            type="info"
            icon="el-icon-s-release"
            size="mini"
            plain
            @click.stop="handleForcedOffline(scope.row)">
            强制下线
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
  </div>
</template>

<script>
  import {list, del} from '@/api/admin/record/login'
  import {invalidToken} from "@/api/admin/token";

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
          clientIP: undefined
        },
        pagination: {
          page: 1,
          limit: 10,
          total: 0
        },
        pageList: [],
        dateRange: [],
      }
    },
    async created() {
      this.handleQuery()
    },
    methods: {
      handleQuery() {
        if (this.dateRange.length === 2) {
          this.queryParams.startDate = this.dateRange[0]
          this.queryParams.endDate = this.dateRange[1]
        }
        this.queryParams.page = this.pagination.page
        this.queryParams.limit = this.pagination.limit
        list(this.queryParams).then(response => {
          this.pageList = response.data
          this.pagination.total = response.total
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
          clientIP: undefined,
          dateRange: []
        }
        this.handleQuery()
      },
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item._id)
        this.single = selection.length != 1
        this.multiple = !selection.length
      },
      handleDelete(row) {
        const ids = [row._id || this.ids].join(',')
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
      handleForcedOffline(row) {
        const token = row.token
        this.$confirm('确认强制下线?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          invalidToken(token).then(() => {
            this.$message.success('强制下线成功')
            this.handleQuery()
          })
        }).catch(() =>
          this.$message.info('已取消强制下线')
        )
      }
    }
  }
</script>
