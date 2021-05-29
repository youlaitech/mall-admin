<template>
  <div class="perm-container">
    <el-card class="box-card" shadow="always">
      <div class="clearfix" slot="header">
        <b>
          <svg-icon icon-class="menu"/>
          {{(menu&&menu.label)?('【'+menu.label+'】'):''}}{{title}}分配
        </b>
      </div>
      <el-row style="margin-bottom: 10px">
        <el-col :span="18">
          <el-tag v-if="role" type="primary">{{ role.name }}</el-tag>
          <el-tag v-if="menu" type="success" style="margin-left: 5px">{{ menu.label }}</el-tag>
          <el-tag v-if="!role" type="info" style="margin-left: 5px"><i class="el-icon-info"> </i> 请选择角色</el-tag>
          <el-tag v-if="!menu" type="info" style="margin-left: 5px"><i class="el-icon-info"> </i> 请选择菜单</el-tag>

        </el-col>
        <el-col :span="6" style="text-align: right">
          <el-button type="primary" icon="el-icon-check" size="mini" @click="handleSubmit">提交</el-button>
        </el-col>
      </el-row>

      <!-- 数据表格 -->
      <el-table
        ref="multipleTable"
        v-loading="loading"
        :data="pageList"
        border
      >
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column label="权限名称" prop="name" width="130"/>
        <el-table-column label="权限标识" prop="perm"/>
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
import {rolePermissionIds, updateRolePermissionIds} from '@/api/admin/role'

export default {
  name: "Permission",
  props: ['type'],
  data() {
    return {
      loading: false,
      ids: [],
      pageList: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0
      },
      initialCheckedPermissionIds: [],
      title: this.type == 1 ? '接口权限' : '按钮权限',
      menu: undefined,
      role: undefined,
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
        moduleId: this.menu.id,
        type: this.type
      }).then(response => {
        that.pageList = response.data
        that.pagination.total = response.total
        // 勾选角色已有的权限
        rolePermissionIds(that.role.id, {type: that.type}).then(res => {
          this.initialCheckedPermissionIds = res.data
          if (this.initialCheckedPermissionIds) {
            that.pageList.forEach(row => {
              if (this.initialCheckedPermissionIds.indexOf(row.id) != -1) {
                this.$refs.multipleTable.toggleRowSelection(row, true)
              }
            })
          }
          this.loading = false
        })
      })
    },
    menuClick(menu, role) {
      if (menu) {
        this.menu = menu
        this.handleQuery()
      } else {
        this.pageList = []
        this.pagination = {
          page: 1,
          limit: 10,
          total: 0
        }
        this.initialCheckedPermissionIds = []
      }
      this.role = role
    },
    handleSubmit: function () {
      const checkedPermissionIds = this.$refs.multipleTable.selection.map(item => item.id)
      // 判断选中权限是否变动
      if (this.initialCheckedPermissionIds.length == checkedPermissionIds.length &&
        this.initialCheckedPermissionIds.sort().every(function (v, i) {
          return v == checkedPermissionIds[i]
        })) {
        this.$message.warning('数据未变动，无需提交保存')
        return
      }

      updateRolePermissionIds(this.menu.id,this.role.id, this.type, checkedPermissionIds).then(response => {
        this.$message.success('提交成功')
      })
    }
  }
}
</script>

<style scoped>

.perm-container {
  margin-bottom: 20px;
}

</style>
