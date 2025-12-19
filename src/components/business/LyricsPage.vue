<template>
  <div class="lyrics-page">
    <!-- 顶部关闭按钮 -->
    <div class="header">
      <div class="close-btn" @click="playerStore.toggleLyricsPage">
        <el-icon size="24"><ArrowDown /></el-icon>
      </div>
    </div>

    <!-- 主体内容区域 -->
    <div class="main-container">
      <!-- 左侧：旋转CD -->
      <div class="left-section">
        <div class="cd-wrapper" :class="{ playing: isPlaying }">
          <div class="cd-disc">
            <el-image
              :src="currentSong?.cover || '/default-cover.png'"
              class="cd-cover"
              fit="cover"
            >
              <template #error>
                <div class="image-slot">
                  <el-icon size="40"><Picture /></el-icon>
                </div>
              </template>
            </el-image>
          </div>
        </div>
      </div>

      <!-- 右侧：歌词区域 -->
      <div class="right-section">
        <div class="lyrics-container" v-if="lyrics.length > 0" ref="lyricsContainerRef">
          <p
            v-for="(line, index) in lyrics"
            :key="index"
            class="lyric-line"
            :class="{ active: index === currentLineIndex }"
            @click="seekTo(line.time)"
          >
            {{ line.text }}
          </p>
        </div>
        <div class="lyrics-placeholder" v-else>
          <p>暂无歌词</p>
          <p class="sub-text">{{ currentSong?.title }} - {{ currentSong?.artist }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePlayerStore } from '@/stores/player'
import { storeToRefs } from 'pinia'
import { ArrowDown, Picture } from '@element-plus/icons-vue'
import { watch, ref, nextTick } from 'vue'
import { LyricLine, parseLrc } from '@/utils/lrc-parse'

const playerStore = usePlayerStore()
const { currentSong, isPlaying } = storeToRefs(playerStore)
const lyrics = ref<LyricLine[]>([])
const currentLineIndex = ref(0)
const lyricsContainerRef = ref<HTMLElement | null>(null)

watch(
  currentSong,
  async (newSong) => {
    console.log('🎵 切歌了:', newSong?.title, 'LRC URL:', newSong?.lrcUrl) // 1. 检查 URL
    if (newSong?.lrcUrl) {
      try {
        const baseURL = 'http://localhost:3000'
        const url = newSong.lrcUrl.startsWith('http') ? newSong.lrcUrl : baseURL + newSong.lrcUrl

        const response = await fetch(url)
        const lrcText = await response.text()
        console.log('📄 拿到歌词文本:', lrcText.substring(0, 50) + '...') // 2. 检查文本内容

        lyrics.value = parseLrc(lrcText)
        console.log('✅ 解析结果:', lyrics.value) // 3. 检查解析后的数组
      } catch (error) {
        console.error('❌ 加载歌词失败:', error)
        lyrics.value = []
      }
    } else {
      console.log('⚠️ 这首歌没有 lrcUrl')
      lyrics.value = []
    }
  },
  { immediate: true }
)

watch(
  () => playerStore.currentTime,
  (newTime) => {
    // 二分查找优化
    let left = 0
    let right = lyrics.value.length - 1
    // 默认保持上一行的索引，避免找不到时跳回0
    let index = currentLineIndex.value

    // 只有当有歌词时才查找
    if (lyrics.value.length > 0) {
      // 如果当前时间小于第一句，显示第一句之前（index=-1）
      if (newTime < lyrics.value[0].time) {
        index = -1
      } else {
        // 二分查找最后一个 time <= newTime 的元素
        // 也就是查找第一个 time > newTime 的元素的前一个
        let l = 0,
          r = lyrics.value.length - 1
        while (l <= r) {
          const mid = Math.floor((l + r) / 2)
          if (lyrics.value[mid].time <= newTime) {
            index = mid
            l = mid + 1
          } else {
            r = mid - 1
          }
        }
      }
    }

    if (currentLineIndex.value !== index) {
      currentLineIndex.value = index
    }
  }
)

// 监听当前行变化，实现自动滚动
watch(currentLineIndex, async (newIndex) => {
  await nextTick()
  if (newIndex >= 0 && lyricsContainerRef.value) {
    const container = lyricsContainerRef.value
    const lines = container.querySelectorAll('.lyric-line')
    const currentLine = lines[newIndex] as HTMLElement

    if (currentLine) {
      const containerHeight = container.clientHeight
      const lineHeight = currentLine.clientHeight
      // 计算滚动位置：让当前行居中
      // 目标 scrollTop = 当前行距离顶部的距离 - (容器高度/2) + (行高/2)
      const scrollTop = currentLine.offsetTop - containerHeight / 2 + lineHeight / 2

      container.scrollTo({
        top: scrollTop,
        behavior: 'smooth',
      })
    }
  }
})

