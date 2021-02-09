<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col :sm="14" :xs="24">
        <menus @menuClick="menuClick" @resetPermission="resetPermission"></menus>
      </el-col>
      <el-col :sm="10" :xs="24">
        <permission ref="routePermission" type="1"></permission>
        <permission ref="buttonPermission" type="2"></permission>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import Menus from './components/Menu'
  import Permission from './components/Permission'

  export default {
    name: "index",
    components: {Menus, Permission},
    data() {
      return {

      }
    },
    methods: {
      menuClick(row) {
        this.$refs.routePermission.menuClick(row)
        this.$refs.buttonPermission.menuClick(row)
      },
      resetPermission() {
        this.menuName = undefined
        this.$refs.routePermission.resetPermission()
        this.$refs.buttonPermission.resetPermission()
      }
    }
  }
</script>

<style scoped>
  .box-card {
    margin-bottom: 20px;
  }
</style>

