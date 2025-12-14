<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchSearchSongs } from '@/api/songs'
import SongList from '@/components/business/SongList.vue'
import type { Song } from '@/types'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const songs = ref<Song[]>([])
const keyword = ref('')

// 核心逻辑：执行搜索
const loadData = async () => {
  // 修正 1: 使用 route 而不是 $router
  const query = (route.query.search as string) || ''

  // 修正 2: 更新 keyword，以便在界面显示
  keyword.value = query

  // 如果没有关键词，就直接返回，不发请求
  if (!query) return

  loading.value = true
  try {
    // 修正 3: API 需要传对象 { search: query }，且需要 await
    const res = await fetchSearchSongs({ search: query })
    songs.value = res
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 生命周期：挂载时查一次
onMounted(() => {
  loadData()
})

// 修正 4: 使用 route 而不是 $route
watch(
  () => route.query.search,
  () => {
    loadData()
  }
)
</script>

<template>
  <div class="search-view p-4">
    <!-- 1. 顶部导航栏 -->
    <el-page-header @back="router.back()" class="mb-4">
      <template #content>
        <span class="text-large font-600 mr-3"> 搜索结果 </span>
        <span class="text-sm text-gray-400" v-if="keyword"> "{{ keyword }}" 的相关歌曲 </span>
      </template>
    </el-page-header>

    <!-- 2. 歌曲列表 (复用现有组件) -->
    <SongList :songs="songs" :loading="loading" empty-text="未找到相关歌曲，换个词试试？" />
  </div>
</template>
