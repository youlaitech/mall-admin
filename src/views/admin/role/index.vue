<template>

  <div class="app-container">
    <el-row :gutter="10">
      <el-col :sm="9" :xs="24">
        <role @roleClick="roleClick"></role>
      </el-col>
      <el-col :sm="6" :xs="24">
        <menus ref="menu"></menus>
      </el-col>
      <el-col :sm="9" :xs="24">
        <permission></permission>
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
    methods: {
      roleClick(role) {
        this.$refs.menu.roleClick(role)
      }
    }
  }
</script>

<style scoped>

</style>
