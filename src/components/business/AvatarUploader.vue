<template>
  <div class="avatar-row">
    <el-upload
      class="avatar-uploader"
      action="/api/user/avatar"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
      :headers="uploadHeaders"
      name="file"
    >
      <div v-if="modelValue" class="avatar-wrapper">
        <img :src="modelValue" class="avatar" />
        <div class="edit-overlay">
          <el-icon><EditPen /></el-icon>
        </div>
      </div>
      <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
    </el-upload>
    <span class="avatar-tip">点击图片更换头像</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, EditPen } from '@element-plus/icons-vue'
import type { UploadProps } from 'element-plus'
import { useAuthStore } from '@/stores/auth'

// 双向绑定：接收父组件传来的头像 URL，并能更新它
const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const authStore = useAuthStore()

// 上传请求头
const uploadHeaders = computed(() => ({
  Authorization: `Bearer ${authStore.token}`
}))

// 成功回调
const handleAvatarSuccess: UploadProps['onSuccess'] = (response) => {
  if (response.url) {
    // 通知父组件更新值
    emit('update:modelValue', response.url)
    ElMessage.success('头像上传成功')
  }
}

// 上传前校验
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
    ElMessage.error('头像必须是 JPG 或 PNG 格式!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('头像大小不能超过 2MB!')
    return false
  }
  return true
}
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
  object-fit: cover;
  border-radius: 6px;
}

.avatar-wrapper {
  position: relative;
  width: 178px;
  height: 178px;
}

.edit-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s;
  border-radius: 6px;
  color: white;
  font-size: 24px;
}

.avatar-wrapper:hover .edit-overlay {
  opacity: 1;
}

.avatar-row {
  display: flex;
  align-items: flex-end;
}

.avatar-tip {
  margin-left: 12px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-bottom: 8px;
}
</style>

<style>
/* 全局样式覆盖 Element Plus 内部样式 */
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
