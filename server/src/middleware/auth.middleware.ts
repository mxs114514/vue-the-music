import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

// 扩展 Express 的 Request 类型定义
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: {
        id: number
        username: string
      }
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'my-super-secret-key'

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  // 1. 获取 Authorization header
  const authHeader = req.headers.authorization

  if (!authHeader) {
    res.status(401).json({ message: '未提供认证令牌' })
    return
  }

  // 2. 解析 Bearer token
  // 格式通常是 "Bearer <token>"
  const token = authHeader.split(' ')[1]

  if (!token) {
    res.status(401).json({ message: '令牌格式错误' })
    return
  }

  try {
    // 3. 验证 token
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; username: string }

    // 4. 将用户信息挂载到 req 对象
    req.user = {
      id: decoded.userId,
      username: decoded.username,
    }

    next()
  } catch (error) {
    res.status(401).json({ message: '无效或过期的令牌' })
    return
  }
}

// 可选认证中间件：如果带了 Token 且有效，就解析用户；否则当做游客处理，不报错
export const optionalAuthMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    next()
    return
  }

  const token = authHeader.split(' ')[1]
  if (!token) {
    next()
    return
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; username: string }
    req.user = {
      id: decoded.userId,
      username: decoded.username,
    }
  } catch (error) {
    // Token 无效或过期，忽略错误，视为未登录用户
    // 不返回 401，以免阻塞公开接口的访问
  }

  next()
}
