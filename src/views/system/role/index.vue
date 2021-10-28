<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col :span="12" :xs="24">
        <role ref="role" @roleClick="roleClick"></role>
      </el-col>
      <el-col :span="12" :xs="24">
        <menus ref="menu" @menuClick="menuClick"></menus>
      </el-col>
    </el-row>
  </div>

</template>

<script>
import Role from './components/Role'
import Menus from './components/Menu'

export default {
  name: "index",
  components: { Role, Menus},
  data() {
    return {
      role: undefined,
      menu: undefined
    }
  },
  methods: {
    roleClick(role) {
      this.role = role
      this.menu = undefined
      this.$refs.menu.roleClick(role)
    },
    menuClick(menu) {
      if (!this.role) {
        this.$message.warning('请选择角色')
        return
      }
      this.menu = menu
    }
  }
}
</script>

<style scoped>

</style>
