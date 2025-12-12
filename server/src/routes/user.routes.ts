import { Router } from 'express'
import { authMiddleware } from '../middleware/auth.middleware'
import {
  getProfile,
  updateProfile,
  uploadAvatarMiddleware,
  handleAvatarUpload,
} from '../controllers/user.controller'

const router = Router()

// 所有路由都需要鉴权
router.use(authMiddleware)

// 获取当前用户信息
router.get('/profile', getProfile)

// 更新用户信息
router.put('/profile', updateProfile)

// 上传头像
router.post('/avatar', uploadAvatarMiddleware, handleAvatarUpload)

export default router
