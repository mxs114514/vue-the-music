import multer from 'multer'
import path from 'path'
import fs from 'fs'

// 确保上传目录存在
const songsDir = path.join(process.cwd(), 'public/songs')
const coversDir = path.join(process.cwd(), 'public/covers')

;[songsDir, coversDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
})

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // 根据字段名决定存储目录
    if (file.fieldname === 'cover') {
      cb(null, coversDir)
    } else {
      cb(null, songsDir)
    }
  },
  filename: function (req, file, cb) {
    // 生成唯一文件名: 时间戳-原始文件名
    // 解决中文文件名乱码问题
    const originalName = Buffer.from(file.originalname, 'latin1').toString('utf8')
    const ext = path.extname(originalName)
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, uniqueSuffix + ext)
  },
})

const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  // 1. 处理封面图片
  if (file.fieldname === 'cover') {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('封面必须是图片文件!'), false)
    }
  }
  // 2. 处理音频文件
  else if (file.fieldname === 'file') {
    if (file.mimetype.startsWith('audio/') || file.mimetype === 'application/octet-stream') {
      cb(null, true)
    } else {
      cb(new Error('歌曲必须是音频文件!'), false)
    }
  } else {
    cb(new Error('未知的文件字段'), false)
  }
}

export const uploadMiddleware = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 限制 50MB
  },
})
