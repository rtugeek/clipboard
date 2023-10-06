import dayjs from 'dayjs';
import { nanoid } from 'nanoid';

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
  id: string = '';

  constructor() {
    this.id = nanoid();
    this.createdAt = dayjs().toISOString();
    this.updatedAt = this.createdAt;
  }

  static fromJson(json: any): ClipboardData {
    const clipboardData = new ClipboardData();
    Object.assign(clipboardData, json);
    return clipboardData;
  }
}
