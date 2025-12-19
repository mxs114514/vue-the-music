<template>
  <div class="profile-view">
    <!-- 1. 顶部用户信息 -->
    <el-card class="user-info-card" shadow="hover">
      <el-row :gutter="20" align="middle">
        <!-- 左侧头像 -->
        <el-col :span="6" class="avatar-col">
          <el-avatar
            :size="120"
            :src="
              userInfo.avatar ||
              'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
            "
          />
        </el-col>

        <!-- 右侧信息 -->
        <el-col :span="18">
          <div class="user-header">
            <h2 class="nickname">{{ userInfo.nickname || userInfo.username }}</h2>
            <el-icon class="edit-icon" @click="$router.push('/edit-profile')">
              <Edit />
            </el-icon>
          </div>

          <el-descriptions :column="2" border>
            <el-descriptions-item label="简介" :span="2">{{
              userInfo.bio || '这个人很懒，什么都没有留下'
            }}</el-descriptions-item>
            <el-descriptions-item label="性别">{{
              userInfo.gender || '保密'
            }}</el-descriptions-item>
            <el-descriptions-item label="生日">{{
              formatBirthday(userInfo.birthday)
            }}</el-descriptions-item>
            <el-descriptions-item label="地区">{{
              userInfo.region || '未知'
            }}</el-descriptions-item>
          </el-descriptions>
        </el-col>
      </el-row>
    </el-card>

    <!-- 3. 我上传的音乐 -->
    <div class="section">
      <el-text size="large" tag="b" class="section-title">我上传的音乐</el-text>
      <SongList :songs="uploadedSongs" empty-text="暂无上传的音乐" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Edit } from '@element-plus/icons-vue'
import type { Song } from '@/types'
import { usePlayerStore } from '@/stores/player'
import { useAuthStore } from '@/stores/auth'
import SongList from '@/components/business/SongList.vue' // 引入新组件
import { fetchSearchSongs } from '@/api/songs'

const playerStore = usePlayerStore()
const authStore = useAuthStore()

// 从 store 获取用户信息
const userInfo = computed(
  () =>
    authStore.user || {
      username: '未登录',
      nickname: '', // 补充 nickname 默认值
      avatar: '',
      bio: '',
      gender: '',
      birthday: '',
      region: '',
    }
)

const uploadedSongs = ref<Song[]>([])

const formatBirthday = (dateStr: string | undefined | null) => {
  if (!dateStr) return '未设置'
  return dateStr.split('T')[0]
}

const fetchUploadedSongs = async () => {
  if (!authStore.user?.id) return
  try {
    const res = await fetchSearchSongs({ uploaderId: authStore.user.id })
    uploadedSongs.value = res
  } catch (error) {
    console.error('获取上传歌曲失败', error)
  }
}

onMounted(() => {
  fetchUploadedSongs()
})

const playSong = (song: Song) => {
  playerStore.playSong(song)
}
</script>

<style scoped>
.profile-view {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.user-info-card {
  margin-bottom: 30px;
}

.avatar-col {
  display: flex;
  justify-content: center;
  align-items: center;
}

.user-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.nickname {
  margin: 0;
  margin-right: 10px;
  font-size: 24px;
  color: var(--el-text-color-primary);
}

.edit-icon {
  cursor: pointer;
  font-size: 20px;
  color: var(--el-text-color-secondary);
  transition: color 0.3s;
}

.edit-icon:hover {
  color: var(--el-color-primary);
}

.section {
  margin-bottom: 30px;
}

.section-title {
  display: block;
  margin-bottom: 15px;
  font-size: 18px;
}

/* 复用 HomeView 的样式逻辑，但稍作调整以适应 Profile */
.song-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); /* 稍微小一点 */
  gap: 15px;
}

.song-item {
  cursor: pointer;
  transition: transform 0.2s;
  background-color: var(--el-bg-color);
  border: 1px solid var(--el-border-color-light);
}

.song-item:hover {
  transform: translateY(-5px);
}

.cover {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 4px;
  object-fit: cover;
  margin-bottom: 8px;
  background-color: #f0f0f0;
}

.info h3 {
  margin: 0 0 4px 0;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--el-text-color-primary);
}

.info p {
  margin: 0;
  color: var(--el-text-color-secondary);
  font-size: 12px;
}
</style>
