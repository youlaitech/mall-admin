<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col :span="10" :xs="24">
        <menus @menuClick="menuClick" @resetPermission="resetPermission"></menus>
      </el-col>
      <el-col :span="14" :xs="24">
        <permission ref="permission"></permission>
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
      this.$refs.permission.menuClick(row)
    },
    resetPermission() {
      this.menuName = undefined
      this.$refs.permission.resetPermission()
    }
  }
}
</script>

<style scoped>
.box-card {
  margin-bottom: 20px;
}
</style>

