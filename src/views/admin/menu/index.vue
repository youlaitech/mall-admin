<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col :sm="16" :xs="24">
        <menu-manage></menu-manage>
      </el-col>
      <el-col :sm="8" :xs="24">
        <el-card class="box-card">
          <div class="clearfix" slot="header">
            <span>资源权限</span>
          </div>
          <permission></permission>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import MenuManage from './components/Menu'
import Permission from './components/Permission'

export default {
  name: "index",
  components: {MenuManage, Permission}
}
</script>

<style scoped>

</style>
