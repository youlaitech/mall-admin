<template>
  <div>
    <el-upload
      :headers="headers"
      :action="uploadAction"
      class="avatar-uploader"
      :before-upload="beforeUpload"
      :on-remove="handleRemove"
      :on-success="handleUploadSuccess"
      :on-preview="handlePreview"
      :on-exceed="handleExceed"
      :auto-upload="true"
      :show-file-list="false"
    >
      <img v-if="image" :src="image" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
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
      headers: {authorization: 'Bearer ' + getToken()},
      uploadAction: process.env.VUE_APP_BASE_API + '/youlai-admin/files',
      dialogVisible: false,
      dialogImageUrl: null,
      image: ''
    };
  },
  computed: {
    imageUrl: {
      get() {
        return this.value
      },
      set(val) {
        this.image = val
      }
    }
  },
  methods: {
    emitInput(imageUrl) {
      this.$emit('input', imageUrl)
    },
    handleRemove(file, fileList) {
      del(file.url)
      this.emitInput(fileList);
    },
    handlePreview(file) {
      this.dialogVisible = true;
      this.dialogImageUrl = file.url;
    },
    beforeUpload(file) {

    },
    handleUploadSuccess(response, file) {
      let url = response.data
      this.image = url
      this.emitInput(this.image)
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
  width: 150px;
  height: 150px;
  line-height: 150px;
  text-align: center;
}

.avatar {
  width: 150px;
  height: 150px;
  display: block;
}
</style>


