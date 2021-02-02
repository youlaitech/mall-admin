<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col :sm="15" :xs="24">
        <menus @menuClick="menuClick" @resetPermission="resetPermission"></menus>
      </el-col>
      <el-col :sm="9" :xs="24">
        <el-card class="box-card" shadow="always">
          <div class="clearfix" slot="header">
            <b><svg-icon icon-class="route" /> {{ menuName }}路由权限</b>
          </div>
          <permission ref="routingPermission"></permission>
        </el-card>

        <el-card class="box-card" shadow="always">
          <div class="clearfix" slot="header">
            <b><svg-icon icon-class="button" /> {{ menuName }}按钮权限</b>
          </div>
          <permission ref="buttonPermission"></permission>
        </el-card>
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
        menuName: undefined
      }
    },
    methods: {
      menuClick(row) {
        this.menuName = '【' + row.name + '】'
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

