<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>

<template>
  <header class="header">
    <div class="search-bar">
      <!-- 测试自动导入: el-input, el-icon, IEpSearch -->
      <el-input
        placeholder="搜索音乐..."
        class="search-input"
      >
        <template #prefix>
          <el-icon>
            <IEpSearch />
          </el-icon>
        </template>
      </el-input>
    </div>
    <div class="user-info">
      <el-text size="large" tag="b">{{ authStore.user?.nickname || authStore.user?.username || '未登录' }}</el-text>
      <el-avatar size="midium" :src="authStore.user?.avatar">
        <el-icon><IEpUserFilled /></el-icon>
      </el-avatar>
    </div>
  </header>
</template>

<style scoped>
.header {
  height: 60px;
  background-color: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color-light);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}
.search-bar input {
  padding: 8px 12px;
  border-radius: 20px;
  border: 1px solid var(--el-border-color);
  width: 300px;
  outline: none;
}
.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
