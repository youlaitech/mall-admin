<template>
  <div>
    <el-card class="box-card" shadow="always">
      <div class="clearfix" slot="header">
        <b>
          <svg-icon icon-class="menu"/>
          菜单分配</b>
      </div>
      <el-row>
        <el-col :span="12">
          <el-tag v-if="role&&role.name" type="primary">{{role.name}}</el-tag>
          <el-tag v-else type="info"><i class="el-icon-info"></i> 请选择角色</el-tag>
        </el-col>
        <el-col :span="12" style="text-align: right">
          <el-button type="primary"  icon="el-icon-check" size="mini" @click="handleSubmit">提交</el-button>
        </el-col>
      </el-row>

      <el-row style="margin-top: 10px">
        <el-tree
          ref="menu"
          :check-strictly="true"
          :default-expanded-keys="expandedKeys"
          :data="menuOptions"
          show-checkbox
          node-key="id"
          empty-text="加载中，请稍后"
          :highlight-current="true"
          @node-click="nodeClick"
        />
      </el-row>

    </el-card>
  </div>
</template>

<script>
  import {list as menuList} from "@/api/admin/menu";
  import {roleMenuIds} from "@/api/admin/role"

  export default {
    name: "Menu",
    data() {
      return {
        menuOptions: [],
        expandedKeys: [],
        role: undefined
      }
    },
    created() {
      this.loadMenus()
    },
    methods: {
      loadMenus() {
        menuList({queryMode: 'tree'}).then(response => {
          this.menuOptions = response.data
          this.expandedKeys = this.menuOptions.map(node => node.id) //展开所有节点

        })
      },
      nodeClick(data) {
        this.$emit("menuClick", data)
      },

      handleSubmit() {

      },
      roleClick(role) {
        this.role = role
        roleMenuIds(role.id).then(response => {
          this.$refs.menu.setCheckedKeys(response.data)
        })
      }
    }
  }
</script>

<style scoped>

</style>
