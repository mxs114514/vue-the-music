import { defineStore } from 'pinia'
import { ref } from 'vue'
import request from '@/utils/request'
import type { User, AuthResponse } from '@/types'

export const useAuthStore = defineStore(
  'auth',
  () => {
    const token = ref<string>('')
    const user = ref<User | null>(null)

    // 登录
    const login = async (username: string, password: string) => {
      try {
        // 使用泛型指定返回类型为 AuthResponse
        const res = await request.post<AuthResponse>('/auth/login', {
          username,
          password,
        })

        // 保存状态
        if (res.token) {
          token.value = res.token
        }
        if (res.user) {
          user.value = res.user as User
        }

        ElNotification.success({
          title: '成功',
          message: '登录成功',
          duration: 1000,
        })
        return true
      } catch (error) {
        console.error('登录失败:', error)
        throw error
      }
    }

    // 注册
    const register = async (username: string, password: string) => {
      try {
        // 注册接口也返回 AuthResponse (包含 token 和 user)
        await request.post<AuthResponse>('/auth/register', {
          username,
          password,
        })

        // 注册成功后不自动登录，而是返回 true 让组件处理跳转
        ElNotification.success({
          title: '成功',
          message: '注册成功',
          duration: 1000,
        })
        return true
      } catch (error) {
        console.error('注册失败:', error)
        throw error
      }
    }

    // 登出
    const logout = () => {
      token.value = ''
      user.value = null
      // 可以选择跳转回登录页
      // router.push('/login')
    }

    const fetchUserProfile = async () => {
      try {
        const data = await request.get<User>('/user/profile')
        user.value = data
      } catch (error) {
        console.error('获取用户信息失败:', error)
      }
    }

    // 更新用户信息
    const updateUserProfile = async (data: Partial<User>) => {
      try {
        const res = await request.put<{ message: string; user: User }>('/user/profile', data)
        // 更新成功后，直接更新本地 store，或者再次 fetch
        // 这里后端返回了新的 user 对象，直接更新最快
        if (res.user) {
          user.value = res.user
          ElNotification.success({
            title: '成功',
            message: '个人信息更新成功',
            duration: 1000,
          })
        }
        return true
      } catch (error) {
        console.error('更新用户信息失败:', error)
        throw error
      }
    }

    return {
      token,
      user,
      login,
      register,
      logout,
      fetchUserProfile,
      updateUserProfile,
    }
  },
  {
    // 开启持久化，刷新页面状态不丢失
    persist: true,
  }
)
