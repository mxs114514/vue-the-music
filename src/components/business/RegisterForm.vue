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
const confirmPasswordVisible = ref(false)

const form = reactive({
  username: '',
  password: '',
  confirmPassword: '',
})

const handleRegister = async () => {
  if (!form.username || !form.password) return ElMessage.warning('请输入用户名和密码')
  if (form.password !== form.confirmPassword) return ElMessage.warning('两次输入的密码不一致')

  console.log('🚀 [Register] 开始注册流程', { username: form.username })
  loading.value = true
  try {
    console.log('📡 [Register] 调用 authStore.register...')
    await authStore.register(form.username, form.password)
    console.log('✅ [Register] 注册成功')

    ElMessage.success('注册成功，请切换到登录页进行登录')
    // 清空表单
    form.username = ''
    form.password = ''
    form.confirmPassword = ''
  } catch (error: any) {
    console.error('❌ [Register] 注册失败:', error)
    ElMessage.error(error.message || '注册失败')
  } finally {
    loading.value = false
    console.log('🏁 [Register] 流程结束')
  }
}
</script>

<template>
  <el-form size="large" @submit.prevent="handleRegister">
    <h2 class="title">注册</h2>
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
    <el-form-item>
      <el-input
        v-model="form.confirmPassword"
        :type="confirmPasswordVisible ? 'text' : 'password'"
        placeholder="确认密码"
        :prefix-icon="Lock"
      >
        <template #suffix>
          <el-icon class="el-input__icon" @click="confirmPasswordVisible = !confirmPasswordVisible" style="cursor: pointer">
            <component :is="confirmPasswordVisible ? View : Hide" />
          </el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-button type="primary" native-type="submit" :loading="loading" round class="btn">立即注册</el-button>
    <p class="social-text">加入我们，开启音乐之旅</p>
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
