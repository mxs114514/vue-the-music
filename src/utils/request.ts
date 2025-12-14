import axios, {
  type InternalAxiosRequestConfig,
  type AxiosResponse,
  type AxiosRequestConfig,
} from 'axios'

// 存储 Token 获取器和 Logout 处理器的变量
let getToken: () => string | null = () => null
let handleLogout: () => void = () => {}

// 初始化函数，用于注入 store 的逻辑
export const initRequest = (tokenGetter: () => string | null, logoutHandler: () => void) => {
  getToken = tokenGetter
  handleLogout = logoutHandler
}

// 1. 创建 axios 实例
const service = axios.create({
  // 使用 /api 前缀，配合 vite.config.ts 中的 proxy 转发到后端
  baseURL: '/api',
  timeout: 10000, // 请求超时时间
})

// 2. 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: any) => {
    return Promise.reject(error)
  }
)

// 3. 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    // 2xx 范围内的状态码都会触发该函数
    // 直接返回 data，进行"脱壳"处理
    return response.data
  },
  (error: any) => {
    // 超出 2xx 范围的状态码都会触发该函数
    const { response } = error

    let errorMessage = '请求失败'

    if (response) {
      // 请求已发出，服务器响应了状态码
      switch (response.status) {
        case 401:
          // 如果是登录接口报 401，说明是用户名或密码错误，不是 Token 过期
          // 注意：axios 的 config.url 可能是相对路径也可能是绝对路径，这里简单判断包含关系
          if (error.config?.url?.includes('/auth/login')) {
            errorMessage = response.data?.message || '用户名或密码错误'
          } else {
            // 其他接口报 401，才是 Token 过期或未登录
            handleLogout()
            errorMessage = '登录已过期，请重新登录'
          }
          break
        case 403:
          errorMessage = '没有权限访问'
          break
        case 404:
          errorMessage = '请求的资源不存在'
          break
        case 500:
          errorMessage = '服务器内部错误'
          break
        default:
          errorMessage = response.data?.message || `HTTP Error: ${response.status}`
      }
    } else {
      // 网络错误或请求被取消
      errorMessage = error.message || '网络连接异常'
    }

    // 使用 ElementPlus 进行错误提示
    ElNotification.error({
      title: '请求错误',
      message: errorMessage,
      duration: 1000,
    })
    console.error('❌ [Request Error]', errorMessage)

    return Promise.reject(new Error(errorMessage))
  }
)

// 4. 导出封装的方法，保持与原有 API 一致
export default {
  get: <T>(url: string, config?: AxiosRequestConfig) => service.get<T, T>(url, config),

  post: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    service.post<T, T>(url, data, config),

  put: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    service.put<T, T>(url, data, config),

  delete: <T>(url: string, config?: AxiosRequestConfig) => service.delete<T, T>(url, config),
}
