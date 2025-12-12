// 歌曲接口
export interface Song {
  id: number
  title: string
  artist: string
  album?: string | null
  url: string
  cover?: string | null
  lrcUrl?: string | null
  duration?: number | null
  size: number
  playCount: number
  isDeleted: boolean
  createdAt: string // 前端接收到的 Date 通常是 ISO 字符串
  updatedAt: string
}

// 用户接口
export interface User {
  id: number
  username: string
  role: 'admin' | 'user'
  avatar?: string | null
  bio?: string | null
  gender?: string | null
  birthday?: string | null // ISO Date string
  region?: string | null
  createdAt: string
}

// 登录/注册成功后的响应数据
export interface AuthResponse {
  message: string
  token: string
  user: User
}

// 通用错误响应
export interface ApiError {
  message: string
}

// 播放记录接口
export interface PlayRecord {
  id: number
  songId: number
  userId?: number | null
  playedAt: string
}
