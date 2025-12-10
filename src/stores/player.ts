import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Song as SongType } from '@/types'
// 1. 定义歌曲接口 (跟数据库结构对应)

export const usePlayerStore = defineStore('player', () => {
  // 2. 定义状态
  const songList = ref<SongType[]>([])
  const isLoading = ref(false)
  const currentSong = ref<SongType | null>(null)

  const playSong = (song: SongType) => {
    currentSong.value = song
  }

  const fetchSongList = async (force = false) => {
    // 缓存策略：如果已有数据且不是强制刷新，则直接返回
    if (songList.value.length > 0 && !force) {
      console.log('⚡ [PlayerStore] 数据已存在，使用缓存，跳过请求')
      return
    }

    console.log('🚀 [PlayerStore] 开始获取歌曲列表...')
    isLoading.value = true
    try {
      const response = await fetch('/api/songs')
      console.log('📡 [PlayerStore] 接口响应状态:', response.status)

      const data = await response.json()
      console.log('📦 [PlayerStore] 获取到的数据:', data)

      songList.value = data
    } catch (error) {
      console.error('❌ [PlayerStore] 获取歌曲列表失败:', error)
    } finally {
      isLoading.value = false
      console.log('✅ [PlayerStore] 获取流程结束, isLoading:', isLoading.value)
    }
  }

  // 3. 返回状态和方法
  return {
    songList,
    isLoading,
    currentSong,
    playSong,
    fetchSongList,
  }
})
