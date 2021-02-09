<template>

  <div class="app-container">
    <el-row :gutter="10">
      <el-col :sm="10" :xs="24">
        <role ref="role" @roleClick="roleClick"></role>
      </el-col>
      <el-col :sm="6" :xs="24">
        <menus ref="menu" @menuClick="menuClick"></menus>
      </el-col>
      <el-col :sm="8" :xs="24">
        <permission ref="routePermission" type="1"></permission>
        <permission ref="buttonPermission" type="2"></permission>
      </el-col>

    </el-row>
  </div>

</template>

<script>
  import Role from './components/Role'
  import Menus from './components/Menu'
  import Permission from './components/Permission'

  export default {
    name: "index",
    components: {Permission, Role, Menus},
    data() {
      return {
        role: undefined,
        menu: undefined
      }
    },
    methods: {
      roleClick(role) {
        this.role = role
        this.$refs.menu.roleClick(role)
        this.$refs.routePermission.menuClick(this.menu, this.role)
        this.$refs.buttonPermission.menuClick(this.menu, this.role)
      },
      menuClick(menu) {
        if (!this.role) {
          this.$message.warning('请选择角色')
          return
        }
        this.menu = menu
        this.$refs.routePermission.menuClick(menu, this.role)
        this.$refs.buttonPermission.menuClick(menu, this.role)
      }
    }
  }
</script>

<style scoped>

</style>
