<template>
  <div>
    <el-card class="card">
      <div class="custom-tree-container">
        <div class="block">
          <el-tree
            :data="list"
            :props="{ label: 'name', children: 'children' }"
            :expand-on-click-node="false"
            default-expand-all>
            <span slot-scope="{ node, data }" class="custom-tree-node">
              <div class="title-size">
                <el-image v-show="data.level === 2" :src="data.icon" class="c-img"/>
                {{ data.name }}
                <el-tag v-show="data.id !== 0"
                        :type="data.level === 0 ? 'danger' : (data.level === 1 ? 'warning' : 'success')">
                  {{ data.level === 0 ? '一级' : (data.level === 1 ? '二级' : '三级') }}
                </el-tag>
              </div>

              <span>
                <el-button
                  v-show="data.level !== 2 "
                  type="primary"
                  size="mini"
                  round
                  @click="handleAdd(data)">
                  添加
                </el-button>
                <el-button
                  v-show="data.id !== 0"
                  type="warning"
                  size="mini"
                  round
                  @click="handleUpdate(data)">
                  编辑
                </el-button>
                <el-button
                  v-show="!data.children || data.children.length <= 0"
                  type="danger"
                  size="mini"
                  round
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
      center
      top="5vh"
      width="40%">
      <el-form id="form" label-width="120px" :model="form" :rules="rules" ref="form">
        <el-form-item label="类目名称" prop="name">
          <el-input v-model="form.name"/>
        </el-form-item>
        <el-form-item label="类目图标" prop="icon">
          <single-upload v-model="form.logo"></single-upload>
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
import SingleUpload from '@/components/Upload/SingleUpload'

const categoryLevelMap = [{text: '一级类目', value: 0}, {text: '二级类目', value: 1}, {text: '三级类目', value: 2}]
export default {
  components: {SingleUpload},
  filters: {
    categoryLevelFilter(code) {
      if (code >= 0 && code < 3) {
        return categoryLevelMap[code].text
      }
      return '错误级别'
    }
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      list:[],
      categoryLevelMap,
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
      rules: {
        name: [{
          required: true, message: '请输入品牌名称', trigger: 'blur'
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
        console.log("sssss", response.data)

        this.list = [{
          name: '全部类目',
          id: 0,
          children: response.data
        }]
      })
    },

    resetForm() {
      this.form = {
        id: undefined,
        name: undefined,
        parentId: undefined,
        level: undefined,
        icon: undefined,
        status: 1,
        sort: undefined
      }
    },
    handleAdd() {
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
  font-size: 18px;
  padding: 8px;
}
.title-size {
  padding: 5px 0;
}
.card {
  margin: 10px;
}
.el-tree-node__content {
  height: 40px;
}
.c-img {
  width: 30px;
  height: 30px;
}
</style>
