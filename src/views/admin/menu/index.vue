<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col :sm="15" :xs="24">
        <menus @menuClick="menuClick" @resetPermission="resetPermission"></menus>
      </el-col>
      <el-col :sm="9" :xs="24">
        <permission ref="routingPermission" type="1"></permission>
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
        this.$refs.routingPermission.menuClick(row, 1)
        this.$refs.buttonPermission.menuClick(row, 2)
      },
      resetPermission() {
        this.menuName = undefined
        this.$refs.routingPermission.resetPermission()
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

