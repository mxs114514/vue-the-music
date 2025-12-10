<script setup lang="ts">
import { onMounted } from 'vue'
import { usePlayerStore } from '@/stores/player'
import { storeToRefs } from 'pinia'
import BasicLayout from '@/components/layout/BasicLayout.vue'

const playerStore = usePlayerStore()
const { songList, isLoading } = storeToRefs(playerStore)

onMounted(() => {
  playerStore.fetchSongList()
})
</script>

<template>
  <BasicLayout>
    <div class="home-view">
      <h2>推荐歌单</h2>

      <div v-if="isLoading" class="loading">
        数据加载中...
      </div>

      <div v-else-if="songList.length > 0" class="song-list">
        <el-card
          v-for="song in songList"
          :key="song.id"
          class="song-item"
          @click="playerStore.playSong(song)"
        >
          <img :src="song.cover || '/default-cover.png'" alt="cover" class="cover">
          <div class="info">
            <h3>{{ song.title }}</h3>
            <p>{{ song.artist }}</p>
          </div>
        </el-card>
      </div>

      <div v-else class="empty">
        暂无歌曲
      </div>
    </div>
  </BasicLayout>
</template>

<style scoped>
.home-view {
  max-width: 1200px;
  margin: 0 auto;
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
