<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ArrowLeft } from '@element-plus/icons-vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'

const router = useRouter()
const authStore = useAuthStore()

const formRef = ref<FormInstance>()
const loading = ref(false)

const form = reactive({
  username: authStore.user?.username || '',
  password: '',
})

const rules = reactive<FormRules>({
  username: [
    { required: true, message: '请输入账号名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于 6 位', trigger: 'blur' },
  ],
})

const handleBack = () => {
  router.push('/settings')
}

const handleSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return

  await formEl.validate(async (valid, fields) => {
    if (valid) {
      loading.value = true
      try {
        // 构建更新数据
        const updateData: any = {}

        // 只有当用户名改变时才提交用户名
        if (form.username !== authStore.user?.username) {
          updateData.username = form.username
        }

        // 只有输入了密码才提交密码
        if (form.password) {
          updateData.password = form.password
        }

        // 如果没有修改任何内容
        if (Object.keys(updateData).length === 0) {
          ElMessage.info('未检测到变更')
          loading.value = false
          return
        }

        await authStore.updateUserProfile(updateData)

        // 成功提示 (updateUserProfile 内部已经有 success notification，但这里可以再加一个或者依赖那个)
        // 用户要求 "弹出类似于收藏歌曲成功的这种提示"，ElNotification.success 就是这种。
        // authStore.updateUserProfile 已经调用了 ElNotification.success
      } catch (error: any) {
        // 错误处理已在 store 或 request 中统一处理，但如果是用户名重复等特定错误，可以在这里额外处理
        // 这里假设 store 会抛出错误
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<template>
  <div class="reset-password-container">
    <div class="header">
      <el-button @click="handleBack" :icon="ArrowLeft" circle class="back-btn" />
      <h1 class="page-title">重置登陆信息</h1>
    </div>

    <div class="form-wrapper">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="80px"
        label-position="top"
        status-icon
      >
        <el-form-item label="账号名" prop="username">
          <el-input v-model="form.username" placeholder="请输入新的账号名" />
        </el-form-item>

        <el-form-item label="新密码" prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入新密码"
            show-password
          />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            @click="handleSubmit(formRef)"
            :loading="loading"
            class="submit-btn"
          >
            保存
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style scoped>
.reset-password-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 30px;
}

.page-title {
  font-size: 24px;
  font-weight: bold;
  margin: 0;
  color: var(--el-text-color-primary);
}

.form-wrapper {
  max-width: 500px;
  margin-left: 48px; /* 对齐标题文字 */
}

.submit-btn {
  width: 100%;
  margin-top: 20px;
}

/* 修复浏览器自动填充导致的背景变色问题 */
:deep(.el-input input:-webkit-autofill),
:deep(.el-input input:-webkit-autofill:hover),
:deep(.el-input input:-webkit-autofill:focus),
:deep(.el-input input:-webkit-autofill:active) {
  -webkit-box-shadow: 0 0 0 30px var(--el-input-bg-color, #ffffff) inset !important;
  -webkit-text-fill-color: var(--el-text-color-regular) !important;
  transition: background-color 5000s ease-in-out 0s;
}
</style>
