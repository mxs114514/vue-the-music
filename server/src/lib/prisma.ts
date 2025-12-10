import { PrismaClient } from '../../prisma/generated/client/client.js'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import 'dotenv/config'

// 初始化 Prisma 适配器
// 根据 Prisma 7.1.0 的类型定义和源码，这里需要传入配置对象而不是 Database 实例
const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || 'file:./prisma/dev.db',
})

// 初始化 Prisma Client
export const prisma = new PrismaClient({ adapter })
