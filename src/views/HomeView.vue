<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { usePlayerStore } from '@/stores/player'
import { storeToRefs } from 'pinia'
import dayjs from 'dayjs'
import type { Song } from '@/types'
import SongList from '@/components/business/SongList.vue' // 引入新组件
import { VideoPlay } from '@element-plus/icons-vue'

const playerStore = usePlayerStore()
const { songList, isLoading } = storeToRefs(playerStore)

// 用于展示的推荐歌曲列表
const recommendSongs = ref<Song[]>([])


// 生成今日推荐逻辑
const generateDailyRecommend = () => {
  if (songList.value.length === 0) return

  const today = dayjs().format('YYYY-MM-DD')
  const cachedDate = localStorage.getItem('daily_recommend_date')
  const cachedIds = localStorage.getItem('daily_recommend_ids')

  // 1. 检查缓存：如果是今天且有缓存，尝试恢复
  if (cachedDate === today && cachedIds) {
    try {
      const ids = JSON.parse(cachedIds) as number[]
      // 根据 ID 从 songList 中找到对应的歌曲对象
      // filter 保证即使缓存的 ID 在新歌单里找不到了（比如被删了）也不会报错
      const cachedSongs = songList.value.filter(s => ids.includes(s.id))

      // 如果缓存的歌曲数量合理（比如没有全部失效），就使用缓存
      if (cachedSongs.length > 0) {
        recommendSongs.value = cachedSongs
        return
      }
    } catch (e) {
      console.error('解析推荐缓存失败', e)
    }
  }

  // 2. 如果没有缓存或缓存失效，重新随机生成
  // 创建一个副本以免影响原数组
  const shuffled = [...songList.value].sort(() => 0.5 - Math.random())
  // 取前 10 首，如果不足 10 首则取全部
  const selected = shuffled.slice(0, 10)

  recommendSongs.value = selected

  // 3. 保存到缓存
  const selectedIds = selected.map(s => s.id)
  localStorage.setItem('daily_recommend_date', today)
  localStorage.setItem('daily_recommend_ids', JSON.stringify(selectedIds))
}

onMounted(async () => {
  // 如果 store 里没数据，先拉取
  if (songList.value.length === 0) {
    await playerStore.fetchSongList()
  }
  // 数据准备好后，生成推荐
  generateDailyRecommend()
})

// 监听 songList 变化（防止首次加载时 onMounted 执行时数据还没回来）
watch(songList, () => {
  if (recommendSongs.value.length === 0) {
    generateDailyRecommend()
  }
})
</script>

<template>
    <div class="home-view">
      <h1 class="page-title">今日推荐</h1>

      <!-- 使用封装的业务组件 -->
      <SongList
        :songs="recommendSongs"
        :loading="isLoading"
        empty-text="暂无推荐歌曲"
      >
        <template #prepend>
          <el-card
            class="song-card random-card"
            :body-style="{ padding: '10px' }"
            shadow="hover"
            @click="playerStore.playRandomSong()"
          >
            <div class="cover-wrapper random-cover">
              <el-image
                src="/imgs/随机一哈.png"
                class="random-bg-img"
                fit="cover"
              />
              <div class="random-icon-wrapper">
                <el-icon><VideoPlay /></el-icon>
              </div>
            </div>
            <div class="info">
              <h3 class="title">随机一哈</h3>
              <p class="artist">点击随机哈气</p>
            </div>
          </el-card>
        </template>
      </SongList>
    </div>
</template>

<style scoped>
.home-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.page-title {
  font-size: 24px;
  font-weight: bold;
  margin: 0;
  margin-bottom: 20px;
  color: var(--text-color);
}

/* 复用 SongList 内部的卡片样式，这里需要重新定义一下 random-card 特有的样式 */
/* 注意：由于 SongList 使用了 scoped 样式，我们这里定义的样式需要作用于插槽内容 */
/* 为了方便，我们直接在这里定义 random-card 的样式 */

.random-card {
  cursor: pointer;
  transition: all 0.3s;
  border: none;
  background-color: var(--el-bg-color);
}
.random-card:hover {
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

.random-cover {
  position: relative; /* 确保子元素绝对定位相对于它 */
  background: linear-gradient(135deg, var(--el-color-primary-light-3), var(--el-color-primary));
  display: flex;
  justify-content: center;
  align-items: center;
}

.random-bg-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1; /* 图片在底层 */
}

.random-icon-wrapper {
  position: relative; /* 相对定位，确保在图片之上 */
  z-index: 2; /* 图标在上层 */
  display: flex;
  justify-content: center;
  align-items: center;
}

.random-icon-wrapper .el-icon {
  font-size: 48px;
  color: white;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
}

.info .title {
  margin: 0 0 4px 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.info .artist {
  margin: 0;
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.song-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.song-item {
  background: #fff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  cursor: pointer;
  transition: all 0.2s;
}

.song-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.cover {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 4px;
  object-fit: cover;
  margin-bottom: 10px;
  background-color: #f0f0f0;
}

.info h3 {
  margin: 0 0 5px 0;
  font-size: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.info p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.loading, .empty {
  padding: 50px;
  text-align: center;
  color: #999;
}
</style>
