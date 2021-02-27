<template>
  <div>
    <el-upload
        :headers="headers"
        :action="uploadAction"
        class="avatar-uploader"
        :before-upload="beforeUpload"
        :on-remove="handleRemove"
        :on-success="handleUploadSuccess"
        :on-exceed="handleExceed"
        :auto-upload="true"
        :show-file-list="false"
    >
      <img v-if="imageUrl" :src="imageUrl" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
  </div>
</template>
<script>
import {getToken} from '@/utils/auth'
import {del} from '@/api/admin/file'

export default {
  name: 'MultiUpload',
  props: {
    value: String
  },
  data() {
    return {
      headers: {authorization:  getToken()},
      uploadAction: process.env.VUE_APP_BASE_API + '/youlai-admin/api.admin/v1/files',
      dialogVisible: false,
    };
  },
  computed: {

    imageUrl:{
      get() {
        return this.value
      },
      set(val) {
      }
    }
  },
  methods: {
    emitInput(val) {
      this.$emit('input', val)
    },
    handleRemove(file, fileList) {
      del(file.url)
      this.emitInput(fileList);
    },
    beforeUpload(file) {

    },
    handleUploadSuccess(response, file) {
      let url = response.data
      this.imageUrl = url
      this.emitInput(url)
    },
    handleExceed(files, fileList) {
      this.$message({
        message: '最多只能上传' + this.maxCount + '张图片',
        type: 'warning',
        duration: 1000
      });
    },
  }
}
</script>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 148px;
  height: 148px;
  line-height: 146px;
  text-align: center;
}

.avatar {
  width: 148px;
  height: 148px;
  display: block;
}
</style>


