import express from 'express'
import cors from 'cors'
import songRoutes from './routes/song.routes.js'
import authRoutes from './routes/auth.routes.js' // 1. 引入 auth 路由

const app = express()
const PORT = process.env.PORT || 3000

// 中间件
app.use(cors())
app.use(express.json())
app.use(express.static('public'))

// 注册路由
app.use('/api/songs', songRoutes)
app.use('/api/auth', authRoutes)

// 启动服务
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`)
})
