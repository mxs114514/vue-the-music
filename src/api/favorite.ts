import request from '@/utils/request'

// 切换收藏状态
export const toggleFavorite = (songId: number) => {
  return request.post<{ isFavorited: boolean; message: string }>('/favorites/toggle', { songId })
}

// 获取我的收藏列表
export const getMyFavorites = () => {
  return request.get<any[]>('/favorites/my')
}

// 获取收藏排行榜
export const getFavoriteRank = (type: 'month' | 'year' | 'total' = 'month') => {
  return request.get<any[]>('/favorites/rank', { params: { type } })
}
