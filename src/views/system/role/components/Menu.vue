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
          <el-tag v-if="role&&role.name" type="primary">{{ role.name }}</el-tag>
          <el-tag v-else type="info"><i class="el-icon-info"></i> 请选择角色</el-tag>
        </el-col>
        <el-col :span="12" style="text-align: right">
          <el-button :disabled="isRoot" type="primary" icon="el-icon-check" size="mini" @click="handleSubmit">提交
          </el-button>
        </el-col>
      </el-row>

      <el-row style="margin-top: 10px">
        <el-tree
          ref="menu"
          :default-expanded-keys="expandedKeys"
          :data="menuOptions"
          show-checkbox
          node-key="value"
          empty-text="加载中，请稍后"
          :check-strictly="checkStrictly"
          highlight-current>
            <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <span>
              <el-button
                type="text"
                size="mini"
                @click.stop="() => showPermSettingDialog(data)">
                <el-button type="text"> 权限设置</el-button>
              </el-button>
            </span>
          </span>
        </el-tree>
      </el-row>
    </el-card>

    <el-dialog
      :title="dialog.title"
      :visible.sync="dialog.visible"
      width="700px">
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="120px">

        <div v-if="permissionList.length > 0">
          <el-checkbox
            :indeterminate="isIndeterminate"
            v-model="checkAll"
            @change="handlePermissionCheckAll"
            style="margin-top: 20px"
          >全选
          </el-checkbox>
          <el-row>
            <el-col
              :span="8"
              v-for="permission in permissionList"
              style="margin-top: 20px">
              <el-checkbox
                border
                v-model="permission.checked"
                :label="permission.id"
                :key="permission.id"
                @change="handlePermissionCheck"
                size="mini">
                {{ permission.name }}
              </el-checkbox>
            </el-col>
          </el-row>
        </div>
        <el-empty v-else description="暂无数据，您可在【菜单管理】配置权限数据">

        </el-empty>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handlePermissionSubmit">确 定</el-button>
        <el-button @click="closeDialog">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {getMenuSelectList} from "@/api/system/menu";
import {listRoleMenu, listRolePermission, updateRoleMenu, updateRolePermission} from "@/api/system/role"
import {getPermissionList} from "@/api/system/permission";

export default {
  name: "Menu",
  data() {
    return {
      menuOptions: [],
      expandedKeys: [],
      role: {},
      initialCheckedMenuIds: [],  //初始选中值
      isRoot: false, // 是否是超级管理员账户
      checkStrictly: false,
      dialog: {
        title: '权限设置',
        visible: false
      },
      form: {},
      rules: {},
      permissionList: [],
      isIndeterminate: true,
      checkAll: false,
      menuId:undefined

    }
  },
  created() {
    this.loadData()
  },
  methods: {
    loadData() {
      getMenuSelectList().then(response => {
        this.menuOptions = response.data
        this.expandedKeys = this.menuOptions.map(node => node.id) //展开所有节点
      })
    },
    handleMenuNodeClick(data) {
      this.$emit("menuClick", data)
    },
    handleSubmit() {
      const checkedMenuIds = this.$refs.menu.getCheckedNodes(false, true).map(node => node.value)
      // 判断选中菜单ID是否变动
      if (this.initialCheckedMenuIds.length == checkedMenuIds.length &&
        this.initialCheckedMenuIds.sort().every(function (v, i) {
          return v == checkedMenuIds[i]
        })) {
        this.$message.warning('数据未变动')
        return
      }
      updateRoleMenu(this.role.id, checkedMenuIds).then(() => {
        this.$message.success('提交成功')
      })
    },
    roleClick(role) {
      this.role = role
      this.$refs.menu.setCurrentKey(null) // 取消菜单高亮
      if (role.code == this.ROOT_ROLE_CODE) {  // 如果是超级管理员默认勾选全部且不可编辑
        this.isRoot = true
        this.$refs.menu.setCheckedNodes(this.menuOptions);
      } else {
        this.isRoot = false
        this.checkStrictly = true
        listRoleMenu(role.id).then(response => {
          this.initialCheckedMenuIds = response.data
          this.$refs.menu.setCheckedKeys(this.initialCheckedMenuIds)
          this.checkStrictly = false
        })
      }
    },
    /**
     * 打开权限设置弹窗
     */
    showPermSettingDialog(data) {
      this.menuId = data.value
      this.dialog.visible = true
      getPermissionList({
        menuId: this.menuId
      }).then((response) => {
        const {data} = response;
        if (this.role.code == this.ROOT_ROLE_CODE) {
          // 如果是超级管理员默认勾选全部且不可编辑
          this.isRoot = true;
          data.map((item) => this.$set(item, "checked", true));
          this.permissionList = data;
          this.loading = false;
        } else {
          this.isRoot = false;
          listRolePermission(this.role.id, {menuId: this.menuId}).then((res) => {
            this.initialCheckedPermissionIds = res.data;
            data.map((item) => {
              if (this.initialCheckedPermissionIds.includes(item.id)) {
                item.checked = true;
              }
            });
            this.permissionList = data;
            this.loading = false;
          });
        }
      });
    },
    closeDialog() {
      this.dialog.visible = false
    },
    handlePermissionCheckAll(checked) {
      if (checked) {
        this.permissionList.map((item) => (item.checked = true));
      } else {
        // 全不选
        this.permissionList.map((item) => (item.checked = false));
      }
      this.isIndeterminate = false;
    },
    handlePermissionCheck(item, val) {
      const checkedCount = this.permissionList.filter(
        (item) => item.checked
      ).length;
      this.checkAll = checkedCount === this.permissionList.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.permissionList.length;
    },
    handlePermissionSubmit(){
      const checkedPermissionIds = this.permissionList
        .filter((item) => item.checked)
        .map((item) => item.id);
      // 判断选中权限是否变动
      if (
        this.initialCheckedPermissionIds.length ==
        checkedPermissionIds.length &&
        this.initialCheckedPermissionIds.sort().every(function (v, i) {
          return v == checkedPermissionIds[i];
        })
      ) {
        this.$message.warning("数据未变动");
        return;
      }
      updateRolePermission(
        this.menuId,
        this.role.id,
        checkedPermissionIds
      ).then(() => {
        this.$message.success("提交成功");
        this.closeDialog()
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
