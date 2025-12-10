<script setup lang="ts">
import { usePlayerStore } from '@/stores/player'
import { storeToRefs } from 'pinia'

const playerStore = usePlayerStore()
// 获取当前播放的歌曲
const { currentSong } = storeToRefs(playerStore)
</script>

<template>
  <div class="player-bar">
    <!-- 左侧：歌曲信息 -->
    <div class="song-info" v-if="currentSong">
      <!-- 封面 -->
      <img :src="currentSong.cover || '/default-cover.png'" alt="cover" class="mini-cover">
      <!-- 文字信息 -->
      <div class="text-info">
        <div class="title">{{ currentSong.title }}</div>
        <div class="artist">{{ currentSong.artist }}</div>
      </div>
    </div>
    <div class="song-info" v-else>
      <div class="placeholder">暂无播放</div>
    </div>

    <!-- 中间：播放器控件 -->
    <div class="controls">
      <!--
        :src 绑定歌曲链接
        autoplay 自动播放
        controls 显示原生进度条和音量控制
        :key 确保切歌时组件重新渲染，保证自动播放触发
      -->
      <audio
        v-if="currentSong"
        :key="currentSong.id"
        :src="currentSong.url"
        autoplay
        controls
      ></audio>
    </div>

    <!-- 右侧：占位 (以后放音量或播放列表按钮) -->
    <div class="actions"></div>
  </div>
</template>

<style scoped>
.player-bar {
  height: 100%;
  background-color: #fff;
  border-top: 1px solid #eee;
  display: flex;
  align-items: center;
  padding: 0 20px;
  justify-content: space-between;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
}

/* 左侧歌曲信息 */
.song-info {
  display: flex;
  align-items: center;
  width: 250px; /* 固定宽度，防止挤压中间 */
}
.mini-cover {
  width: 50px;
  height: 50px;
  border-radius: 4px;
  margin-right: 12px;
  object-fit: cover;
  background-color: #eee;
}
.text-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
  /* 文字过长省略 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 180px;
}
.artist {
  font-size: 12px;
  color: #666;
}
.placeholder {
  color: #999;
  font-size: 14px;
}

/* 中间播放器 */
.controls {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
audio {
  width: 100%;
  max-width: 600px;
  height: 40px;
  outline: none;
}

/* 右侧占位 */
.actions {
  width: 250px;
}
</style>
