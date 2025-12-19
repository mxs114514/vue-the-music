<template>
  <div class="rank-view">
    <!-- 首页：榜单概览 -->
    <div v-if="!activeRank" class="rank-overview">
      <h2 class="page-title">排行榜</h2>

      <div class="rank-grid">
        <el-card
          v-for="rank in rankDefs"
          :key="rank.id"
          class="rank-card"
          shadow="hover"
          :body-style="{ padding: '0px', height: '100%' }"
        >
          <!-- 卡片头部背景 -->
          <div class="card-header" :style="{ background: rank.bgColor }">
            <div class="header-content">
              <h3 class="rank-title">{{ rank.title }}</h3>
              <div class="rank-icon">
                <el-icon><component :is="rank.icon" /></el-icon>
              </div>
            </div>
            <div class="header-mask"></div>
            <!-- 进入详情按钮 -->
            <div class="enter-btn" @click="openDetail(rank)">
              <el-icon><Right /></el-icon>
            </div>
          </div>

          <!-- 列表预览 (前3名) -->
          <div class="card-body" @click="openDetail(rank)">
            <div v-if="rankData[rank.id]?.length" class="preview-list">
              <div
                v-for="(song, index) in rankData[rank.id].slice(0, 3)"
                :key="song.id"
                class="preview-item"
              >
                <span class="rank-num" :class="'top-' + (index + 1)">{{ index + 1 }}</span>
                <span class="song-name">{{ song.title }}</span>
                <span class="artist-name">- {{ song.artist }}</span>
              </div>
            </div>
            <div v-else class="empty-state">
              <el-empty description="暂无数据" :image-size="60" />
            </div>
          </div>
        </el-card>
      </div>
    </div>

    <!-- 详情页 -->
    <div v-else class="rank-detail">
      <el-page-header @back="goBack" class="detail-header">
        <template #content>
          <span class="detail-title">{{ activeRank.title }}</span>
        </template>
      </el-page-header>

      <div v-loading="detailLoading">
        <!-- 前三名展示 (使用 SongList 组件，但只传前3个) -->
        <div v-if="activeDetailData.length > 0" class="top-section">
          <div class="section-title">
            <el-icon><Trophy /></el-icon> TOP 3
          </div>
          <SongList :songs="activeDetailData.slice(0, 3)" show-rank />
        </div>

        <!-- 剩余排名列表 (4-30) -->
        <div v-if="activeDetailData.length > 3" class="list-section">
          <div class="section-title">
            <el-icon><List /></el-icon> 完整榜单
          </div>

          <el-table
            :data="activeDetailData.slice(3)"
            style="width: 100%"
            :row-class-name="tableRowClassName"
            @row-click="handleRowClick"
          >
            <el-table-column label="排名" width="80">
              <template #default="scope">
                <span class="rank-index">{{ scope.$index + 4 }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="title" label="歌曲标题" min-width="200">
              <template #default="{ row }">
                <div class="song-cell">
                  <el-image :src="row.cover" class="small-cover" fit="cover" />
                  <span>{{ row.title }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="artist" label="歌手" width="180" />
            <el-table-column prop="album" label="专辑" width="180" />
            <el-table-column label="数据" width="120" align="right">
              <template #default="{ row }">
                <span v-if="activeRank.category === 'play'" class="data-val">
                  <el-icon><Headset /></el-icon> {{ row.playCount }}
                </span>
                <span v-else class="data-val">
                  <el-icon><StarFilled /></el-icon> {{ row.favoriteCount || 0 }}
                </span>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <el-empty v-if="activeDetailData.length === 0" description="暂无上榜歌曲" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import {
  Right,
  Trophy,
  List,
  Headset,
  StarFilled,
  DataLine,
  Timer,
  Calendar,
} from '@element-plus/icons-vue'
import { getPlayRank } from '@/api/songs'
import { getFavoriteRank } from '@/api/favorite'
import SongList from '@/components/business/SongList.vue'
import { usePlayerStore } from '@/stores/player'
import type { Song } from '@/types'

// 定义榜单类型
interface RankDef {
  id: string
  title: string
  category: 'play' | 'favorite'
  api: Function
  arg: 'month' | 'year' | 'total'
  bgColor: string
  icon: any
}

// 榜单配置
const rankDefs: RankDef[] = [
  {
    id: 'play_month',
    title: '播放月榜',
    category: 'play',
    api: getPlayRank,
    arg: 'month',
    bgColor: 'linear-gradient(135deg, #409EFF, #79bbff)',
    icon: Calendar,
  },
  {
    id: 'play_year',
    title: '播放年榜',
    category: 'play',
    api: getPlayRank,
    arg: 'year',
    bgColor: 'linear-gradient(135deg, #67C23A, #95d475)',
    icon: Timer,
  },
  {
    id: 'play_total',
    title: '播放总榜',
    category: 'play',
    api: getPlayRank,
    arg: 'total',
    bgColor: 'linear-gradient(135deg, #E6A23C, #f3d19e)',
    icon: DataLine,
  },
  {
    id: 'fav_month',
    title: '收藏月榜',
    category: 'favorite',
    api: getFavoriteRank,
    arg: 'month',
    bgColor: 'linear-gradient(135deg, #F56C6C, #fab6b6)',
    icon: Calendar,
  },
  {
    id: 'fav_year',
    title: '收藏年榜',
    category: 'favorite',
    api: getFavoriteRank,
    arg: 'year',
    bgColor: 'linear-gradient(135deg, #909399, #c8c9cc)',
    icon: Timer,
  },
  {
    id: 'fav_total',
    title: '收藏总榜',
    category: 'favorite',
    api: getFavoriteRank,
    arg: 'total',
    bgColor: 'linear-gradient(135deg, #d4237a, #e65d9b)',
    icon: StarFilled,
  },
]

// 状态
const rankData = ref<Record<string, Song[]>>({})
const activeRank = ref<RankDef | null>(null)
const activeDetailData = ref<Song[]>([])
const detailLoading = ref(false)
const playerStore = usePlayerStore()

// 初始化加载所有榜单的前3名
onMounted(async () => {
  // 并行加载所有榜单数据
  const promises = rankDefs.map(async (def) => {
    try {
      const res = await def.api(def.arg)
      // @ts-ignore
      const data = res.data || res
      rankData.value[def.id] = data
    } catch (e) {
      console.error(`Failed to load rank ${def.id}`, e)
      rankData.value[def.id] = []
    }
  })
  await Promise.all(promises)
})

// 打开详情
const openDetail = async (rank: RankDef) => {
  activeRank.value = rank
  detailLoading.value = true

  // 如果已有数据，先显示缓存的（虽然可能不全，但这里我们假设首页加载的是Top 50，所以直接用）
  // 后端接口目前是 take: 50，所以首页加载的数据其实就是完整数据
  if (rankData.value[rank.id]) {
    activeDetailData.value = rankData.value[rank.id]
  } else {
    // 重新请求（防备万一）
    try {
      const res = await rank.api(rank.arg)
      // @ts-ignore
      activeDetailData.value = res.data || res
    } catch (e) {
      activeDetailData.value = []
    }
  }

  detailLoading.value = false
}

// 返回
const goBack = () => {
  activeRank.value = null
  activeDetailData.value = []
}

// 表格行点击播放
const handleRowClick = (row: Song) => {
  playerStore.playSong(row)
}

const tableRowClassName = () => 'song-row'
</script>

<style scoped>
.rank-view {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  margin-bottom: 24px;
  font-size: 24px;
  color: var(--el-text-color-primary);
}

/* 网格布局 */
.rank-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.rank-card {
  height: 220px;
  border: none;
  overflow: hidden;
  transition: transform 0.3s;
  cursor: pointer;
}

.rank-card:hover {
  transform: translateY(-5px);
}

/* 卡片头部 */
.card-header {
  height: 80px;
  position: relative;
  padding: 16px 20px;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-content {
  z-index: 2;
}

.rank-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.rank-icon {
  font-size: 24px;
  opacity: 0.8;
  margin-top: 4px;
}

.header-mask {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4=');
  z-index: 1;
}

.enter-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: background 0.3s;
  z-index: 3;
}

.enter-btn:hover {
  background: rgba(255, 255, 255, 0.4);
}

/* 卡片内容 */
.card-body {
  padding: 16px 20px;
  height: calc(100% - 80px);
  background: var(--el-bg-color);
}

.preview-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.preview-item {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: var(--el-text-color-regular);
  white-space: nowrap;
  overflow: hidden;
}

.rank-num {
  font-weight: bold;
  margin-right: 10px;
  width: 16px;
  text-align: center;
}

.rank-num.top-1 {
  color: #f56c6c;
}
.rank-num.top-2 {
  color: #e6a23c;
}
.rank-num.top-3 {
  color: #409eff;
}

.song-name {
  color: var(--el-text-color-primary);
  font-weight: 500;
  margin-right: 6px;
}

.artist-name {
  color: var(--el-text-color-secondary);
  font-size: 12px;
}

/* 详情页样式 */
.detail-header {
  margin-bottom: 30px;
}

.detail-title {
  font-size: 20px;
  font-weight: 600;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--el-text-color-primary);
}

.top-section {
  margin-bottom: 40px;
  background: var(--el-fill-color-light);
  padding: 20px;
  border-radius: 12px;
}

.list-section {
  background: var(--el-bg-color);
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.small-cover {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  margin-right: 12px;
  vertical-align: middle;
}

.song-cell {
  display: flex;
  align-items: center;
}

.rank-index {
  font-weight: bold;
  color: var(--el-text-color-secondary);
}

.data-val {
  font-family: monospace;
  font-weight: 600;
  color: var(--el-text-color-secondary);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
}

:deep(.song-row) {
  cursor: pointer;
}
</style>
