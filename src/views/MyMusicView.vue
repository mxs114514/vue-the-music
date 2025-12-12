<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { Song } from '@/types'
import SongList from '@/components/business/SongList.vue'
import { getMyFavorites } from '@/api/favorite'

const favoriteSongs = ref<Song[]>([])
const isLoading = ref(false)

const fetchFavorites = async () => {
  isLoading.value = true
  try {
    const res = await getMyFavorites()
    // @ts-ignore
    const list = res.data || res
    favoriteSongs.value = list
  } catch (error) {
    console.error('获取收藏列表失败', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchFavorites()
})
</script>

<template>
  <div class="my-music-view">
    <h1 class="page-title">我喜欢的音乐</h1>

    <SongList
      :songs="favoriteSongs"
      :loading="isLoading"
      empty-text="还没有收藏歌曲，快去添加吧！"
    />
  </div>
</template>

<style scoped>
.my-music-view {
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
</style>
