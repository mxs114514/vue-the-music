<template>
  <div class="album-detail">
    <div class="header">
      <el-button @click="$emit('back')" :icon="ArrowLeft" circle class="back-btn" />
      <h1 class="page-title">专辑：{{ albumName }}</h1>
    </div>

    <SongList
      :songs="songs"
      :loading="loading"
      empty-text="该专辑暂无歌曲"
    />
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft } from '@element-plus/icons-vue'
import SongList from '@/components/business/SongList.vue'
import type { Song } from '@/types'

defineProps<{
  albumName: string
  songs: Song[]
  loading?: boolean
}>()

defineEmits<{
  (e: 'back'): void
}>()
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: bold;
  margin: 0;
  color: var(--text-color);
}
</style>
