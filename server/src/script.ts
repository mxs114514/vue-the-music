// server/src/script.ts
import { prisma } from './lib/prisma'

async function main() {
  console.log('🗑️  正在清空旧数据...')
  // 1. 先清空旧数据 (注意顺序：先删子表 PlayRecord，再删主表 Song)
  await prisma.playRecord.deleteMany()
  await prisma.song.deleteMany()

  console.log('🌱 正在插入新数据...')
  // 2. 插入新数据
  await prisma.song.createMany({
    data: [
      {
        title: '大东北我的家乡 (交响乐版)',
        artist: '虚拟歌手A',
        album: '家乡的云',
        // 假设静态资源托管根目录为 public，则访问路径通常不需要 /public 前缀
        url: '/songs/金色大厅最带派交响乐大东北我的家乡.mp3',
        cover: '/covers/image.png',
        size: 3145728, // 3MB
        duration: 180, // 3分钟
      },
      {
        title: '测试歌曲2',
        artist: '虚拟歌手B',
        album: '测试专辑',
        url: 'https://music.163.com/song/media/outer/url?id=1457549563.mp3',
        cover: 'https://p2.music.126.net/W_5pM5h8n2-8_Q8_5z_5zw==/109951165525653240.jpg',
        duration: 240,
      },
      {
        title: '雌小鬼高速吟唱',
        artist: '虚拟歌手C',
        album: '网络热门',
        url: '/songs/雌小鬼高速吟唱.mp3',
        cover: 'https://p1.music.126.net/3n1b0wwp3PZ0k1b9K8q4ew==/109951163973104534.jpg',
        size: 2097152, // 2MB
        duration: 120,
      },
    ],
  })

  console.log('✅ 种子数据注入成功！')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
