<template>
  <div class="album-view">
    <!-- 专辑详情模式 (歌曲列表) -->
    <AlbumDetail
      v-if="currentAlbumName"
      :album-name="currentAlbumName"
      :songs="currentAlbumSongs"
      :loading="loadingSongs"
      @back="goBack"
    />

    <!-- 专辑墙模式 -->
    <div v-else>
      <h1 class="page-title">专辑列表</h1>

      <AlbumList
        :albums="albums"
        :loading="loadingAlbums"
        @select="selectAlbum"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAlbumStore } from '@/stores/album'
import { storeToRefs } from 'pinia'
import AlbumList from '@/components/business/AlbumList.vue'
import AlbumDetail from '@/components/business/AlbumDetail.vue'

const route = useRoute()
const router = useRouter()
const albumStore = useAlbumStore()

// 使用 storeToRefs 保持响应性
const { albums, currentAlbumSongs, loadingAlbums, loadingSongs } = storeToRefs(albumStore)

// 计算当前选中的专辑名 (从路由参数获取)
const currentAlbumName = computed(() => route.query.album as string | undefined)

// 交互
const selectAlbum = (name: string) => {
  router.push({ query: { ...route.query, album: name } })
}

const goBack = () => {
  router.push({ query: { ...route.query, album: undefined } })
}

// 监听路由变化，自动加载数据
watch(currentAlbumName, (newName) => {
  if (newName) {
    albumStore.fetchAlbumSongs(newName)
  } else {
    // 如果回到了列表页，且列表为空（可能是直接进入详情页后返回的），则加载列表
    if (albums.value.length === 0) {
      albumStore.fetchAlbums()
    }
  }
}, { immediate: true })

// 初始化
onMounted(() => {
  if (!currentAlbumName.value) {
    albumStore.fetchAlbums()
  }
})
</script>

<style scoped>
.album-view {
  padding: 20px;
  color: var(--text-color);
}

.page-title {
  font-size: 24px;
  font-weight: bold;
  margin: 0; /* Reset margin for alignment */
  margin-bottom: 20px;
}
</style>
