<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ElMessageBox, ElMessage } from 'element-plus'

const router = useRouter()
const authStore = useAuthStore()

const handleLogout = () => {
  ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      authStore.logout()
      ElMessage.success('已退出登录')
      router.push('/login')
    })
    .catch(() => {
      // 取消操作
    })
}

const handleResetPassword = () => {
  router.push('/settings/reset-password')
}
</script>

<template>
  <div class="settings-container">
    <h2 class="page-title">设置</h2>

    <div class="settings-content">
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>账号安全</span>
          </div>
        </template>
        <div class="setting-item">
          <span class="label">重置登陆信息</span>
          <el-button type="primary" link @click="handleResetPassword">去重置</el-button>
        </div>
      </el-card>

      <el-card class="box-card" style="margin-top: 20px">
        <template #header>
          <div class="card-header">
            <span>系统设置</span>
          </div>
        </template>
        <div class="setting-item">
          <span class="label">当前账号</span>
          <el-button type="danger" @click="handleLogout">退出登录</el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<style scoped>
.settings-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.page-title {
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: bold;
  color: var(--el-text-color-primary);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
}

.label {
  color: var(--el-text-color-regular);
}
</style>
