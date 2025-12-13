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
  // TODO 1: 从 route.query 中获取 search 参数，赋值给 keyword
  // const query = ...

  // 如果没有关键词，就直接返回，不发请求
  if (!query) return

  loading.value = true
  try {
    // TODO 2: 调用 fetchSearchSongs 接口
    // const res = ...
    // songs.value = ...
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

// TODO 3: 监听路由参数变化
// 如果用户在当前页又搜了新词，URL 会变，但组件不会重新创建。
// 所以我们需要 watch(() => route.query.search, ... )
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
