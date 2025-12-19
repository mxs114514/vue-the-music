<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import type { UploadInstance, UploadFile } from 'element-plus'
import { uploadSong } from '@/api/songs'

const songUploadRef = ref<UploadInstance>()
const coverUploadRef = ref<UploadInstance>()
const loading = ref(false)

const form = reactive({
  title: '',
  artist: '',
  album: '',
})

const songFile = ref<File | null>(null)
const coverFile = ref<File | null>(null)

// 歌曲文件变更
const handleSongChange = (file: UploadFile, fileList: UploadFile[]) => {
  // 限制只能选择一个文件，如果选择了新文件，覆盖旧文件
  if (fileList.length > 1) {
    fileList.splice(0, 1)
  }

  if (file.raw) {
    songFile.value = file.raw
    // 自动填充歌名和歌手
    // 假设文件名格式为 "歌手 - 歌名.mp3"
    const name = file.name.replace(/\.[^/.]+$/, '') // 去掉后缀
    if (name.includes('-')) {
      const parts = name.split('-')
      // 只有当用户还没填的时候才自动填充
      if (!form.artist) form.artist = parts[0].trim()
      if (!form.title) form.title = parts.slice(1).join('-').trim()
    } else {
      if (!form.title) form.title = name
    }
  }
}

// 封面文件变更
const handleCoverChange = (file: UploadFile, fileList: UploadFile[]) => {
  // 限制只能选择一个文件
  if (fileList.length > 1) {
    fileList.splice(0, 1)
  }

  if (file.raw) {
    coverFile.value = file.raw
  }
}

// 提交表单
const submitUpload = async () => {
  if (!songFile.value) {
    ElMessage.warning('请选择歌曲文件')
    return
  }

  loading.value = true
  try {
    await uploadSong({
      file: songFile.value,
      cover: coverFile.value || undefined,
      title: form.title,
      artist: form.artist,
      album: form.album,
    })
    ElMessage.success('上传成功')

    // 清空表单
    form.title = ''
    form.artist = ''
    form.album = ''
    songFile.value = null
    coverFile.value = null
    songUploadRef.value?.clearFiles()
    coverUploadRef.value?.clearFiles()
  } catch (error) {
    console.error(error)
    ElMessage.error('上传失败，请重试')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="upload-card">
    <div class="header">
      <h2>上传歌曲</h2>
      <p class="subtitle">分享你的音乐创作或收藏</p>
    </div>

    <el-form :model="form" label-position="top" class="upload-form">
      <!-- 1. 歌曲文件 (必填) -->
      <el-form-item label="歌曲文件 (必填)" required>
        <el-upload
          ref="songUploadRef"
          class="upload-demo"
          drag
          action="#"
          :auto-upload="false"
          :limit="1"
          accept="audio/*"
          :on-change="handleSongChange"
          :on-remove="() => (songFile = null)"
        >
          <el-icon class="el-icon--upload"><IEpUploadFilled /></el-icon>
          <div class="el-upload__text">拖拽文件到此处或 <em>点击上传</em></div>
          <template #tip>
            <div class="el-upload__tip">支持 mp3, flac 等音频格式，最大 50MB</div>
          </template>
        </el-upload>
      </el-form-item>

      <!-- 2. 封面图片 -->
      <el-form-item label="封面图片">
        <el-upload
          ref="coverUploadRef"
          class="cover-uploader"
          action="#"
          :auto-upload="false"
          :limit="1"
          accept="image/*"
          :on-change="handleCoverChange"
          :on-remove="() => (coverFile = null)"
          list-type="picture-card"
        >
          <el-icon><IEpPlus /></el-icon>
        </el-upload>
      </el-form-item>

      <!-- 3. 基本信息 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="歌名">
            <el-input v-model="form.title" placeholder="如果不填，将使用文件名" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="歌手">
            <el-input v-model="form.artist" placeholder="如果不填，默认为'未知歌手'" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="专辑">
        <el-input v-model="form.album" placeholder="如果不填，默认为'未知专辑'" />
      </el-form-item>

      <!-- 提交按钮 -->
      <div class="form-actions">
        <el-button
          type="primary"
          size="large"
          @click="submitUpload"
          :loading="loading"
          class="submit-btn"
        >
          开始上传
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<style scoped>
.upload-card {
  background: var(--el-bg-color);
  border-radius: 16px;
  padding: 40px;
  box-shadow: var(--el-box-shadow-light);
}

.header {
  text-align: center;
  margin-bottom: 40px;
}

.header h2 {
  font-size: 28px;
  color: var(--el-text-color-primary);
  margin-bottom: 10px;
}

.subtitle {
  color: var(--el-text-color-secondary);
  font-size: 14px;
}

.upload-form {
  max-width: 600px;
  margin: 0 auto;
}

.cover-uploader :deep(.el-upload--picture-card) {
  width: 100px;
  height: 100px;
  line-height: 100px;
}

.cover-uploader :deep(.el-upload-list--picture-card .el-upload-list__item) {
  width: 100px;
  height: 100px;
}

.form-actions {
  margin-top: 40px;
  display: flex;
  justify-content: center;
}

.submit-btn {
  width: 200px;
  border-radius: 24px;
}
</style>
