<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col :sm="14" :xs="24">
        <menu-manage @menuClick="menuClick"></menu-manage>
      </el-col>
      <el-col :sm="10" :xs="24">
        <el-card class="box-card">
          <div class="clearfix" slot="header">
            <span>{{ menuName }}权限设置</span>
          </div>
          <permission ref="permission"></permission>
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
  components: {MenuManage, Permission},
  data() {
    return {
      menuName: undefined
    }
  },
  methods: {
    menuClick(row) {
      this.menuName = '【' + row.name + '】'
      this.$refs.permission.menuClick(row)
    }
  }
}
</script>

<style scoped>

</style>
