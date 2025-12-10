import express from 'express'
import cors from 'cors'
import songRoutes from './routes/song.routes.js'

const app = express()
const PORT = process.env.PORT || 3000

// 中间件
app.use(cors()) // 允许跨域
app.use(express.json())

// 静态资源托管 (让前端能访问到 /songs/xxx.mp3)
// 托管 server/public 目录
app.use(express.static('public'))

// 注册路由
app.use('/api/songs', songRoutes)

// 启动服务
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`)
})
