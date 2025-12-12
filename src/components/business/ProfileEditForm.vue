<template>
  <el-form label-width="100px" style="max-width: 600px">
    <!-- 头像上传组件 -->
    <el-form-item label="头像">
      <AvatarUploader v-model="form.avatar" />
    </el-form-item>

    <el-form-item label="昵称">
      <el-input v-model="form.nickname" placeholder="请输入昵称" />
    </el-form-item>

    <el-form-item label="简介">
      <el-input v-model="form.bio" type="textarea" placeholder="请输入个人简介" />
    </el-form-item>

    <el-form-item label="性别">
      <el-radio-group v-model="form.gender">
        <el-radio label="男">男</el-radio>
        <el-radio label="女">女</el-radio>
        <el-radio label="保密">保密</el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item label="生日">
      <el-date-picker
        v-model="form.birthday"
        type="date"
        placeholder="选择日期"
        style="width: 100%"
        value-format="YYYY-MM-DD"
      />
    </el-form-item>

    <el-form-item label="地区">
      <el-cascader
        v-model="form.region"
        :options="cityData"
        placeholder="请选择地区"
        style="width: 100%"
        clearable
      />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="handleSubmit" :loading="loading">保存</el-button>
      <el-button @click="$emit('cancel')">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { cityData } from '@/utils/city-data'
import AvatarUploader from './AvatarUploader.vue'
import type { User } from '@/types'

// 定义 Props
const props = defineProps<{
  initialUser: User | null
  loading?: boolean
}>()

// 定义 Emits
const emit = defineEmits<{
  (e: 'submit', data: any): void
  (e: 'cancel'): void
}>()

// 初始化表单数据
// 注意：这里我们把 region 数组和字符串的转换逻辑封装在组件内部
const form = reactive({
  nickname: '',
  bio: '',
  gender: '保密',
  birthday: '',
  region: [] as string[],
  avatar: ''
})

// 监听 initialUser 变化，初始化表单
watch(() => props.initialUser, (user) => {
  if (user) {
    form.nickname = user.nickname || user.username || '' // 如果没有昵称，默认显示用户名，或者留空？用户说“如果没有默认为用户”，这里作为初始值，可以填入 username 方便用户修改，或者填空。
    // 既然是“修改昵称”，如果当前没有昵称，填入 username 作为默认值比较友好，或者留空让用户自己填。
    // 根据需求“如果没有默认为用户”，在显示层是这样。在编辑层，如果为空，placeholder 会提示。
    // 让我们把初始值设为 user.nickname，如果为空字符串，用户看到的就是空的。
    form.nickname = user.nickname || user.username || ''
    form.bio = user.bio || ''
    form.gender = user.gender || '保密'
    form.birthday = user.birthday ? (String(user.birthday).split('T')[0] ?? '') : ''
    form.region = user.region ? user.region.split(' ') : []
    form.avatar = user.avatar || ''
  }
}, { immediate: true })

const handleSubmit = () => {
  // 转换数据格式，准备提交
  const submitData = {
    ...form,
    region: form.region.join(' ') // 数组转字符串
  }
  emit('submit', submitData)
}
</script>
