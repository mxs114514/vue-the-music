import { Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import multer from 'multer'
import path from 'path'
import fs from 'fs'

// --- 头像上传配置 ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(process.cwd(), 'public/avatars')
    // 确保目录存在
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    // 生成唯一文件名: userId-timestamp.ext
    // 注意：这里 req.user 可能还没被赋值（取决于中间件顺序），但在路由里我们会先过 authMiddleware
    // 为了安全，如果 req.user 不存在，就用随机数
    const userId = req.user?.id || 'unknown'
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    const ext = path.extname(file.originalname)
    cb(null, `avatar-${userId}-${uniqueSuffix}${ext}`)
  },
})

const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 限制 2MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('只允许上传图片文件'))
    }
  },
})

// 导出 multer 中间件供路由使用
export const uploadAvatarMiddleware = upload.single('file')

// --- 控制器方法 ---

// 获取当前用户信息
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id // authMiddleware 保证了 user 存在

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        nickname: true,
        role: true,
        avatar: true,
        bio: true,
        gender: true,
        birthday: true,
        region: true,
        createdAt: true,
        // 不返回 password
      },
    })

    if (!user) {
      res.status(404).json({ message: '用户不存在' })
      return
    }

    res.json(user)
  } catch (error) {
    console.error('获取用户信息失败:', error)
    res.status(500).json({ message: '服务器内部错误' })
  }
}

// 更新用户信息
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id
    const { nickname, bio, gender, birthday, region, avatar } = req.body

    // 准备更新数据
    const updateData: any = {
      nickname,
      bio,
      gender,
      region,
      avatar,
    }

    // 处理生日格式 (前端传 YYYY-MM-DD 字符串 -> Date)
    if (birthday) {
      updateData.birthday = new Date(birthday)
    }

    // 过滤掉 undefined 的字段 (只更新前端传过来的字段)
    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key]
    )

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        username: true,
        nickname: true,
        role: true,
        avatar: true,
        bio: true,
        gender: true,
        birthday: true,
        region: true,
        createdAt: true,
      },
    })

    res.json({ message: '更新成功', user: updatedUser })
  } catch (error) {
    console.error('更新用户信息失败:', error)
    res.status(500).json({ message: '服务器内部错误' })
  }
}

// 头像上传回调 (文件已由 multer 保存，这里只返回 URL)
export const handleAvatarUpload = (req: Request, res: Response): void => {
  if (!req.file) {
    res.status(400).json({ message: '未上传文件' })
    return
  }

  // 构造访问 URL
  // 假设静态资源托管在 /public 下，或者直接映射到根目录
  // 这里返回相对路径，前端拼接或后端配置静态服务前缀
  const fileUrl = `/avatars/${req.file.filename}`

  res.json({
    message: '上传成功',
    url: fileUrl,
  })
}
