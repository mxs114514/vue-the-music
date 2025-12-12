import { defineStore } from 'pinia'
import { ref } from 'vue'
import request from '@/utils/request'
import type { Song, Album } from '@/types'

export const useAlbumStore = defineStore('album', () => {
  // State
  const albums = ref<Album[]>([])
  const currentAlbumSongs = ref<Song[]>([])
  const loadingAlbums = ref(false)
  const loadingSongs = ref(false)

  // Actions
  const fetchAlbums = async (force = false) => {
    // 如果已有数据且不强制刷新，则直接返回（缓存机制）
    if (albums.value.length > 0 && !force) return

    try {
      loadingAlbums.value = true
      const res = await request.get('/songs/albums')
      albums.value = res
    } catch (error) {
      console.error('获取专辑列表失败:', error)
    } finally {
      loadingAlbums.value = false
    }
  }

  const fetchAlbumSongs = async (albumName: string) => {
    // 每次获取新专辑详情前，先清空旧数据，避免闪烁
    currentAlbumSongs.value = []

    try {
      loadingSongs.value = true
      const res = await request.get('/songs', { params: { album: albumName } })
      currentAlbumSongs.value = res
    } catch (error) {
      console.error(`获取专辑 [${albumName}] 歌曲失败:`, error)
    } finally {
      loadingSongs.value = false
    }
  }

  return {
    albums,
    currentAlbumSongs,
    loadingAlbums,
    loadingSongs,
    fetchAlbums,
    fetchAlbumSongs,
  }
})
