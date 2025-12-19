import { prisma } from './lib/prisma'
import fs from 'node:fs'
import path from 'node:path'

async function main() {
  console.log('🚀 开始更新歌词信息...')

  // 1. 定义路径
  // 源目录：项目根目录下的 public/上传测试/lyrics
  // process.cwd() 在 server 目录下运行，所以往上找两级到项目根目录 (根据实际运行位置调整)
  // 假设我们在 server 目录下运行 npm run xxx，process.cwd() 就是 server 目录
  // 项目根目录就是 path.join(process.cwd(), '..')
  const projectRoot = path.join(process.cwd(), '..')
  const sourceDir = path.join(projectRoot, 'public', '上传测试', 'lyrics')

  // 目标目录：server/public/lyrics
  const targetDir = path.join(process.cwd(), 'public', 'lyrics')

  console.log(`📂 源目录: ${sourceDir}`)
  console.log(`📂 目标目录: ${targetDir}`)

  // 2. 检查源目录是否存在
  if (!fs.existsSync(sourceDir)) {
    console.error(`❌ 找不到源目录: ${sourceDir}`)
    return
  }

  // 3. 确保目标目录存在
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true })
    console.log('✅ 创建目标目录')
  }

  // 4. 读取所有 lrc 文件
  const files = fs.readdirSync(sourceDir).filter((file) => file.toLowerCase().endsWith('.lrc'))
  console.log(`📝 发现 ${files.length} 个歌词文件`)

  let updatedCount = 0
  let notFoundCount = 0

  for (const file of files) {
    const sourcePath = path.join(sourceDir, file)
    const targetPath = path.join(targetDir, file)

    // 获取歌曲标题 (文件名不含后缀)
    const title = path.parse(file).name

    // 5. 复制文件
    try {
      fs.copyFileSync(sourcePath, targetPath)
      // console.log(`   已复制: ${file}`)
    } catch (e) {
      console.error(`❌ 复制失败 ${file}:`, e)
      continue
    }

    // 6. 更新数据库
    // 查找标题匹配的歌曲
    // 注意：这里假设数据库里的 title 和文件名完全一致
    const song = await prisma.song.findFirst({
      where: {
        title: title,
      },
    })

    if (song) {
      const lrcUrl = `/lyrics/${file}`
      await prisma.song.update({
        where: { id: song.id },
        data: { lrcUrl: lrcUrl },
      })
      console.log(`✅ 更新成功: [${title}] -> ${lrcUrl}`)
      updatedCount++
    } else {
      console.log(`⚠️ 未找到歌曲: [${title}] (数据库中不存在)`)
      notFoundCount++
    }
  }

  console.log('-----------------------------------')
  console.log(`🎉 处理完成!`)
  console.log(`✅ 成功更新: ${updatedCount} 首`)
  console.log(`⚠️ 未匹配到: ${notFoundCount} 首`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
