import { useAuthStore } from '@/stores/auth'

const BASE_URL = 'http://localhost:3000/api'

// 定义通用的请求选项接口
interface RequestOptions extends RequestInit {
  headers?: Record<string, string>
}

// 封装 fetch
async function request<T>(url: string, options: RequestOptions = {}): Promise<T> {
  // 1. 处理 URL (拼接 BaseURL)
  const fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`

  // 2. 处理 Headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  // 3. 自动添加 Token (如果有)
  const authStore = useAuthStore()
  if (authStore.token) {
    headers['Authorization'] = `Bearer ${authStore.token}`
  }

  // 4. 发起请求
  const response = await fetch(fullUrl, {
    ...options,
    headers,
  })

  // 5. 统一错误处理
  if (!response.ok) {
    let errorMessage = `HTTP Error: ${response.status}`
    try {
      const errorData = await response.json()
      errorMessage = errorData.message || errorMessage
    } catch (e) {
      // 忽略解析错误
    }

    // 处理 401 Token 过期
    if (response.status === 401) {
      authStore.logout()
    }

    throw new Error(errorMessage)
  }

  // 6. 解析响应数据
  return response.json()
}

// 导出便捷方法
export default {
  get: <T>(url: string) => request<T>(url, { method: 'GET' }),

  post: <T>(url: string, data: any) =>
    request<T>(url, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  put: <T>(url: string, data: any) =>
    request<T>(url, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: <T>(url: string) => request<T>(url, { method: 'DELETE' }),
}
