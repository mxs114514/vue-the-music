import { Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// 密钥，实际项目中应该放在 .env 文件里，这里为了演示先写死
const JWT_SECRET = process.env.JWT_SECRET || 'my-super-secret-key'

// 注册逻辑
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body

    // 1. 检查必填项
    if (!username || !password) {
      res.status(400).json({ message: '用户名和密码不能为空' })
      return
    }

    // 2. 检查用户是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { username },
    })

    if (existingUser) {
      res.status(400).json({ message: '用户名已存在' })
      return
    }

    // 3. 密码加密 (Hash)
    // 10 是 salt rounds，数字越大越安全但也越慢，10 是个通用的标准值
    const hashedPassword = await bcrypt.hash(password, 10)

    // 4. 创建用户
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        // 默认头像
        avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
      },
    })

    // 5. 返回成功，不要返回密码！
    res.status(201).json({
      message: '注册成功',
      user: { id: user.id, username: user.username, avatar: user.avatar },
    })
  } catch (error) {
    console.error('注册错误:', error)
    res.status(500).json({ message: '服务器内部错误' })
  }
}

// 登录逻辑
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body

    // 1. 查找用户
    const user = await prisma.user.findUnique({
      where: { username },
    })

    if (!user) {
      res.status(401).json({ message: '用户名或密码错误' })
      return
    }

    // 2. 比对密码 (明文 vs 数据库里的密文)
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      res.status(401).json({ message: '用户名或密码错误' })
      return
    }

    // 3. 生成 Token (身份证)
    // 包含用户的 id 和 username，有效期 24 小时
    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    // 4. 返回 Token 和用户信息
    res.json({
      message: '登录成功',
      token,
      user: {
        id: user.id,
        username: user.username,
        avatar: user.avatar,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('登录错误:', error)
    res.status(500).json({ message: '服务器内部错误' })
  }
}
