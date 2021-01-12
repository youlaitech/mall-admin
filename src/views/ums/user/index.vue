<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryParams" :inline="true">
      <el-form-item>
        <el-button type="danger" icon="el-icon-delete" :disabled="multiple" @click="handleDelete">删除</el-button>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="queryParams.nickname"
          placeholder="会员昵称"
          clearable
          @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="handleResetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" :data="pageList" border @selection-change="handleSelectionChange">
      <el-table-column type="selection" min-width="5" align="center"/>
      <el-table-column type="expand" width="100" label="会员地址">
        <template slot-scope="props">
          <el-table
            :data="props.row.addressList"
            size="small"
            border>
            <el-table-column type="index" label="序号" width="80" align="center"/>
            <el-table-column align="center" label="收货人" prop="receiverName"/>
            <el-table-column align="center" label="联系方式" prop="receiverMobile"/>
            <el-table-column align="center" label="收货地址" >
              <template slot-scope="scope">
                {{scope.row.province + scope.row.city + scope.row.area + scope.row.addressDetail }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="邮编" prop="zipCode"/>
            <el-table-column align="center" label="是否默认">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.defaulted==1" type="success">是</el-tag>
                <el-tag v-if="scope.row.defaulted==0" type="info">否</el-tag>
              </template>
            </el-table-column>

           <!-- <el-table-column label="操作" align="center" min-width="10" class-name="small-padding fixed-width">
              <template slot-scope="scope">

                <el-button
                  type="text"
                  size="mini"
                  @click="handleAddressEdit(scope.row)">编辑
                </el-button>

                <el-button
                  type="text"
                  icon="el-icon-delete"
                  @click="handleAddressDelete(scope.row)">
                  删除
                </el-button>
              </template>
            </el-table-column>-->

          </el-table>
        </template>
      </el-table-column>

      <el-table-column type="index" label="序号" width="80" align="center"/>
      <el-table-column prop="nickname" label="昵称" min-width="10"/>
      <el-table-column label="性别" min-width="10">
        <template slot-scope="scope">
          <span v-if="scope.row.gender===0">未知</span>
          <span v-if="scope.row.gender===1">男</span>
          <span v-if="scope.row.gender===2">女</span>
        </template>
      </el-table-column>
      <el-table-column label="头像" min-width="10">
        <template slot-scope="scope">
          <el-popover
            placement="right"
            trigger="hover">
            <img :src="scope.row.avatar"/>
            <img slot="reference" :src="scope.row.avatar" :alt="scope.row.avatar"
                 style="max-height: 60px;max-width: 60px">
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="mobile" label="手机号码" min-width="10"/>
      <el-table-column prop="birthday" label="出生日期" min-width="10"/>
      <!--<el-table-column prop="point" label="会员积分" min-width="6"/>-->
      <el-table-column prop="status" label="状态" min-width="6">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="1"
            :inactive-value="0"
            active-color="#13ce66"
            inactive-color="#cccccc"
            @change="handleStatusChange(scope.row)"
          />
        </template>
      </el-table-column>

      <el-table-column prop="gmtCreate" label="注册时间" min-width="15"/>
      <el-table-column label="操作" align="center" min-width="10" class-name="small-padding fixed-width">
        <template slot-scope="scope">


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
      :page.sync="pagination.page"
      :limit.sync="pagination.limit"
      @pagination="handleQuery"/>

  </div>
</template>

<script>
  import {list, patch} from '@/api/ums/user'

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
          queryMode: 'page',
          nickname: undefined
        },
        pagination: {
          page: 1,
          limit: 10,
          total: 0
        },
        pageList: []
      }
    },
    async created() {
      this.handleQuery()
    },
    methods: {
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
          queryMode: 'page',
          nickname: undefined
        }
        this.handleQuery()
      },
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.single = selection.length != 1
        this.multiple = !selection.length
      },
      handleDelete(row) {
        const ids = row.id || this.ids.join(',')
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
      // 会员状态修改
      handleStatusChange(row) {
        const text = row.status === 1 ? '激活' : '禁用'
        this.$confirm('确认要' + text + row.nickname + '吗?', '警告', {
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


      handleAddressEdit(){

      },
      handleAddressDelete(){

      }
    }
  }
</script>
