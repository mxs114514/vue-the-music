import { Router } from 'express'
import { getSongs, getAlbums } from '../controllers/song.controller.js'
import { optionalAuthMiddleware } from '../middleware/auth.middleware.js'

const router = Router()

// GET /api/songs/albums - 获取专辑列表 (必须放在 /:id 之前)
router.get('/albums', getAlbums)

// GET /api/songs
// 使用可选认证：如果用户登录了，getSongs 就能拿到 userId，从而正确返回 isFavorited 状态
router.get('/', optionalAuthMiddleware, getSongs)

// GET /api/songs/search

export default router
