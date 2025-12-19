export interface LyricLine {
  time: number
  text: string
}

/**
 * 解析 LRC 格式歌词
 * @param lrc LRC 字符串
 * @returns 解析后的歌词数组（按时间排序）
 */
export function parseLrc(lrc: string): LyricLine[] {
  const lines = lrc.split('\n')
  const result: LyricLine[] = []

  // 正则表达式：匹配 [mm:ss.xx] 或 [mm:ss.xxx]
  // 示例：[00:01.00] 或 [00:01.000]
  const timeReg = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/

  for (const line of lines) {
    const match = line.match(timeReg)
    if (!match) continue

    // 提取时间部分
    const min = parseInt(match[1])
    const sec = parseInt(match[2])
    const msStr = match[3]
    // 处理毫秒：如果是2位(50)则是0.5s，如果是3位(500)也是0.5s
    const ms = msStr.length === 2 ? parseInt(msStr) * 10 : parseInt(msStr)

    const time = min * 60 + sec + ms / 1000

    // 提取歌词文本部分 (去掉时间戳，并去除首尾空格)
    const text = line.replace(timeReg, '').trim()

    // 只有当有歌词内容时才加入（可选：有些纯音乐片段可能需要保留空行，看需求）
    if (text) {
      result.push({ time, text })
    }
  }

  return result
}
