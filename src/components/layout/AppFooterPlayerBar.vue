<script setup lang="ts">
import { usePlayerStore } from '@/stores/player'
import { storeToRefs } from 'pinia'
import { watch, ref } from 'vue'
import { Picture } from '@element-plus/icons-vue'
import ScrollingText from '@/components/base/ScrollingText.vue'

const playerStore = usePlayerStore()
const { currentSong, currentTime, currenVolume, currenRate } = storeToRefs(playerStore)

// 引用 audio 元素
const audioRef = ref<HTMLAudioElement | null>(null)

// 监听播放器时间更新 -> 同步到 Store
const onTimeUpdate = () => {
  if (audioRef.value) {
    playerStore.currentTime = audioRef.value.currentTime
  }
}

// 监听播放器加载元数据 -> 恢复上次进度、音量、倍速
const onLoadedMetadata = () => {
  if (audioRef.value) {
    if (currentTime.value > 0) {
      audioRef.value.currentTime = currentTime.value
    }
    // 恢复音量
    audioRef.value.volume = currenVolume.value
    // 恢复倍速
    audioRef.value.playbackRate = currenRate.value
  }
}
// 监听音量变化 -> 同步到 Store
const onVolumeChange = () => {
  if (audioRef.value) {
    playerStore.currenVolume = audioRef.value.volume
  }
}
// 监听播放速度变化 -> 同步到 Store
const onRateChange = () => {
  if (audioRef.value) {
    playerStore.currenRate = audioRef.value.playbackRate
  }
}

// 监听 Store 变化 -> 同步到 Audio 元素 (支持双向绑定)
watch(currenVolume, (newVal) => {
  if (audioRef.value && Math.abs(audioRef.value.volume - newVal) > 0.01) {
    audioRef.value.volume = newVal
  }
})

watch(currenRate, (newVal) => {
  if (audioRef.value && Math.abs(audioRef.value.playbackRate - newVal) > 0.01) {
    audioRef.value.playbackRate = newVal
  }
})
</script>

<template>
  <div class="player-bar">
    <!-- 左侧：歌曲信息 -->
    <div class="song-info" v-if="currentSong">
      <!-- 封面 -->
      <el-image
        :src="currentSong.cover || '/default-cover.png'"
        class="mini-cover"
        fit="cover"
      >
        <template #error>
          <div class="image-slot">
            <el-icon><Picture /></el-icon>
          </div>
        </template>
      </el-image>
      <!-- 文字信息 -->
      <div class="text-info">
        <ScrollingText
          class="title"
          :text="currentSong.title"
          trigger="always"
        />
        <el-text class="artist" size="small" type="info">{{ currentSong.artist }}</el-text>
      </div>
    </div>
    <div class="song-info" v-else>
      <el-text class="placeholder" type="info">暂无播放</el-text>
    </div>

    <!-- 中间：播放器控件 -->
    <div class="controls">
      <!--
        :src 绑定歌曲链接
        autoplay 自动播放
        controls 显示原生进度条和音量控制
        :key 确保切歌时组件重新渲染，保证自动播放触发
      -->
      <el-button circle size="large" @click="playerStore.prevSong">
        <el-icon><IEpCaretLeft /></el-icon>
      </el-button>
      <el-button circle size="large" @click="playerStore.nextSong">
        <el-icon><IEpCaretRight /></el-icon>
      </el-button>
      <audio
        ref="audioRef"
        v-if="currentSong"
        :src="currentSong.url"
        controls
        autoplay
        @timeupdate="onTimeUpdate"
        @loadedmetadata="onLoadedMetadata"
        @volumechange="onVolumeChange"
        @ratechange="onRateChange"
      ></audio>
    </div>

    <!-- 右侧：占位 (以后放音量或播放列表按钮) -->
    <div class="actions"></div>
  </div>
</template>

<style scoped>
.player-bar {
  height: 100%;
  background-color: var(--el-bg-color);
  border-top: 1px solid var(--el-border-color-light);
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
  background-color: var(--el-fill-color);
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
}
.text-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden; /* 配合 el-text truncated */
  flex: 1;
  min-width: 0;
}
.title {
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 4px;
  display: block;
  width: 100%;
  text-align: left;
}
.artist {
  font-size: 12px;
  color: var(--el-text-color-regular);
  display: block;
  width: 100%;
  text-align: left;
}
.placeholder {
  color: var(--el-text-color-secondary);
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
