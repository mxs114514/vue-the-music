<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ElMessage } from 'element-plus'
import { User, Lock, View, Hide } from '@element-plus/icons-vue'

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)
const passwordVisible = ref(false)

const form = reactive({
  username: '',
  password: '',
})

const handleLogin = async () => {
  if (!form.username || !form.password) return ElMessage.warning('请输入用户名和密码')
  loading.value = true
  try {
    await authStore.login(form.username, form.password)
    ElMessage.success('登录成功')
    router.push('/')
  } catch (error: any) {
    ElMessage.error(error.message || '登录失败')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <el-form size="large" @submit.prevent="handleLogin">
    <h2 class="title">登录</h2>
    <el-form-item>
      <el-input v-model="form.username" placeholder="用户名" :prefix-icon="User" />
    </el-form-item>
    <el-form-item>
      <el-input
        v-model="form.password"
        :type="passwordVisible ? 'text' : 'password'"
        placeholder="密码"
        :prefix-icon="Lock"
      >
        <template #suffix>
          <el-icon class="el-input__icon" @click="passwordVisible = !passwordVisible" style="cursor: pointer">
            <component :is="passwordVisible ? View : Hide" />
          </el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-button type="primary" native-type="submit" :loading="loading" round class="btn">立即登录</el-button>
    <p class="social-text">让音乐连接你我</p>
  </el-form>
</template>

<style scoped>
.el-input {
  width: 350px;
}

/* 解决浏览器自动填充背景色变色的问题 */
:deep(.el-input__inner:-webkit-autofill) {
  -webkit-box-shadow: 0 0 0 1000px #fff inset !important;
}

.title {
  font-size: 2.2rem;
  color: var(--el-text-color-primary);
  margin-bottom: 10px;
}

.social-text {
  padding: 0.7rem 0;
  font-size: 1rem;
  color: var(--el-text-color-regular);
}

.btn {
  width: 150px;
  height: 49px;
  text-transform: uppercase;
  font-weight: 600;
  margin: 10px 0;
}
</style>
