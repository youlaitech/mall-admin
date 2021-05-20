<template>
  <div style="padding:30px;">
    <el-alert :closable="false" title="二级菜单">
      <router-view />
    </el-alert>
  </div>
</template>

<script>
export default {
  name: "index"
}
</script>

<style scoped>

</style>
