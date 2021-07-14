<template>
  <div class="components-container">
    <el-card class="box-card" shadow="never">
      <div class="clearfix" slot="header">
        <b>
          {{ this.$route.query.goodsId ? '编辑商品' : '新增商品' }}
        </b>
      </div>
      <el-steps :active="active" process-status="finish" finish-status="success" simple>
        <el-step title="选择商品分类"></el-step>
        <el-step title="填写商品信息"></el-step>
        <el-step title="填写商品属性"></el-step>
      </el-steps>
      <goods-category
        v-show="active==0"
        v-model="goodsForm"
        @prev="prev"
        @next="next">
      </goods-category>
      <goods-category
        v-show="active==1"
        v-model="goodsForm"
        @prev="prev"
        @next="next"
      >
      </goods-category>
      <goods-category
        v-show="active==2"
        v-model="goodsForm"
        @prev="prev"
        @next="next">
      </goods-category>
      <goods-category
        v-show="active==3"
        v-model="goodsForm"
        @prev="prev"
        @next="next">
      </goods-category>
    </el-card>
  </div>
</template>

<script>
import GoodsCategory from "@/views/pms/goods/components/GoodsCategory";
import {detail} from "@/api/pms/goods";

export default {
  name: "goods-detail",
  components: {GoodsCategory},
  props:['goodsId'],
  data() {
    return {
      active: 0,
      goodsForm: {
        spuInfo:{},
        attrValueList:[],
        skuList:[]
      }
    };
  },
  created() {
    this.loadData()
  },
  methods: {
    prev() {
      if (this.active-- <= 0) {
        this.active = 0;
      }
    },
    next() {
      if (this.active++ >= 2) {
        this.active = 0;
      }
    },
    loadData() {
      const goodsId = this.$route.query.goodsId
      if (goodsId) {
        detail(goodsId).then(response => {
          this.goodsForm = response.data
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.form-container {
  width: 80%;
  margin: 30px auto;
}
</style>
