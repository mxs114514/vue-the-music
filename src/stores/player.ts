import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { Song as SongType } from '@/types'
import request from '@/utils/request'
import { toggleFavorite as toggleFavoriteApi } from '@/api/favorite'
import { recordPlay as recordPlayApi } from '@/api/songs'
import { ElMessage } from 'element-plus'

const STORAGE_KEY = 'ccb-player-state'

export const usePlayerStore = defineStore('player', () => {
  // 2. 定义状态
  const songList = ref<SongType[]>([])
  const isLoading = ref(false)
  const currentSong = ref<SongType | null>(null)
  const currentTime = ref(0)
  const isPlaying = ref(false)
  const currenRate = ref(1.0)
  const currenVolume = ref(1.0)
  const isLyricsPageOpen = ref(false)

  // 切换收藏状态
  const toggleFavorite = async (song: SongType) => {
    try {
      const res = await toggleFavoriteApi(song.id)
      // 注意：request 拦截器已经解包了 response.data，所以这里直接使用 res
      // @ts-ignore
      const data = res.data || res

      const isFavorited = data.isFavorited
      const message = data.message

      // 更新传入歌曲对象的状态
      song.isFavorited = isFavorited

      // 如果当前播放的歌曲就是这首，也要同步更新
      if (currentSong.value?.id === song.id) {
        currentSong.value.isFavorited = isFavorited
      }

      // 如果播放列表中有这首歌，也要同步更新
      const listItem = songList.value.find((s) => s.id === song.id)
      if (listItem) {
        listItem.isFavorited = isFavorited
      }

      ElMessage({
        message: message,
        type: 'success',
        duration: 1000, // 1秒后消失
      })
    } catch (error) {
      // 错误处理已在 request 拦截器或组件中处理，这里可以忽略或打印
      console.error(error)
    }
  }

  const playSong = (song: SongType) => {
    currentSong.value = song
    currentTime.value = 0
    isPlaying.value = true

    // 记录播放次数
    recordPlayApi(song.id).catch((err) => {
      console.error('记录播放失败', err)
    })
  }
  // 下一首
  const nextSong = () => {
    if (!currentSong.value || songList.value.length === 0) return

    // 1. 找：当前歌曲的索引
    const currentIndex = songList.value.findIndex((s) => s.id === currentSong.value?.id)

    // 2. 算：下一个索引
    let nextIndex = currentIndex + 1
    // 边界处理：如果是最后一首，跳回第一首 (Loop)
    if (nextIndex >= songList.value.length) {
      nextIndex = 0
    }

    // 3. 取 & 播：取出对象并播放
    const targetSong = songList.value[nextIndex]
    if (targetSong) {
      playSong(targetSong)
    }
  }

  // 上一首
  const prevSong = () => {
    if (!currentSong.value || songList.value.length === 0) return

    const currentIndex = songList.value.findIndex((s) => s.id === currentSong.value?.id)

    let prevIndex = currentIndex - 1
    // 边界处理：如果是第一首，跳到最后一首
    if (prevIndex < 0) {
      prevIndex = songList.value.length - 1
    }

    const targetSong = songList.value[prevIndex]
    if (targetSong) {
      playSong(targetSong)
    }
  }

  // 随机播放一首
  const playRandomSong = () => {
    if (songList.value.length === 0) return
    const randomIndex = Math.floor(Math.random() * songList.value.length)
    const targetSong = songList.value[randomIndex]
    if (targetSong) {
      playSong(targetSong)
    }
  }

  const fetchSongList = async (force = false) => {
    // 缓存策略：如果已有数据且不是强制刷新，则直接返回
    if (songList.value.length > 0 && !force) {
      // console.log('⚡ [PlayerStore] 数据已存在，使用缓存，跳过请求')
      return
    }

    console.log('🚀 [PlayerStore] 开始获取歌曲列表...')
    isLoading.value = true
    try {
      const data = await request.get<SongType[]>('/songs')
      console.log('📦 [PlayerStore] 获取到的数据:', data)

      songList.value = data
    } catch (error) {
      console.error('❌ [PlayerStore] 获取歌曲列表失败:', error)
    } finally {
      isLoading.value = false
      console.log('✅ [PlayerStore] 获取流程结束, isLoading:', isLoading.value)
    }
  }

  // 保存状态到本地 (这是我们要调用的动作)
  const saveState = () => {
    const state = {
      song: currentSong.value,
      time: currentTime.value,
      volume: currenVolume.value,
      rate: currenRate.value,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }
  // 恢复状态 (初始化时自动运行)
  const restoreState = () => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        // 恢复歌曲
        if (parsed.song) currentSong.value = parsed.song
        // 恢复进度
        if (parsed.time) currentTime.value = parsed.time
        // 恢复音量
        if (parsed.volume !== undefined) currenVolume.value = parsed.volume
        // 恢复倍速
        if (parsed.rate !== undefined) currenRate.value = parsed.rate

        console.log('💾 [PlayerStore] 状态已恢复:', parsed)
      } catch (e) {
        console.error('读取缓存失败', e)
      }
    }
  }

  const toggleLyricsPage = () => {
    console.log('🔄 [PlayerStore] 切换歌词页面被调用。当前状态:', isLyricsPageOpen.value)
    isLyricsPageOpen.value = !isLyricsPageOpen.value
    console.log('✅ [PlayerStore] 新状态:', isLyricsPageOpen.value)
  }

  // === 3. 监听与触发 ===

  // 监听歌曲变化 -> 立即保存
  watch(currentSong, () => {
    saveState()
  })

  // 监听音量和倍速变化 -> 立即保存
  watch([currenVolume, currenRate], () => {
    saveState()
  })

  // 监听网页关闭/刷新 -> 保存进度
  // 注意：在 setup 中直接绑定事件是安全的，Pinia Store 初始化只执行一次
  window.addEventListener('beforeunload', () => {
    saveState()
  })

  // 初始化：立即尝试恢复
  restoreState()

  return {
    songList,
    isLoading,
    isPlaying,
    currentSong,
    currentTime,
    currenRate,
    currenVolume,
    isLyricsPageOpen,
    playSong,
    nextSong,
    prevSong,
    playRandomSong,
    fetchSongList,
    toggleFavorite,
    toggleLyricsPage,
  }
})
