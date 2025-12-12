<template>
  <div class="edit-profile-view">
    <h1>编辑个人信息</h1>

    <!-- 使用封装好的表单组件 -->
    <ProfileEditForm
      :initial-user="authStore.user"
      :loading="saving"
      @submit="handleSave"
      @cancel="handleCancel"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import ProfileEditForm from '@/components/business/ProfileEditForm.vue'

const router = useRouter()
const authStore = useAuthStore()
const saving = ref(false)

// 处理保存逻辑
const handleSave = async (formData: any) => {
  saving.value = true
  try {
    console.log('🚀 [EditProfile] 提交数据:', formData)

    // 调用 Store 中的 Action 更新用户信息
    await authStore.updateUserProfile(formData)

    ElMessage.success('保存成功')
    router.back()
  } catch (error) {
    console.error('保存失败:', error)
    ElMessage.error('保存失败')
  } finally {
    saving.value = false
  }
}

const handleCancel = () => {
  router.back()
}
</script>

<style scoped>
.edit-profile-view {
  padding: 20px;
}
</style>
