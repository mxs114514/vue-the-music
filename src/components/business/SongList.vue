<script setup lang="ts">
import { usePlayerStore } from '@/stores/player'
import type { Song } from '@/types'
import { VideoPlay, Picture, Loading, Star, StarFilled } from '@element-plus/icons-vue'
import ScrollingText from '@/components/base/ScrollingText.vue'

// 接收父组件传来的歌曲列表
const props = defineProps<{
  songs: Song[]
  // 可选：是否显示加载状态
  loading?: boolean
  // 可选：空状态时的描述文字
  emptyText?: string
  // 可选：是否显示排名角标 (用于排行榜)
  showRank?: boolean
}>()

const playerStore = usePlayerStore()

// 处理点击播放
const handlePlay = (song: Song) => {
  playerStore.playSong(song)
}

// 处理点击收藏
const handleFavorite = (e: Event, song: Song) => {
  e.stopPropagation() // 阻止冒泡，防止触发播放
  playerStore.toggleFavorite(song)
}
</script>

<template>
  <div class="song-list-container">
    <!-- 加载中 -->
    <div v-if="loading" class="song-grid">
      <div v-for="i in 10" :key="i">
        <el-skeleton animated>
          <template #template>
            <div
              style="
                width: 100%;
                aspect-ratio: 1;
                border-radius: 6px;
                overflow: hidden;
                margin-bottom: 10px;
              "
            >
              <el-skeleton-item variant="image" style="width: 100%; height: 100%" />
            </div>
            <div>
              <el-skeleton-item variant="text" style="width: 70%" />
              <el-skeleton-item variant="text" style="width: 40%; margin-top: 8px" />
            </div>
          </template>
        </el-skeleton>
      </div>
    </div>
    <!-- 有数据 -->
    <div v-else-if="songs.length > 0" class="song-grid">
      <!-- 插槽：允许父组件在列表前插入自定义内容（如随机播放卡片） -->
      <slot name="prepend" />

      <el-card
        v-for="(song, index) in songs"
        :key="song.id"
        class="song-card"
        :body-style="{ padding: '10px' }"
        shadow="hover"
        @click="handlePlay(song)"
      >
        <div class="cover-wrapper">
          <!-- 排名角标 -->
          <div v-if="showRank" class="rank-badge" :class="'rank-' + (index + 1)">
            <template v-if="index === 0">NO.1 🏆</template>
            <template v-else-if="index === 1">NO.2 🥈</template>
            <template v-else-if="index === 2">NO.3 🥉</template>
            <template v-else>{{ index + 1 }}</template>
          </div>

          <el-image :src="song.cover || '/default-cover.png'" class="cover-img" fit="cover" lazy>
            <template #placeholder>
              <div class="image-slot">
                <el-icon class="is-loading"><Loading /></el-icon>
              </div>
            </template>
            <template #error>
              <div class="image-slot">
                <el-icon><Picture /></el-icon>
              </div>
            </template>
          </el-image>
          <!-- 悬停显示的播放图标 -->
          <div class="play-overlay">
            <el-icon><VideoPlay /></el-icon>
          </div>

          <!-- 收藏按钮 (右下角) -->
          <div
            class="favorite-btn"
            :class="{ 'is-active': song.isFavorited }"
            @click="(e) => handleFavorite(e, song)"
          >
            <el-icon v-if="song.isFavorited"><StarFilled /></el-icon>
            <el-icon v-else><Star /></el-icon>
          </div>
        </div>

        <div class="info">
          <ScrollingText class="title" :text="song.title" trigger="hover" />
          <p class="artist" :title="song.artist">{{ song.artist }}</p>
        </div>
      </el-card>
    </div>

    <!-- 空状态 -->
    <el-empty v-else :description="emptyText || '暂无歌曲'" />
  </div>
</template>

<style scoped>
.song-grid {
  display: grid;
  /* 响应式网格：最小宽度 200px，自动填充 */
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
}

.song-card {
  cursor: pointer;
  transition: all 0.3s;
  border: none;
  background-color: var(--el-bg-color);
}

.song-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.cover-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 10px;
  background-color: var(--el-fill-color-light);
}

.cover-img {
  width: 100%;
  height: 100%;
  transition: transform 0.3s;
  display: block;
}

.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-secondary);
  font-size: 24px;
}

/* 悬停时图片轻微放大 */
.song-card:hover .cover-img {
  transform: scale(1.05);
}

/* 播放遮罩层 */
.play-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.play-overlay .el-icon {
  font-size: 40px;
  color: white;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
}

.song-card:hover .play-overlay {
  opacity: 1;
}

/* 收藏按钮样式 */
.favorite-btn {
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s;
  z-index: 2; /* 确保在遮罩层之上 */
  opacity: 0; /* 默认隐藏 */
  transform: scale(0.8);
}

.song-card:hover .favorite-btn {
  opacity: 1;
  transform: scale(1);
}

.favorite-btn:hover {
  background: rgba(0, 0, 0, 0.7);
  transform: scale(1.1);
}

.favorite-btn .el-icon {
  font-size: 18px;
  color: #e0e0e0; /* 默认灰色 */
}

.favorite-btn.is-active .el-icon {
  color: #e6a23c; /* 激活时黄色 */
}

.info .title {
  margin: 0 0 4px 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

/* 当鼠标悬停在卡片上时，触发内部 ScrollingText 的滚动 */
.song-card:hover :deep(.trigger-hover.is-overflow .scroll-wrapper) {
  animation-play-state: running;
}

.info .artist {
  margin: 0;
  font-size: 13px;
  color: var(--el-text-color-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.loading-state {
  padding: 20px;
}

/* 排名角标样式 */
.rank-badge {
  position: absolute;
  top: 0;
  left: 0;
  padding: 4px 8px;
  color: white;
  font-weight: bold;
  font-size: 12px;
  z-index: 2;
  border-bottom-right-radius: 8px;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.6); /* 默认背景 */
}

.rank-1 {
  background: linear-gradient(135deg, #f56c6c, #f29b9b);
  font-size: 14px;
  padding: 6px 10px;
}

.rank-2 {
  background: linear-gradient(135deg, #e6a23c, #f3d19e);
}

.rank-3 {
  background: linear-gradient(135deg, #409eff, #79bbff);
}
</style>
