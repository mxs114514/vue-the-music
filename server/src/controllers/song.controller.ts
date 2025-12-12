import { Request, Response } from 'express'
import { prisma } from '../lib/prisma'

// 获取歌曲列表 (支持分页、搜索、以及按专辑筛选)
export const getSongs = async (req: Request, res: Response) => {
  try {
    // 从查询参数中获取 album
    const { search, album } = req.query

    // 构建查询条件
    const where: any = {
      isDeleted: false,
    }

    // 1. 如果前端传了 album 参数，就只查这个专辑的歌
    if (album) {
      where.album = String(album)
    }

    // 2. 如果有搜索关键词 (保持原有逻辑)
    if (search) {
      where.OR = [
        { title: { contains: String(search) } },
        { artist: { contains: String(search) } },
        { album: { contains: String(search) } },
      ]
    }

    const songs = await prisma.song.findMany({
      where,
      orderBy: {
        createdAt: 'desc', // 默认按创建时间倒序
      },
      include: {
        favoritedBy: {
          where: {
            userId: req.user?.id || 0, // 如果未登录，userId 为 undefined，这里用 0 查不到任何记录，符合预期
          },
          select: {
            userId: true, // 只需要知道有没有记录即可
          },
        },
      },
    })

    // 处理返回结果，添加 isFavorited 字段
    const result = songs.map((song) => ({
      ...song,
      isFavorited: song.favoritedBy.length > 0,
      favoritedBy: undefined, // 清理掉这个辅助字段，不返回给前端
    }))

    res.json(result)
  } catch (error) {
    console.error('获取歌曲列表失败:', error)
    res.status(500).json({ message: '获取歌曲列表失败' })
  }
}

// 获取专辑列表（包含封面和数量）
export const getAlbums = async (req: Request, res: Response) => {
  try {
    // 1. 获取每个专辑的歌曲数量
    const albumCounts = await prisma.song.groupBy({
      by: ['album'],
      _count: {
        id: true,
      },
      where: {
        album: { not: null, not: '' }, // 排除无专辑的歌
        isDeleted: false,
      },
    })

    // 提取所有专辑名列表
    const albumNames = albumCounts.map((a) => a.album).filter((n): n is string => !!n)

    if (albumNames.length === 0) {
      res.json([])
      return
    }

    // 2. 获取每个专辑的“最新”一首歌的封面
    // 原理：按 id 倒序排列(最新的在前)，然后 distinct 专辑名，Prisma 会取每组的第一条
    const latestSongs = await prisma.song.findMany({
      where: {
        album: { in: albumNames },
        isDeleted: false,
      },
      distinct: ['album'], // 按专辑去重
      orderBy: {
        id: 'desc', // 关键：倒序排列，确保取到的是 ID 最大的（最新的）那首
      },
      select: {
        album: true,
        cover: true,
      },
    })

    // 3. 组装数据
    const result = albumCounts.map((countItem) => {
      const name = countItem.album
      // 在 latestSongs 里找到对应的封面
      const latestSong = latestSongs.find((s) => s.album === name)

      return {
        name: name,
        count: countItem._count.id,
        cover: latestSong?.cover || null, // 这就是该专辑最新一首歌的封面
      }
    })

    // 按歌曲数量降序排序（可选：把歌多的专辑排前面）
    result.sort((a, b) => b.count - a.count)

    res.json(result)
  } catch (error) {
    console.error('获取专辑列表失败:', error)
    res.status(500).json({ message: '获取专辑列表失败' })
  }
}
