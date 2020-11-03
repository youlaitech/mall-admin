<template>
  <div>
    <el-upload
      :headers="headers"
      :action="uploadAction"
      list-type="picture"
      :multiple="false"
      :show-file-list="showFileList"
      :file-list="fileList"
      :before-upload="beforeUpload"
      :on-remove="handleRemove"
      :on-success="handleUploadSuccess"
      :on-preview="handlePreview"
      :auto-upload="true">
      <el-button size="small" type="primary">点击上传</el-button>
      <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过10MB</div>-->
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="fileList[0].url" alt="">
    </el-dialog>
  </div>
</template>
<script>
import {getToken} from '@/utils/auth'
import {del} from '@/api/admin/file'

export default {
  name: 'SingleUpload',
  props: {
    value: String
  },
  computed: {
    imageUrl() {
      return this.value;
    },
    showFileList: {
      get: function () {
        return this.value !== null && this.value !== '' && this.value !== undefined;
      },
      set: function (newValue) {
      }
    },
    fileList() {
      return [
        {
          url: this.imageUrl
        }
      ]
    }
  },
  data() {
    return {
      headers: {Authorization: 'Bearer ' + getToken()},
      uploadAction: process.env.VUE_APP_BASE_API + '/youlai-admin/files',
      dialogVisible: false,
    }
  },
  methods: {
    emitInput(val) {
      this.$emit('input', val)
    },
    handleRemove(file, fileList) {
      del(file.url)
      this.emitInput('');
    },
    handlePreview(file) {
      this.dialogVisible = true;
    },
    beforeUpload(file) {

    },
    handleUploadSuccess(response, file) {
      this.showFileList = true;
      this.fileList.pop();
      const url = response.data
      this.fileList.push({url: url})
      this.emitInput(this.fileList[0].url);
    }
  }
}
</script>
<style>

</style>


