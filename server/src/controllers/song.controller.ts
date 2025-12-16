import { Request, Response } from 'express'
import { prisma } from '../lib/prisma.js' // 注意加 .js 后缀
import { parseFile } from 'music-metadata'
import path from 'path'
import fs from 'fs'

// 获取歌曲列表 (支持分页、搜索、以及按专辑筛选)
export const getSongs = async (req: Request, res: Response) => {
  try {
    // 从查询参数中获取 album
    const { search, album, uploaderId } = req.query
    const userId = req.user?.id // 获取当前登录用户ID

    // 构建查询条件
    const where: any = {
      isDeleted: false,
      // 改动：不再限制 uploaderId，所有歌曲对所有人可见
    }

    // 1. 如果前端传了 album 参数，就只查这个专辑的歌
    if (album) {
      where.album = String(album)
    }

    // 2. 如果前端传了 uploaderId，就只查该用户上传的歌
    if (uploaderId) {
      where.uploaderId = Number(uploaderId)
    }

    // 3. 如果有搜索关键词
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
            userId: req.user?.id || 0,
          },
          select: {
            userId: true,
          },
        },
        // 新增：返回上传者信息，方便前端展示“由 xxx 上传”
        uploader: {
          select: {
            nickname: true,
            username: true,
          },
        },
      },
    })

    // 处理返回结果
    const result = songs.map((song) => ({
      ...song,
      isFavorited: song.favoritedBy.length > 0,
      favoritedBy: undefined,
      isUploaded: song.uploaderId === userId, // 依然保留这个标记，用户可以删除自己上传的歌
      uploaderName: song.uploader?.nickname || song.uploader?.username || '系统', // 方便前端展示
      uploader: undefined,
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

// 新增：上传歌曲
export const uploadSong = async (req: Request, res: Response) => {
  try {
    // multer.fields 会把文件放在 req.files (对象) 中
    // 类型断言：req.files 是 { [fieldname: string]: Express.Multer.File[] }
    const files = req.files as { [fieldname: string]: Express.Multer.File[] }
    const audioFile = files?.['file']?.[0]
    const coverFile = files?.['cover']?.[0]

    if (!audioFile) {
      res.status(400).json({ message: '请选择音频文件' })
      return
    }

    const userId = req.user!.id // 经过 authMiddleware 肯定有 user
    const filePath = audioFile.path

    // 1. 解析音频元数据 (时长、比特率等)
    let duration = 0
    try {
      const metadata = await parseFile(filePath)
      duration = metadata.format.duration ? Math.round(metadata.format.duration) : 0
    } catch (e) {
      console.warn('解析音频元数据失败，使用默认值', e)
    }

    // 尝试从元数据获取标题和歌手，如果没有则用文件名
    // 文件名通常是 "歌手 - 歌名.mp3" 或 "歌名.mp3"
    let title = req.body.title || path.parse(audioFile.originalname).name
    let artist = req.body.artist || '未知歌手'

    // 简单的文件名解析尝试 (如果是 "Artist - Title" 格式)
    if (!req.body.title && !req.body.artist && title.includes('-')) {
      const parts = title.split('-')
      artist = parts[0].trim()
      title = parts.slice(1).join('-').trim()
    }

    // 2. 存入数据库
    const song = await prisma.song.create({
      data: {
        title,
        artist,
        album: req.body.album || '未知专辑', // 默认专辑名
        url: `/songs/${audioFile.filename}`, // 访问路径
        size: audioFile.size,
        duration,
        uploaderId: userId, // 关键：标记为私有
        // 如果上传了封面，用上传的；否则用默认的
        cover: coverFile ? `/covers/${coverFile.filename}` : '/covers/default_cover.jpg',
      },
    })

    res.json(song)
  } catch (error) {
    console.error('上传失败:', error)
    // 清理文件
    const files = req.files as { [fieldname: string]: Express.Multer.File[] }
    if (files?.['file']?.[0]) fs.unlinkSync(files['file'][0].path)
    if (files?.['cover']?.[0]) fs.unlinkSync(files['cover'][0].path)

    res.status(500).json({ message: '上传失败' })
  }
}

// 新增：记录播放
export const recordPlay = async (req: Request, res: Response) => {
  try {
    const songId = Number(req.params.id)
    const userId = req.user?.id

    if (isNaN(songId)) {
      res.status(400).json({ message: '无效的歌曲ID' })
      return
    }

    // 1. 创建播放记录
    await prisma.playRecord.create({
      data: {
        songId,
        userId, // 可以为空
      },
    })

    // 2. 增加歌曲播放计数 (原子操作)
    await prisma.song.update({
      where: { id: songId },
      data: {
        playCount: {
          increment: 1,
        },
      },
    })

    res.json({ success: true })
  } catch (error) {
    console.error('记录播放失败:', error)
    res.status(500).json({ message: '记录播放失败' })
  }
}

// 新增：获取播放排行榜
export const getPlayRank = async (req: Request, res: Response) => {
  try {
    const { type } = req.query // 'month' | 'year' | 'total'

    // 1. 总榜：直接查 Song 表 (利用 playCount 索引)
    if (!type || type === 'total') {
      const songs = await prisma.song.findMany({
        where: { isDeleted: false },
        orderBy: { playCount: 'desc' },
        take: 50,
        include: {
          uploader: {
            select: { nickname: true, username: true },
          },
        },
      })

      // 格式化
      const result = songs.map((s) => ({
        ...s,
        uploaderName: s.uploader?.nickname || s.uploader?.username || '系统',
        uploader: undefined,
      }))

      res.json(result)
      return
    }

    // 2. 月榜/年榜：查 PlayRecord 表聚合
    const now = new Date()
    let startDate: Date
    let endDate: Date

    if (type === 'month') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1)
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1)
    } else {
      // year
      startDate = new Date(now.getFullYear(), 0, 1)
      endDate = new Date(now.getFullYear() + 1, 0, 1)
    }

    const groupResult = await prisma.playRecord.groupBy({
      by: ['songId'],
      where: {
        playedAt: {
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

    // 获取歌曲详情
    const songIds = groupResult.map((item) => item.songId)
    const songs = await prisma.song.findMany({
      where: { id: { in: songIds } },
      include: {
        uploader: {
          select: { nickname: true, username: true },
        },
      },
    })

    // 组装结果 (保持排序顺序)
    const result = groupResult
      .map((item) => {
        const song = songs.find((s) => s.id === item.songId)
        if (!song) return null
        return {
          ...song,
          playCount: item._count.songId, // 使用该时间段内的播放量覆盖总播放量显示
          uploaderName: song.uploader?.nickname || song.uploader?.username || '系统',
          uploader: undefined,
        }
      })
      .filter(Boolean)

    res.json(result)
  } catch (error) {
    console.error('获取播放榜失败:', error)
    res.status(500).json({ message: '获取播放榜失败' })
  }
}
