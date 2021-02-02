<template>
  <div>
    <el-card class="box-card" shadow="always">
      <div class="clearfix" slot="header">
        <b>
          <svg-icon icon-class="menu"/>
          菜单分配</b>
      </div>
      <el-row style="text-align: right">
        <el-button type="primary" icon="el-icon-check" size="mini" @click="handleSubmit">提交</el-button>
      </el-row>

      <el-row>
        <el-tree
          ref="menu"
          :check-strictly="true"
          :default-expanded-keys="expandedKeys"
          :data="menuOptions"
          show-checkbox
          node-key="id"
          empty-text="加载中，请稍后"
        />
      </el-row>

    </el-card>
  </div>
</template>

<script>
  import {list as menuList} from "@/api/admin/menu";

  export default {
    name: "Menu",
    data() {
      return {
        menuOptions: [],
        expandedKeys: []
      }
    },
    created() {
      this.loadMenus()
    },
    methods: {
      loadMenus() {
        menuList({queryMode: 'treeselect'}).then(response => {
          this.menuOptions = response.data
          this.expandedKeys = this.menuOptions.map(node => node.id)
          console.log('ex', this.expandedKeys)

        })
      },
      handleSubmit() {

      }
    }
  }
</script>

<style scoped>

</style>
