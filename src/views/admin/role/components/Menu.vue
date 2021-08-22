<template>
  <div>
    <el-card class="box-card" shadow="always">
      <div class="clearfix" slot="header">
        <b>
          <svg-icon icon-class="menu"/>
          菜单分配</b>
      </div>
      <el-row>
        <el-col :span="12">
          <el-tag v-if="role&&role.name" type="primary">{{ role.name }}</el-tag>
          <el-tag v-else type="info"><i class="el-icon-info"></i> 请选择角色</el-tag>
        </el-col>
        <el-col :span="12" style="text-align: right">
          <el-button :disabled="isRoot" type="primary" icon="el-icon-check" size="mini" @click="handleSubmit">提交
          </el-button>
        </el-col>
      </el-row>

      <el-row style="margin-top: 10px">
        <el-tree
          ref="menu"
          :default-expanded-keys="expandedKeys"
          :data="menuOptions"
          show-checkbox
          node-key="id"
          empty-text="加载中，请稍后"
          :check-strictly="checkStrictly"
          highlight-current
          @node-click="handleMenuNodeClick"
        />
      </el-row>

    </el-card>
  </div>
</template>

<script>
import {getMenuSelectList} from "@/api/admin/menu";
import {listRoleMenu, updateRoleMenu} from "@/api/admin/role"

export default {
  name: "Menu",
  data() {
    return {
      menuOptions: [],
      expandedKeys: [],
      role: {},
      initialCheckedMenuIds: [],  //初始选中值
      isRoot: false, // 是否是超级管理员账户
      checkStrictly: false
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    loadData() {
      getMenuSelectList().then(response => {
        this.menuOptions = response.data
        this.expandedKeys = this.menuOptions.map(node => node.id) //展开所有节点
      })
    },
    handleMenuNodeClick(data) {
      this.$emit("menuClick", data)
    },
    handleSubmit() {
      const checkedMenuIds = this.$refs.menu.getCheckedNodes(false, true).map(node => node.id)
      // 判断选中菜单ID是否变动
      if (this.initialCheckedMenuIds.length == checkedMenuIds.length &&
        this.initialCheckedMenuIds.sort().every(function (v, i) {
          return v == checkedMenuIds[i]
        })) {
        this.$message.warning('数据未变动')
        return
      }
      updateRoleMenu(this.role.id, checkedMenuIds).then(() => {
        this.$message.success('提交成功')
      })
    },
    roleClick(role) {
      this.role = role
      this.$refs.menu.setCurrentKey(null) // 取消菜单高亮
      if (role.code == this.ROOT_ROLE_CODE) {  // 如果是超级管理员默认勾选全部且不可编辑
        this.isRoot = true
        this.$refs.menu.setCheckedNodes(this.menuOptions);
      } else {
        this.isRoot = false
        this.checkStrictly = true
        listRoleMenu(role.id).then(response => {
          this.initialCheckedMenuIds = response.data
          this.$refs.menu.setCheckedKeys(this.initialCheckedMenuIds)
          this.checkStrictly = false
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
