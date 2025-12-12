import { Request, Response } from 'express'
import { prisma } from '../lib/prisma.js'

// 切换收藏状态
export const toggleFavorite = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id
    const { songId } = req.body

    if (!userId) {
      res.status(401).json({ message: '未登录' })
      return
    }

    if (!songId) {
      res.status(400).json({ message: '缺少 songId' })
      return
    }

    // 检查是否已收藏
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_songId: {
          userId,
          songId: Number(songId),
        },
      },
    })

    if (existingFavorite) {
      // 取消收藏
      await prisma.favorite.delete({
        where: {
          userId_songId: {
            userId,
            songId: Number(songId),
          },
        },
      })
      res.json({ isFavorited: false, message: '已取消收藏' })
    } else {
      // 添加收藏
      await prisma.favorite.create({
        data: {
          userId,
          songId: Number(songId),
        },
      })
      res.json({ isFavorited: true, message: '已添加收藏' })
    }
  } catch (error) {
    console.error('Toggle favorite error:', error)
    res.status(500).json({ message: '操作失败' })
  }
}

// 获取我的收藏列表
export const getMyFavorites = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id
    if (!userId) {
      res.status(401).json({ message: '未登录' })
      return
    }

    const favorites = await prisma.favorite.findMany({
      where: { userId },
      include: {
        song: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // 格式化返回数据
    const result = favorites.map((f) => ({
      ...f.song,
      isFavorited: true, // 显式标记为已收藏
      favoritedAt: f.createdAt,
    }))

    res.json(result)
  } catch (error) {
    console.error('Get favorites error:', error)
    res.status(500).json({ message: '获取收藏列表失败' })
  }
}

// 获取收藏排行榜 (年榜/月榜)
export const getFavoriteRank = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type } = req.query // 'month' | 'year'
    const now = new Date()
    let startDate: Date
    let endDate: Date

    if (type === 'month') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1)
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1)
    } else if (type === 'year') {
      startDate = new Date(now.getFullYear(), 0, 1)
      endDate = new Date(now.getFullYear() + 1, 0, 1)
    } else {
      // 默认查询所有时间
      startDate = new Date(0)
      endDate = new Date(9999, 0, 1)
    }

    const groupResult = await prisma.favorite.groupBy({
      by: ['songId'],
      where: {
        createdAt: {
          gte: startDate,
          lt: endDate,
        },
      },
      _count: {
        songId: true,
      },
      orderBy: {
        _count: {
          songId: 'desc',
        },
      },
      take: 50,
    })

    const songIds = groupResult.map((item) => item.songId)
    const songs = await prisma.song.findMany({
      where: { id: { in: songIds } },
    })

    const rankList = groupResult.map((item) => {
      const song = songs.find((s) => s.id === item.songId)
      return {
        ...song,
        favoriteCount: item._count.songId,
      }
    })

    res.json(rankList)
  } catch (error) {
    console.error('Get favorite rank error:', error)
    res.status(500).json({ message: '获取收藏榜失败' })
  }
}
