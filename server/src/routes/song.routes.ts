import { Router } from 'express'
import {
  getSongs,
  getAlbums,
  uploadSong,
  recordPlay,
  getPlayRank,
} from '../controllers/song.controller.js'
import { optionalAuthMiddleware, authMiddleware } from '../middleware/auth.middleware.js'
import { uploadMiddleware } from '../middleware/upload.middleware.js'

const router = Router()

// GET /api/songs/albums - 获取专辑列表 (必须放在 /:id 之前)
router.get('/albums', getAlbums)

// GET /api/songs/rank - 获取播放排行榜
router.get('/rank', getPlayRank)

// POST /api/songs/:id/play - 记录播放
router.post('/:id/play', optionalAuthMiddleware, recordPlay)

// GET /api/songs
// 使用可选认证：如果用户登录了，getSongs 就能拿到 userId，从而正确返回 isFavorited 状态
router.get('/', optionalAuthMiddleware, getSongs)

// POST /api/songs/upload - 上传歌曲 (必须登录)
// 使用 fields 处理多文件上传: file(音频), cover(图片)
router.post(
  '/upload',
  authMiddleware,
  uploadMiddleware.fields([
    { name: 'file', maxCount: 1 },
    { name: 'cover', maxCount: 1 },
  ]),
  uploadSong
)

// GET /api/songs/search

export default router
