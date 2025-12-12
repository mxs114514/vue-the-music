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
        token.value = res.token
        user.value = res.user

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
        const res = await request.post<AuthResponse>('/auth/register', {
          username,
          password,
        })

        // 注册成功后直接登录
        token.value = res.token
        user.value = res.user

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

    return {
      token,
      user,
      login,
      register,
      logout,
    }
  },
  {
    // 开启持久化，刷新页面状态不丢失
    persist: true,
  }
)
