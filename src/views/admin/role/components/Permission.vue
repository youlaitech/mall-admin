<template>
  <div class="perm-container">
    <el-card class="box-card" shadow="always">
      <div class="clearfix" slot="header">
        <b>
          <svg-icon icon-class="menu"/>
          {{menuTitle}}{{title}}分配
        </b>
      </div>
      <el-row style="margin-bottom: 10px">
        <el-col :span="12">
          <el-tag v-if="role" type="primary">{{role.name}}</el-tag>
          <el-tag v-else type="info"><i class="el-icon-info"> </i> 请选择角色</el-tag>
        </el-col>
        <el-col :span="12" style="text-align: right">
          <el-button type="primary" icon="el-icon-check" size="mini" @click="handleSubmit">提交</el-button>
        </el-col>
      </el-row>

      <!-- 数据表格 -->
      <el-table v-loading="loading"
                :data="pageList"
                border
                @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column label="权限名称" prop="name" width="80"/>
        <el-table-column label="权限标识" prop="permission"/>
      </el-table>

      <pagination
        v-show="pagination.total>0"
        :total="pagination.total"
        :page.sync="pagination.page"
        :limit.sync="pagination.limit"
        @pagination="handleQuery"
      />

    </el-card>
  </div>
</template>

<script>

  import {list} from '@/api/admin/permission'
  import {rolePermissionIds} from '@/api/admin/role'

  export default {
    name: "Permission",
    props: ['type'],
    data() {
      return {
        loading: false,
        ids: [],
        menu: undefined,
        menuTitle: undefined,
        pageList: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0
        },
        title: this.type == 1 ? '路由权限' : '按钮权限',
        role:undefined
      }
    },
    methods: {
      handleQuery() {
        this.loading = true
        const that = this
        list({
          page: this.pagination.page,
          limit: this.pagination.limit,
          queryMode: 'page',
          menuId: this.menu.id,
          type: this.type
        }).then(response => {
          that.pageList = response.data
          that.pagination.total = response.total
          // 选中角色拥有的权限
          rolePermissionIds(that.role.id, {type: that.type}).then(permissionIds => {

          })
          this.loading = false
        })
      },
      menuClick(menu, role) {
        if (menu) {
          this.menu = menu
          this.menuTitle = '【' + menu.label + '】'
          this.handleQuery()
        }
        this.role = role
      },
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
      },
      handleSubmit() {

      }
    }
  }
</script>

<style scoped>

  .perm-container {
    margin-bottom: 20px;
  }

</style>
