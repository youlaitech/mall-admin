<template>
  <div class="app-container">
    <el-card>
      <div class="custom-tree-container">
        <div class="block">
          <el-tree
            :data="list"
            :props="{ label: 'name', children: 'children' }"
            :expand-on-click-node="false"
            default-expand-all>
            <span slot-scope="{ node, data }" class="custom-tree-node">
              <span>
                <el-image style="width: 30px; height: 30px;vertical-align: middle" v-show="data.level === 2"
                          :src="data.icon"/>
                {{ data.name }}
              </span>
              <span>
                <el-button
                  v-show="data.level !== 2 "
                  type="primary"
                  size="mini"
                  round
                  plain
                  @click="handleAdd(data)">
                  添加
                </el-button>
                <el-button
                  v-show="data.id !== 0"
                  type="warning"
                  size="mini"
                  round
                  plain
                  @click="handleUpdate(data)">
                  编辑
                </el-button>
                <el-button
                  v-show="!data.children || data.children.length <= 0"
                  type="danger"
                  size="mini"
                  round
                  plain
                  @click="handleDelete(node, data)">
                  删除
                </el-button>
              </span>
            </span>
          </el-tree>
        </div>
      </div>
    </el-card>

    <el-dialog
      :title="dialog.title"
      :visible.sync="dialog.visible"
      @close="cancel"
      top="5vh"
      width="500px">
      <el-form id="form" label-width="120px" :model="form" :rules="rules" ref="form">
        <el-form-item label="上级类目">
          <el-input v-model="parentName" style="width: 220px" readonly/>
        </el-form-item>
        <el-form-item label="类目名称" prop="name">
          <el-input v-model="form.name" style="width: 220px"/>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="form.sort" style="width: 220px"></el-input>
        </el-form-item>
        <el-form-item label="类目图标" prop="icon">
          <avatar-upload v-model="form.icon"></avatar-upload>
        </el-form-item>
        <el-form-item label="是否显示" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {list, detail, update, add, del, patch} from '@/api/pms/category'
import AvatarUpload from '@/components/Upload/AvatarUpload'

export default {
  components: {AvatarUpload},
  data() {
    return {
      // 遮罩层
      loading: true,
      list: [],
      dialog: {
        title: undefined,
        visible: false,
      },
      form: {
        id: undefined,
        name: undefined,
        parentId: undefined,
        level: undefined,
        icon: undefined,
        status: 1,
        sort: undefined
      },
      parentName: undefined,
      rules: {
        name: [{
          required: true, message: '请输入类目名称', trigger: 'blur'
        }]
      },
    }
  },
  created() {
    this.handleQuery()
  },
  methods: {
    handleQuery() {
      list().then(response => {
        this.list = [{
          name: '全部类目',
          id: 0,
          children: response.data
        }]
      })
    },

    resetForm() {
      this.parentName=undefined
      this.form = {
        id: undefined,
        name: undefined,
        parentId: undefined,
        level: undefined,
        icon: '',
        status: 1,
        sort: undefined
      }
    },
    handleAdd(row) {
      this.parentName = row.name
      this.form.parentId = row.id
      if (this.form.parentId == 0) {
        this.form.level = 0
      } else {
        this.form.level = row.level++
      }
      this.dialog = {
        title: "新增类目",
        visible: true
      }
    },
    handleUpdate(row) {
      this.dialog = {
        title: "修改类目",
        visible: true
      }
      const id = row.id || this.ids
      detail(id).then(response => {
        this.form = response.data
      })
    },
    handleDelete(row) {

    },
    handleSubmit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          const id = this.form.id
          if (id != undefined) {
            update(id, this.form).then(() => {
              this.$message.success("修改成功")
              this.dialog.visible = false
              this.handleQuery()
            })
          } else {
            add(this.form).then(() => {
              this.$message.success("新增成功")
              this.dialog.visible = false
              this.handleQuery()
            })
          }
        }
      })
    },
    cancel() {
      this.resetForm()
      this.dialog = {
        title: undefined,
        visible: false
      }
    }
  }
}
</script>

<style>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

.el-tree-node__content {
  height: 40px;
}

</style>
