import { Router } from 'express'
import {
  toggleFavorite,
  getMyFavorites,
  getFavoriteRank,
} from '../controllers/favorite.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'

const router = Router()

// 获取排行榜不需要登录 (或者根据需求决定，这里假设公开)
router.get('/rank', getFavoriteRank)

// 需要登录的接口
router.post('/toggle', authMiddleware, toggleFavorite)
router.get('/my', authMiddleware, getMyFavorites)

export default router
