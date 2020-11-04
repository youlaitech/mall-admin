<template>
  <div class="app-container">
    <el-form :inline="true" ref="queryForm">
      <el-form-item>
        <el-button type="primary" @click="handleAdd">新增</el-button>
        <el-button type="success" @click="handleEdit" :disabled="single">修改</el-button>
        <el-button type="danger" @click="handleDelete" :disabled="multiple">删除</el-button>
      </el-form-item>
      <el-form-item>
        <el-input v-model="queryParams.name" placeholder="商品名称"></el-input>
      </el-form-item>

      <el-form-item>
        <el-cascader v-model="queryParams.categoryId" :options="categoryOptions"
                     expand-trigger="hover"
                     clearable
                     @change="handleCategoryChange"/>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">查询</el-button>
        <el-button icon="el-icon-refresh" @click="handleResetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table
      id="dataTable"
      ref="multipleTable"
      :data="pageList"
      @selection-change="handleSelectionChange"
      @row-click="handleRowClick"
      border>
      <el-table-column
        type="selection"
        min-width="5%">
      </el-table-column>
      <el-table-column
        prop="id"
        label="商品ID"
        min-width="50">
      </el-table-column>

      <el-table-column min-width="100" label="名称" prop="name"/>

      <el-table-column property="pic_url" label="图片">
        <template slot-scope="scope">
          <img :src="scope.row.pic_url" width="40">
        </template>
      </el-table-column>

      <el-table-column label="详情" prop="detail">
        <template slot-scope="scope">
          <el-dialog :visible.sync="detailDialogVisible" title="商品详情">
            <div class="goods-detail-box" v-html="spuDetail"/>
          </el-dialog>
          <el-button type="primary" size="mini" @click="showDetail(scope.row.detail)">查看</el-button>
        </template>
      </el-table-column>

      <el-table-column label="当前价格" prop="price"/>

      <el-table-column label="是否新品" prop="is_new">
        <template slot-scope="scope">
          <el-tag :type="scope.row.is_new ? 'success' : 'error' ">{{ scope.row.is_new ? '新品' : '非新品' }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="是否热品" prop="is_hot">
        <template slot-scope="scope">
          <el-tag :type="scope.row.is_hot ? 'success' : 'error' ">{{ scope.row.is_hot ? '热品' : '非热品' }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column
        prop="status"
        label="上架/下架">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="1"
            :inactive-value="0"
            @change="handleStatusChange(scope.row)">
          </el-switch>
        </template>
      </el-table-column>

      <el-table-column label="操作" min-width="100">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.row)">编辑
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="pagination.total>0"
      :total="pagination.total"
      :page.sync="pagination.page"
      :limit.sync="pagination.limit"
      @pagination="handleQuery"/>
  </div>
</template>

<script>
import {list, del, add, update} from '@/api/pms/spu'
import {list as categoryList} from '@/api/pms/category'

export default {
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      pagination: {
        page: 1,
        limit: 10,
        total: 0
      },
      queryParams: {
        name: undefined,
        categoryId: undefined
      },
      list: [],
      categoryOptions: [],
      spuDetail: undefined,
      detailDialogVisible: false
    }
  },
  created() {
    this.loadCategoryOptions()
    this.handleQuery()
  },
  methods: {
    loadCategoryOptions() {
      categoryList({_qm: 2}).then(response => {
        console.log(response.data)
      })
    },
    handleQuery() {
      list(this.pagination.page, this.pagination.limit, this.queryParams).then(response => {
        this.pageList = response.data.records
        this.pagination.total = response.data.total
      })
    },
    handleResetQuery() {
      this.pagination = {
        page: 1,
        limit: 10,
        total: 0
      }
      this.queryParams = {
        name: undefined,
        goods_sn: undefined,
        is_new: undefined
      }
      this.resetForm("queryForm")
      this.handleQuery()
    },
    showDetail(detail) {
      this.spuDetail = detail
      this.detailDialogVisible = true
    },
    handleAdd() {
      this.$router.push({name: 'spuAdd'})
    },
    handleEdit(row) {
      this.$router.push({name: 'spuEdit', params: {id: row.id}})
    },
    handleDelete(row) {
      const ids = row.id || this.ids
      this.$confirm('是否确认删除选中的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return del(ids)
      }).then(() => {
        this.$message.success("删除成功")
        this.handleQuery()
      }).catch(() =>
        this.$message.info("已取消删除")
      )
    },
    handleRowClick(row) {
      this.$refs.multipleTable.toggleRowSelection(row);
    },
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    // 显示隐藏
    handleStatusChange(row) {
      let operation = row.status === 0 ? '下架' : '上架'
      let that = this
      this.$confirm('确认要' + operation + row.name + '商品?', "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        patch(row.id, {status: row.status}).then(response => {
          that.$message.success(response.msg)
        })
      }).catch(function () {
        row.status = row.status === 0 ? 1 : 0;
      })
    }
  }
}
</script>

<style scoped>

</style>
