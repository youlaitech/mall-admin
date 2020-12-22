<template>
  <div class="app-container">
    <el-card>
      <div class="custom-tree-container">
        <div class="block">
          <el-tree
            v-loading="loading"
            ref="category"
            :data="list"
            :props="{ label: 'name', children: 'children' }"
            node-key="id"
            :expand-on-click-node="false"
            default-expand-all>
            <span slot-scope="{ node, data }" class="custom-tree-node">
              <span>
                <el-image style="width: 30px; height: 30px;vertical-align: middle"
                          v-show="data.level == 2"
                          :src="data.iconUrl"/>
                {{ data.name }}
                <el-link
                  v-show="data.children.length==0"
                  style="margin-left:5px"
                  type="primary"
                  @click="showAttrDialog(data)">
                  属性
                </el-link>

                <el-link
                  v-show="data.children.length==0"
                  style="margin-left:5px"
                  type="primary"
                  @click="showSpecDialog(data)">
                  规格
                </el-link>
              </span>
              <span>
                <el-button
                  v-show="data.level != 2 "
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
                  v-show="data.id && (!data.children || data.children.length <= 0)"
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
      @close="closeDialog"
      top="5vh"
      width="600px">
      <el-form id="form" label-width="120px" :model="form" :rules="rules" ref="form">
        <el-form-item label="上级类目">
          <el-input v-model="parent.name" style="width: 220px" readonly/>
        </el-form-item>
        <el-form-item label="类目名称" prop="name">
          <el-input v-model="form.name" style="width: 220px"/>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="form.sort" style="width: 220px"></el-input>
        </el-form-item>
        <el-form-item label="类目图标" prop="icon">
          <single-upload v-model="form.iconUrl"></single-upload>
        </el-form-item>
        <el-form-item label="是否显示" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :title="attrDialog.title"
      :visible.sync="attrDialog.visible"
      @close="closeAttrDialog"
      top="5vh"
      width="600px">
      <el-button style="float: right" type="text" @click="handleAttrAdd">添加属性</el-button>
      <el-divider></el-divider>
      <el-form id="attrForm" label-width="80px" :model="attrForm" ref="attrForm">
        <el-form-item
          v-for="(item, index) in attrForm.attributes"
          :label="'属性' + (index+1)"
          :prop="'attributes.' + index + '.name'"
          :rules="rules.attribute.name">
          <el-input v-model="item.name" style="width:400px"></el-input>
          <el-button type="danger" icon="el-icon-delete" circle size="mini" @click.prevent="removeAttr(index)"
                     style="margin-left: 5px"></el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeAttrDialog">取 消</el-button>
        <el-button type="primary" @click="handleAttrSubmit">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :title="specDialog.title"
      :visible.sync="specDialog.visible"
      @close="closeSpecDialog"
      top="5vh"
      width="600px">
      <el-button style="float: right" type="text" @click="handleSpecAdd">添加规格</el-button>
      <el-divider></el-divider>
      <el-form id="specForm" label-width="80px" :model="specForm" ref="specForm">
        <el-form-item
          v-for="(item, index) in specForm.specifications"
          :label="'规格' + (index+1)"
          :prop="'specifications.' + index + '.name'"
          :rules="rules.specification.name">
          <el-input v-model="item.name" style="width:400px"></el-input>
          <el-button type="danger" icon="el-icon-delete" circle size="mini" @click.prevent="removeSpec(index)"
                     style="margin-left: 5px"></el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeSpecDialog">取 消</el-button>
        <el-button type="primary" @click="handleSpecSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    list,
    detail,
    update,
    add,
    del,
    attrCategoryList,
    saveAttrCategoryBatch,
    specCategoryList,
    saveSpecCategoryBatch
  } from '@/api/pms/category'
  import SingleUpload from '@/components/Upload/SingleUpload'

  export default {
    components: {SingleUpload},
    data() {
      return {
        // 遮罩层
        loading: true,
        list: [],
        dialog: {
          visible: false,
        },
        attrDialog: {
          title: undefined,
          visible: false
        },
        specDialog: {
          title: undefined,
          visible: false
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
        attrForm: {
          attributes: [{
            id: undefined,
            categoryId: undefined,
            name: undefined
          }]
        },
        specForm: {
          specifications: [{
            id: undefined,
            categoryId: undefined,
            name: undefined
          }]
        },
        current: {}, // 记录当前行
        parent: {}, // 记录上级行
        rules: {
          name: [{
            required: true, message: '请输入类目名称', trigger: 'blur'
          }],
          attribute: {
            name: [{
              required: true, message: '请输入属性名称'
            }]
          },
          specification: {
            name: [{
              required: true, message: '请输入规格名称'
            }]
          }
        },
        queryParams: {
          queryMode: 'tree'
        }
      }
    },
    created() {
      this.handleQuery()
    },
    methods: {
      handleQuery() {
        list(this.queryParams).then(response => {
          this.list = [{
            id: 0,
            name: '全部类目',
            children: response.data
          }]
          this.loading = false
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
      handleAdd(row) {
        this.parent = row
        if (!this.parent.children) {
          this.parent.children = []
        }
        this.form.parentId = row.id
        if (this.form.parentId == 0) {
          this.form.level = 0
        } else {
          this.form.level = row.level + 1
        }
        this.dialog = {
          title: "新增类目",
          visible: true
        }
      },
      handleUpdate(row) {
        const parentNode = this.$refs.category.getNode(row.parentId)
        this.parent = {
          id: parentNode.key,
          name: parentNode.label
        }
        this.current = row
        this.dialog = {
          title: "修改类目",
          visible: true
        }
        const id = row.id || this.ids
        detail(id).then(response => {
          this.form = response.data
        })
      },
      handleDelete(node, row) {
        this.$confirm('确认删除已选中的数据项？', "警告", {
          confirmButtonText: "确定",
          closeButtonText: "取消",
          type: "warning"
        }).then(() => {
            del(row.id).then(() => {
              this.$message.success("删除成功")
              const parent = node.parent;
              const children = parent.data.children || parent.data;
              const index = children.findIndex(d => d.id === row.id);
              children.splice(index, 1);
              this.$forceUpdate()
            })
          }
        )
      },
      handleSubmit() {
        this.$refs["form"].validate((valid) => {
          if (valid) {
            const id = this.form.id
            if (id != undefined) {
              update(id, this.form).then(response => {
                const {name, iconUrl} = response.data
                this.current.iconUrl = iconUrl
                this.current.name = name
                this.$message.success("修改成功")
                this.closeDialog()
              })
            } else {
              add(this.form).then(response => {
                this.parent.children.push(response.data)
                this.$message.success("新增成功")
                this.closeDialog()
              })
            }
          }
        })
      },
      closeDialog() {
        this.resetForm()
        this.dialog = {
          title: undefined,
          visible: false
        }
      },
      showAttrDialog(row) {
        this.current = row
        this.attrDialog.title = '【' + this.current.name + '】属性'
        this.attrDialog.visible = true

        attrCategoryList({categoryId: row.id}).then(response => {
          if (response.data) {
            this.attrForm.attributes = response.data
          }
        })
      },
      closeAttrDialog() {
        this.attrDialog = {
          title: undefined,
          visible: false
        }
        this.resetAttrForm()
      },
      resetAttrForm() {
        this.attrForm.attributes = [{
          id: undefined,
          categoryId: undefined,
          name: undefined
        }]
      },
      removeAttr(index) {
        this.attrForm.attributes.splice(index, 1)
      },
      showSpecDialog(row) {
        this.current = row
        this.specDialog = {
          title: '【' + row.name + '】规格',
          visible: true
        }
        specCategoryList({categoryId: row.id}).then(response => {
          if (response.data) {
            this.specForm.specifications = response.data
          }
        })
      },
      closeSpecDialog() {
        this.specDialog = {
          title: undefined,
          visible: false
        }
        this.resetSpecForm()
      },
      resetSpecForm() {
        this.specForm.specifications = [{
          id: undefined,
          categoryId: undefined,
          name: undefined
        }]
      },
      removeSpec(index) {
        this.specForm.specifications.splice(index, 1)
      },
      handleAttrAdd() {
        this.attrForm.attributes.push({categoryId: this.current.id, name: undefined})
      },

      handleSpecAdd() {
        this.specForm.specifications.push({categoryId: this.current.id, name: undefined})
      },
      handleAttrSubmit() {
        this.$refs["attrForm"].validate((valid) => {
          if (valid) {
            saveAttrCategoryBatch(this.attrForm.attributes).then(response => {
              this.$message.success("提交成功")
              this.closeAttrDialog()
            })
          }
        })
      },
      handleSpecSubmit() {
        this.$refs["specForm"].validate((valid) => {
          if (valid) {
            saveSpecCategoryBatch(this.specForm.specifications).then(response => {
              this.$message.success("提交成功")
              this.closeSpecDialog()
            })
          }
        })
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

  .el-divider--horizontal {
    margin: 30px 0 15px;
  }


</style>
