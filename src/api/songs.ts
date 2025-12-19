import request from '@/utils/request'
type SearchInput = {
  search?: string
  album?: string
  uploaderId?: number
}

type UploadSong = {
  file: File
  cover?: File
  title?: string
  artist?: string
  album?: string
}

export const fetchSearchSongs = (searchInput: SearchInput) => {
  return request.get<any[]>('/songs', { params: searchInput })
}

export const uploadSong = (data: UploadSong) => {
  const formData = new FormData()
  formData.append('file', data.file)
  if (data.cover) {
    formData.append('cover', data.cover)
  }
  if (data.title) {
    formData.append('title', data.title)
  }
  if (data.artist) {
    formData.append('artist', data.artist)
  }
  if (data.album) {
    formData.append('album', data.album)
  }

  // 注意：不要手动设置 Content-Type，axios 会自动识别 FormData 并设置正确的 boundary
  return request.post('/songs/upload', formData)
}

export const recordPlay = (songId: number) => {
  return request.post(`/songs/${songId}/play`)
}

export const getPlayRank = (type: 'month' | 'year' | 'total' = 'total') => {
  return request.get<any[]>('/songs/rank', { params: { type } })
}
