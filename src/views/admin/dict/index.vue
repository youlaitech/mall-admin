<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="9" :xs="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>字典类型</span>
          </div>
          <el-form :model="queryParamsForType" ref="queryFormForType" :inline="true" size="mini">
            <el-form-item label="字典名称" prop="name">
              <el-input
                v-model="queryParamsForType.name"
                placeholder="请输入字典名称"
                clearable
                style="width: 240px"
                @keyup.enter.native="handleQueryForType"/>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="handleQueryForType">搜索</el-button>
              <el-button icon="el-icon-refresh" @click="handleResetQueryForType">重置</el-button>
            </el-form-item>
          </el-form>
          <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
              <el-button type="primary" size="mini" icon="el-icon-plus" @click="handAddForType">新增</el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button type="success" size="mini" icon="el-icon-edit" :disabled="single_dictType"
                         @click="handleUpdate_dictType">修改
              </el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button type="danger" size="mini" icon="el-icon-delete" :disabled="single_dictType"
                         @click="handleDelete_dictType">删除
              </el-button>
            </el-col>
          </el-row>
          <el-table
            ref="table_dictType"
            v-loading="loading_dictType"
            :data="tableData_dictType"
            @row-click="rowClick_dictType">
            <el-table-column width="50" align="center">
              <template scope="scope">
                <el-radio v-model="selectedDictTypeIndex" :label="scope.$index">&nbsp;</el-radio>
              </template>
            </el-table-column>
            <el-table-column label="字典名称" prop="name" width="180"/>
            <el-table-column label="字典编码" prop="typeCode" :show-overflow-tooltip="true" width="180"/>
            <el-table-column label="状态" prop="perms" :formatter="statusFormat" width="120"/>
          </el-table>
          <pagination
            v-show="total_dictType>0"
            :total="total_dictType"
            :page.sync="queryParamsForType.pageNum"
            :limit.sync="queryParamsForType.pageSize"
            @pagination="handleQueryForType"/>

          <el-dialog :title="title_dictType" :visible.sync="visible_dictType" width="500px">
            <el-form ref="form_dictType" :model="form_dictType" :rules="rules_dictType" label-width="80px">
              <el-form-item label="字典名称" prop="name">
                <el-input v-model="form_dictType.name" placeholder="请输入字典名称"/>
              </el-form-item>
              <el-form-item label="字典编码" prop="typeCode">
                <el-input v-model="form_dictType.typeCode" placeholder="请输入字典编码"/>
              </el-form-item>
              <el-form-item label="状态" prop="status">
                <el-radio-group v-model="form_dictType.status">
                  <el-radio
                    v-for="dict in statusOptions"
                    :label="dict.dictValue"
                  >{{dict.dictLabel}}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="备注" prop="remark">
                <el-input v-model="form_dictType.remark" type="textarea" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button type="primary" @click="submitForm_dictType">确 定</el-button>
              <el-button @click="cancel_dictType">取 消</el-button>
            </div>
          </el-dialog>
        </el-card>
      </el-col>

      <!-- 字典数据 -->
      <el-col :span="15" :xs="24">
        <el-card>
          <div slot="header" class="clearfix">
            <span>字典数据</span>
          </div>
          <el-form :model="queryParams_dictData" ref="queryForm_dictData" :inline="true" size="mini">
            <el-form-item label="字典名称" prop="dictName">
              <el-input
                v-model="queryParams_dictData.name"
                placeholder="字典名称"
                clearable
                :readonly="true"/>
            </el-form-item>
            <el-form-item label="字典标签" prop="dictLabel">
              <el-input
                v-model="queryParams_dictData.dictLabel"
                placeholder="请输入字典标签"
                clearable
                @keyup.enter.native="handleQuery_dictData"/>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="handleQuery_dictData">搜索</el-button>
              <el-button icon="el-icon-refresh" @click="resetSearch_dictData">重置</el-button>
            </el-form-item>
          </el-form>
          <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
              <el-button type="primary" size="mini" icon="el-icon-plus"
                         @click="handleAdd_dictData">新增
              </el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button type="success" size="mini" icon="el-icon-edit" :disabled="single_dictData"
                         @click="handleUpdate_dictData">修改
              </el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button type="danger" size="mini" icon="el-icon-delete" :disabled="multiple_dictData"
                         @click="handleDelete_dictData">删除
              </el-button>
            </el-col>
          </el-row>
          <el-table
            ref="table_dictData"
            v-loading="loading_dictData"
            :data="tableData_dictData"
            @selection-change="handleSelectionChange_dictData"
            @row-click="rowClick_dictData">
            <el-table-column
              type="selection"
              min-width="5%"></el-table-column>
            <el-table-column label="字典标签" prop="dictLabel" width="220"/>
            <el-table-column label="字典值" prop="dictValue" :show-overflow-tooltip="true"/>
            <el-table-column label="字典编码" prop="typeCode" width="220"/>
            <el-table-column label="状态" prop="status" :formatter="statusFormat"/>
            <el-table-column label="备注" prop="remark"/>
          </el-table>
          <pagination
            v-show="total_dictData>0"
            :total="total_dictData"
            :page.sync="queryParams_dictData.pageNum"
            :limit.sync="queryParams_dictData.pageSize"
            @pagination="handleQuery_dictData"/>

          <el-dialog :title="title_dictData" :visible.sync="visible_dictData" width="500px">
            <el-form ref="form_dictData" :model="form_dictData" :rules="rules_dictData" label-width="80px">
              <el-form-item label="字典类型" prop="typeCode">
                <el-input v-model="form_dictData.typeCode" :disabled="true"/>
              </el-form-item>
              <el-form-item label="字典标签" prop="dictLabel">
                <el-input v-model="form_dictData.dictLabel" placeholder="请输入字典标签"/>
              </el-form-item>
              <el-form-item label="字典值" prop="dictValue">
                <el-input v-model="form_dictData.dictValue" placeholder="请输入字典值"/>
              </el-form-item>
              <el-form-item label="显示排序" prop="orderNum">
                <el-input-number v-model="form_dictData.orderNum" controls-position="right" :min="0"/>
              </el-form-item>
              <el-form-item label="状态" prop="status">
                <el-radio-group v-model="form_dictData.status">
                  <el-radio
                    v-for="dict in statusOptions"
                    :label="dict.dictValue"
                  >{{dict.dictLabel}}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="备注" prop="remark">
                <el-input v-model="form_dictData.remark" type="textarea" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button type="primary" @click="submitForm_dictData">确 定</el-button>
              <el-button @click="cancel_dictData">取 消</el-button>
            </div>
          </el-dialog>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {
    page as dictDataPage,
    getObj as getDictData,
    postObj as addDictData,
    putObj as updateDictData,
    delObj as deleteDictData
  } from '@/api/system/dict/data'
  import {
    page as dictTypePage,
    getObj as getDictType,
    postObj as addDictType,
    putObj as updateDictType,
    delObj as deleteDictType
  } from '@/api/system/dict/type'

  import {mapState} from 'vuex'

  export default {
    name: "index",
    data() {
      return {
        // 字典类型
        queryParamsForType: {
          pageNum: 1,
          pageSize: 10,
          name: undefined
        },
        loading_dictType: false,
        single_dictType: true,
        tableData_dictType: [],
        total_dictType: 0,
        ids_dictType: [],
        rules_dictType: {
          name: [{
            required: true, message: '请输入字典名称', trigger: 'blur'
          }],
          typeCode: [{
            required: true, message: '请输入字典编码', trigger: 'blur'
          }]
        },
        selectedDictTypeIndex: 0,
        title_dictType: "",
        form_dictType: {},
        visible_dictType: false,

        // 字典数据
        queryParams_dictData: {
          pageNum: 1,
          pageSize: 10,
          dictLabel: undefined,
          typeCode: undefined,
          name: undefined
        },
        loading_dictData: false,
        single_dictData: true,
        multiple_dictData: true,
        tableData_dictData: [],
        total_dictData: 0,
        ids_dictData: [],
        rules_dictData: {
          typeCode: [{
            required: true, message: '请输入字典编码', trigger: 'blur'
          }],
          dictLabel: [{
            required: true, message: '请输入字典标签', trigger: 'blur'
          }],
          dictValue: [{
            required: true, message: '请输入字典值', trigger: 'blur'
          }]
        },
        title_dictData: "",
        form_dictData: {},
        ids: [],
        visible_dictData: false,
      }
    },
    methods: {
      handleQueryForType() {
        this.loading_dictType = true;
        dictTypePage(this.queryParamsForType).then(res => {
          const data = res.data
          this.tableData_dictType = data.records
          this.total_dictType = data.total
          this.loading_dictType = false
          if (data.total > 0) {
            this.single_dictType = false
            this.handleQuery_dictData()
          }
        })
      },
      handleResetQueryForType() {
        this.resetForm("queryFormForType")
        this.handleQueryForType()
      },
      statusFormat(row) {
        return this.selectDictLabel(this.statusOptions, row.status);
      },
      rowClick_dictType(row) {
        this.selectedDictTypeIndex = this.tableData_dictType.indexOf(row)
        this.queryParams_dictData.typeCode = row.typeCode
        this.handleQuery_dictData()
      },
      handAddForType() {
        this.reset_dictType()
        this.visible_dictType = true
        this.title_dictType = "添加字典类型"
      },
      handleUpdate_dictType() {
        this.reset_dictType()
        const id = this.tableData_dictType[this.selectedDictTypeIndex].id
        getDictType(id).then(res => {
          this.form_dictType = res.data
          this.visible_dictType = true
          this.title_dictType = "修改字典类型"
        });
      },
      handleDelete_dictType() {
        const id = this.tableData_dictType[this.selectedDictTypeIndex].id
        this.$confirm('是否确认删除选择的字典类型?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return deleteDictType(id);
        }).then(() => {
          this.msgSuccess("删除成功");
          this.handleQueryForType()
        })
      },
      submitForm_dictType: function () {
        this.$refs["form_dictType"].validate(valid => {
          if (valid) {
            const id = this.form_dictType.id
            if (id != undefined) {
              updateDictType(id, this.form_dictType).then(() => {
                this.msgSuccess("修改成功");
                this.visible_dictType = false;
                this.handleQueryForType();
              });
            } else {
              addDictType(this.form_dictType).then(() => {
                this.msgSuccess("新增成功");
                this.visible_dictType = false;
                this.handleQueryForType();
              })
            }
          }
        });
      },
      cancel_dictType() {
        this.visible_dictType = false;
        this.reset_dictType();
      },
      reset_dictType() {
        this.form_dictType = {
          id: undefined,
          name: undefined,
          typeCode: undefined,
          remark: undefined
        }
        this.resetForm("form_dictType");
      },
      // 字典数据
      handleQuery_dictData() {
        this.loading_dictData = true;
        this.queryParams_dictData.typeCode = this.tableData_dictType[this.selectedDictTypeIndex].typeCode
        this.queryParams_dictData.name = this.tableData_dictType[this.selectedDictTypeIndex].name
        dictDataPage(this.queryParams_dictData).then(res => {
          const data = res.data
          this.tableData_dictData = data.records
          this.total_dictData = data.total
          this.loading_dictData = false
        })
      },
      resetSearch_dictData() {
        this.resetForm("queryForm_dictData")
        this.handleQuery_dictData()
      },

      handleAdd_dictData() {
        this.reset_dictData()
        this.visible_dictData = true
        this.title_dictData = "添加字典数据"
        this.form_dictData.typeCode = this.tableData_dictType[this.selectedDictTypeIndex].typeCode
      },
      handleUpdate_dictData() {
        this.reset_dictData()
        const id = this.ids
        getDictData(id).then(res => {
          this.form_dictData = res.data
          this.visible_dictData = true
          this.title_dictData = "修改字典数据"
        });
      },
      handleDelete_dictData() {
        const id = this.ids
        this.$confirm('是否确认删除选择的字典数据?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return deleteDictData(id);
        }).then(() => {
          this.msgSuccess("删除成功");
          this.handleQueryForType()
        })
      },
      submitForm_dictData: function () {
        this.$refs["form_dictData"].validate(valid => {
          if (valid) {
            const id = this.form_dictData.id
            if (id != undefined) {
              updateDictData(id, this.form_dictData).then(() => {
                this.msgSuccess("修改成功");
                this.visible_dictData = false;
                this.handleQuery_dictData();
              });
            } else {
              addDictData(this.form_dictData).then(() => {
                this.msgSuccess("新增成功");
                this.visible_dictData = false;
                this.handleQuery_dictData();
              })
            }
          }
        });
      },
      cancel_dictData() {
        this.visible_dictData = false;
        this.reset_dictData();
      },
      reset_dictData() {
        this.form_dictData = {
          id: undefined,
          typeCode: undefined,
          dictValue: undefined,
          dictLabel: undefined,
          remark: undefined,
          orderNum: 0,
          status: undefined
        }
        this.resetForm("form_dictData");
      },
      handleSelectionChange_dictData(selection) {
        this.ids = selection.map(item => item.id)
        this.single_dictData = selection.length != 1
        this.multiple_dictData = !selection.length
      },
      rowClick_dictData(row) {
        this.$refs.table_dictData.toggleRowSelection(row)
      }
    },
    computed: {
      ...mapState({
        statusOptions: state => state.dict.sys_normal_disable,
        sys_sex: state => state.dict.sys_sex
      })
    },
    mounted() {
      this.$store.dispatch("getDictDatas", ["sys_normal_disable"])
      this.handleQueryForType()
    }
  }
</script>

<style scoped>

</style>
