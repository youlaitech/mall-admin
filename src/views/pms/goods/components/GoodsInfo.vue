<script setup lang="ts">
import Editor from "@/components/WangEditor/index.vue";

// API 依赖
import { getBrandList } from "@/api/pms/brand";

const emit = defineEmits(["prev", "next", "update:modelValue"]);
const dataFormRef = ref(ElForm);

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => {},
  },
});

const goodsInfo: any = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit("update:modelValue", value);
  },
});

const state = reactive({
  brandOptions: [] as Array<any>,
  rules: {
    name: [{ required: true, message: "请填写商品名称", trigger: "blur" }],
    originPrice: [{ required: true, message: "请填写零售价", trigger: "blur" }],
    price: [{ required: true, message: "请填写促销价", trigger: "blur" }],
    brandId: [{ required: true, message: "请选择商品品牌", trigger: "blur" }],
    picUrl: [{ required: true, message: "请上传商品主图", trigger: "blur" }],
  },
});

const { brandOptions, rules } = toRefs(state);

function loadData() {
  getBrandList().then(({ data }) => {
    state.brandOptions = data;
  });
}

function handlePrev() {
  emit("prev");
}

function handleNext() {
  dataFormRef.value.validate((valid: any) => {
    if (valid) {
      emit("next");
    }
  });
}

onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="component-container">
    <div class="component-container__main">
      <el-form
        ref="dataFormRef"
        :rules="rules"
        :model="goodsInfo"
        label-width="120px"
      >
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="goodsInfo.name" style="width: 400px" />
        </el-form-item>

        <el-form-item label="商品品牌" prop="brandId">
          <el-select v-model="goodsInfo.brandId" style="width: 400px" clearable>
            <el-option
              v-for="item in brandOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="零售价" prop="originPrice">
          <el-input v-model="goodsInfo.originPrice" style="width: 400px" />
        </el-form-item>

        <el-form-item label="促销价" prop="price">
          <el-input v-model="goodsInfo.price" style="width: 400px" />
        </el-form-item>

        <el-form-item label="商品主图" prop="picUrl">
          <single-upload v-model="goodsInfo.picUrl" />
        </el-form-item>

        <el-form-item label="商品轮播图">
          <multi-upload v-model="goodsInfo.subPicUrls" />
        </el-form-item>

        <el-form-item label="商品简介">
          <el-input
            v-model="goodsInfo.description"
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 6 }"
          />
        </el-form-item>

        <el-form-item label="商品详情" prop="detail">
          <editor v-model="goodsInfo.detail" style="height: 600px" />
        </el-form-item>
      </el-form>
    </div>
    <div class="component-container__footer">
      <el-button @click="handlePrev">上一步，选择商品分类</el-button>
      <el-button type="primary" @click="handleNext"
        >下一步，设置商品属性</el-button
      >
    </div>
  </div>
</template>

<style lang="scss" scoped>
.component-container {
  &__main {
    margin: 20px auto;

    .button {
      margin-left: 10px;
    }
  }

  &__footer {
    position: fixed;
    right: 20px;
    bottom: 20px;
  }
}
</style>
