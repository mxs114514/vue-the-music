import request from '@/utils/request'
type SearchInput = {
  search?: string
  album?: string
}

export const fetchSearchSongs = (searchInput: SearchInput) => {
  return request.get<any[]>('/songs', { params: searchInput })
}
