import { Request, Response } from 'express'
import { prisma } from '../lib/prisma'

export const getAllSongs = async (req: Request, res: Response) => {
  try {
    const songs = await prisma.song.findMany({
      orderBy: { createdAt: 'desc' },
    })
    res.json(songs)
  } catch (error) {
    console.error('获取歌曲列表失败:', error)
    res.status(500).json({ error: '服务器内部错误' })
  }
}
