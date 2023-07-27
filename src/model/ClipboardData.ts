import dayjs from 'dayjs';

export type ClipboardType = 'text' | 'image' | 'file';

export class ClipboardData {
  /**
   * 预览内容，防止剪切板内容过长，导致内存占用提升
   */
  preview: string = '';
  /**
   * 剪切板内容，这是真实的内容
   */
  content: string = '';
  type: ClipboardType = 'text';
  labels: string[] = [];
  createdAt: string;
  updatedAt: string;
  favorite: boolean = false;
  useCount: number = 0;

  constructor() {
    this.createdAt = dayjs().toISOString();
    this.updatedAt = this.createdAt;
  }
}
