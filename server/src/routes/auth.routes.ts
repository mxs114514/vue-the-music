import { Router } from 'express'
import { register, login } from '../controllers/auth.controller.js'

const router = Router()

// 定义路由
// 最终访问路径将是: POST /api/auth/register
router.post('/register', register)

// 最终访问路径将是: POST /api/auth/login
router.post('/login', login)

export default router