// 点击歌词跳转
const seekTo = (time: number) => {
  playerStore.currentTime = time
  // 注意：AppFooterPlayerBar 中监听了 playerStore.currentTime 的变化，会自动同步到 audio 标签
}
</script>

<style scoped>
.lyrics-page {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 80px; /* 留出底部播放栏的高度 */
  z-index: 90; /* 比底部播放栏(100)低，但比普通内容高 */
  background-color: var(--el-bg-color); /* 使用 Element Plus 的背景色变量 */
  /* 增加一个渐变背景，让界面更现代 */
  background-image: linear-gradient(to bottom, var(--el-bg-color-page), var(--el-bg-color));
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.header {
  padding: 20px;
  display: flex;
  justify-content: flex-start;
  z-index: 10;
}

.close-btn {
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;
  color: var(--el-text-color-primary);
}

.close-btn:hover {
  background-color: var(--el-fill-color-dark);
}

/* 主布局 */
.main-container {
  flex: 1;
  display: flex;
  width: 100%;
  height: 100%;
  padding-bottom: 40px; /* 底部留白 */
}

.left-section {
  flex: 1;
  display: flex;
  justify-content: flex-end; /* CD 靠右 */
  align-items: center;
  height: 100%;
  padding-right: 80px; /* 距离中线的间距 */
}

.right-section {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  /* 左边距小，右边距大，视觉上让歌词左移靠近 CD */
  padding-left: 20px;
  padding-right: 140px;
}

/* CD 样式 */
.cd-wrapper {
  position: relative;
  width: 350px;
  height: 350px;
  border-radius: 50%;
  /* 模拟黑胶唱片质感：深色背景 + 边框 + 阴影 */
  background: #1a1a1a;
  border: 8px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;

  /* 动画设置 */
  animation: rotate 20s linear infinite;
  animation-play-state: paused; /* 默认暂停 */
}

/* 播放状态下旋转 */
.cd-wrapper.playing {
  animation-play-state: running;
}

.cd-disc {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  /* 增加径向渐变模拟唱片纹理 */
  background: radial-gradient(circle, #333 0%, #111 100%);
}

.cd-cover {
  width: 220px;
  height: 220px;
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  /* 保持图片比例 */
  object-fit: cover;
  transition: transform 0.3s;
}

.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #333;
  color: #666;
}

/* 右侧歌词区域 */
.lyrics-container {
  height: 100%;
  width: 100%;
  overflow-y: auto;
  text-align: center;
  padding: 50vh 0; /* 上下留白，确保第一句和最后一句能居中 */
  /* 隐藏滚动条但保留功能 */
  scrollbar-width: none; /* Firefox */
  position: relative; /* 确保 offsetTop 计算准确 */
  scroll-behavior: smooth;

  /* 核心实现：使用遮罩模拟“中间可见，两端渐隐”的效果 */
  /* 调整渐变节点，扩大中间可见区域，大约对应10行歌词的高度 */
  mask-image: linear-gradient(
    to bottom,
    transparent 0%,
    transparent 20%,
    black 30%,
    black 70%,
    transparent 80%,
    transparent 100%
  );
  -webkit-mask-image: linear-gradient(
    to bottom,
    transparent 0%,
    transparent 20%,
    black 30%,
    black 70%,
    transparent 80%,
    transparent 100%
  );
}

.lyrics-container::-webkit-scrollbar {
  display: none; /* Chrome/Safari */
}

.lyric-line {
  color: var(--el-text-color-secondary);
  font-size: 20px;
  line-height: 2.5; /* 增加行高，更易阅读 */
  transition: all 0.3s;
  cursor: pointer;
  opacity: 0.6;
  /* 默认稍微缩小 */
  transform: scale(0.95);
}

.lyric-line:hover {
  opacity: 0.8;
}

/* 高亮样式 */
.lyric-line.active {
  color: var(--el-color-primary); /* 使用主题色 */
  font-size: 30px; /* 放大字体 */
  font-weight: bold;
  opacity: 1;
  transform: scale(1.1); /* 放大效果 */
  text-shadow: 0 0 10px rgba(64, 158, 255, 0.3); /* 发光效果 */
}

.lyrics-placeholder .sub-text {
  font-size: 14px;
  opacity: 0.7;
}

/* 旋转动画 */
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 响应式调整：小屏幕上下布局 */
@media (max-width: 768px) {
  .main-container {
    flex-direction: column;
  }

  /* 移动端重置对齐和间距 */
  .left-section {
    justify-content: center;
    padding-right: 0;
  }

  .right-section {
    padding-left: 0;
    padding-right: 0;
  }

  .cd-wrapper {
    width: 240px;
    height: 240px;
    margin-bottom: 20px;
  }

  .cd-cover {
    width: 160px;
    height: 160px;
  }
}
</style>
