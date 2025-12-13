<template>
  <div class="album-list-container">
    <!-- 加载中 -->
    <div v-if="loading" class="album-grid">
      <div v-for="i in 5" :key="i" class="album-card">
        <el-skeleton animated>
          <template #template>
            <div style="width: 100%; aspect-ratio: 1; border-radius: 12px; overflow: hidden">
              <el-skeleton-item variant="image" style="width: 100%; height: 100%" />
            </div>
            <div style="margin-top: 12px">
              <el-skeleton-item variant="text" style="width: 70%" />
              <el-skeleton-item variant="text" style="width: 40%; margin-top: 8px" />
            </div>
          </template>
        </el-skeleton>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else-if="albums.length === 0" class="empty-state">暂无专辑数据</div>

    <!-- 专辑网格 -->
    <div v-else class="album-grid">
      <div
        v-for="album in albums"
        :key="album.name"
        class="album-card"
        @click="$emit('select', album.name)"
      >
        <div class="cover-wrapper">
          <el-image :src="album.cover || defaultCover" class="cover-img" fit="cover" lazy>
            <template #error>
              <div class="image-slot">
                <i class="iconfont icon-music"></i>
              </div>
            </template>
          </el-image>
          <div class="play-overlay">
            <el-icon><VideoPlay /></el-icon>
          </div>
        </div>
        <div class="album-info">
          <h3 class="album-name" :title="album.name">{{ album.name }}</h3>
          <p class="song-count">{{ album.count }} 首歌曲</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { VideoPlay } from '@element-plus/icons-vue'
import type { Album } from '@/types'

// Props
defineProps<{
  albums: Album[]
  loading?: boolean
}>()

// Emits
defineEmits<{
  (e: 'select', name: string): void
}>()

const defaultCover = '/imgs/default-cover.png'
</script>

<style scoped>
.loading-state,
.empty-state {
  text-align: center;
  padding: 40px;
  color: #888;
}

/* Grid Styles */
.album-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 24px;
}

.album-card {
  cursor: pointer;
  transition: all 0.3s;
  border-radius: 12px;
  overflow: hidden;
}

.album-card:hover {
  transform: translateY(-5px);
}

.cover-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  border-radius: 12px;
  overflow: hidden;
  background-color: #f5f7fa;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.cover-img {
  width: 100%;
  height: 100%;
  display: block;
}

.play-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
  color: white;
  font-size: 48px;
}

.album-card:hover .play-overlay {
  opacity: 1;
}

.album-info {
  margin-top: 12px;
}

.album-name {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--text-color);
}

.song-count {
  font-size: 13px;
  color: var(--text-color-secondary, #888);
}

.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  color: #909399;
  font-size: 30px;
}
</style>
