// server/src/script.ts
import { prisma } from './lib/prisma'
import fs from 'node:fs'
import path from 'node:path'

async function main() {
  console.log('🗑️  正在清空旧数据...')
  // 1. 先清空旧数据 (注意顺序：先删子表 PlayRecord，再删主表 Song)
  await prisma.playRecord.deleteMany()
  await prisma.song.deleteMany()

  console.log('📂 正在扫描本地文件...')

  // 定义资源目录路径 (假设脚本在 server 根目录下运行)
  const songsDir = path.join(process.cwd(), 'public', 'songs')
  const coversDir = path.join(process.cwd(), 'public', 'covers')

  // 检查目录是否存在
  if (!fs.existsSync(songsDir)) {
    console.error(`❌ 找不到歌曲目录: ${songsDir}`)
    return
  }

  // 获取所有音频文件
  const files = fs.readdirSync(songsDir).filter((file) => /\.(mp3|flac|wav|m4a)$/i.test(file))

  console.log(`📝 发现 ${files.length} 个音频文件，准备处理...`)

  const songsData = files.map((file) => {
    const filePath = path.join(songsDir, file)
    const stats = fs.statSync(filePath)
    const parsedPath = path.parse(file)
    const title = parsedPath.name // 文件名即标题 (不含后缀)

    // 尝试查找同名封面 (优先找 jpg，也可以支持 png)
    let coverPath = null
    const possibleExts = ['.jpg', '.png', '.jpeg', '.webp']

    for (const ext of possibleExts) {
      const coverName = `${title}${ext}`
      if (fs.existsSync(path.join(coversDir, coverName))) {
        coverPath = `/covers/${coverName}`
        break
      }
    }

    return {
      title: title,
      artist: '哈基米',
      album: '哈基米音乐',
      url: `/songs/${file}`,
      cover: coverPath,
      size: stats.size,
      duration: 0, // 暂无法获取时长，设为0
    }
  })

  if (songsData.length > 0) {
    console.log('🌱 正在插入新数据...')
    // 2. 插入新数据
    await prisma.song.createMany({
      data: songsData,
    })
    console.log(`✅ 成功导入 ${songsData.length} 首歌曲！`)

    // 打印前几个作为示例
    songsData.slice(0, 3).forEach((s) => console.log(`   - ${s.title} (封面: ${s.cover || '无'})`))
  } else {
    console.log('⚠️ 没有找到任何歌曲文件。')
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
