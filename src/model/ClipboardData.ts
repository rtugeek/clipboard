import { nanoid } from 'nanoid'

export type ClipboardType = 'text' | 'image' | 'file'

export class ClipboardData {
  /**
   * 剪切板内容，这是真实的内容
   */
  content: string = ''
  type: ClipboardType = 'text'
  labels: string[] = []
  createTime: Date
  updateTime: Date
  favorite: boolean = false
  useCount: number = 0
  id: string = ''
  /**
   * 最后一次使用时间
   */
  latestUseTime: Date

  constructor() {
    this.id = nanoid()
    this.createTime = new Date()
    this.updateTime = this.createTime
    this.latestUseTime = this.createTime
  }

  /**
   * 预览内容，防止剪切板内容过长，导致内存占用提升
   */
  getPreview() {
    return this.content.length > 120 ? `${this.content.substring(0, 120)}...` : this.content
  }

  static fromJson(json: any): ClipboardData {
    const clipboardData = new ClipboardData()
    Object.assign(clipboardData, json)
    return clipboardData
  }
}
