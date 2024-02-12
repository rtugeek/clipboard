import * as console from 'node:console'
import dayjs from 'dayjs'
import type { ClipboardData } from '@/model/ClipboardData'

export interface DataChangeListener {
  onDataChanged(data: ClipboardData, action: 'delete' | 'update' | 'save'): void
}

export interface SearchOptions {
  keyword: string
  page: number
  size: number
}

export interface IClipboardDataRepository {
  initDatabase(): Promise<void>

  /**
   * save clipboard data
   * @param data
   */
  save(data: ClipboardData): void

  exists(content: string): Promise<boolean>

  /**
   * update clipboard data by id
   * @param data
   */
  update(data: ClipboardData): void

  /**
   * read clipboard data
   * @param id
   */
  get(id: string): Promise<ClipboardData | undefined>

  /**
   * @param latestUsedBefore  clear data before this time, if not set, clear all but remain favorite data
   * @return cleared data
   */
  clear(latestUsedBefore?: Date): Promise<ClipboardData[]>

  /**
   * delete clipboard data by id
   * @param id
   */
  delete(id: string): Promise<ClipboardData | undefined>

  /**
   * search clipboard data by keyword
   * @param options
   */
  search(options: SearchOptions): Promise<ClipboardData[]>

  // 添加观察者
  addDataChangeListener(listener: DataChangeListener): void

  // 移除观察者
  removeDataChangeListener(listener: DataChangeListener): void
}

/**
 * this is a simple implementation of ClipboardDataRepository, using IndexedDB
 */
export class ClipboardDataRepository implements IClipboardDataRepository {
  private readonly dbName: string = 'clipboard_database'
  private readonly objectStoreName: string = 'clipboard_data'
  private db: IDBDatabase | null = null

  constructor() {}

  // 观察者列表
  private dataChangeListeners: DataChangeListener[] = []

  // 添加观察者
  addDataChangeListener(listener: DataChangeListener): void {
    this.dataChangeListeners.push(listener)
  }

  // 移除观察者
  removeDataChangeListener(listener: DataChangeListener): void {
    this.dataChangeListeners = this.dataChangeListeners.filter(existingListener => existingListener !== listener)
  }

  private notifyDataChange(data: ClipboardData, action: 'delete' | 'update' | 'save'): void {
    this.dataChangeListeners.forEach((listener) => {
      listener.onDataChanged(data, action)
    })
  }

  async initDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1)

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result
        const objectStore = db.createObjectStore(this.objectStoreName, { keyPath: 'id' })
        objectStore.createIndex('updateTime', 'updateTime', { unique: false })
        objectStore.createIndex('createTime', 'createTime', { unique: false })
        objectStore.createIndex('latestUseTime', 'latestUseTime', { unique: false })
        objectStore.createIndex('useCount', 'useCount', { unique: false })
        objectStore.createIndex('type', 'type', { unique: false })
        objectStore.createIndex('favorite', 'favorite', { unique: false })
      }

      request.onsuccess = (event: Event) => {
        this.db = (event.target as IDBOpenDBRequest).result
        resolve()
      }

      request.onerror = () => {
        reject(new Error('Failed to open IndexedDB'))
      }
    })
  }

  private getObjectStore(mode: IDBTransactionMode): IDBObjectStore {
    if (!this.db) {
      throw new Error('IndexedDB not initialized.')
    }
    const transaction = this.db.transaction(this.objectStoreName, mode)
    return transaction.objectStore(this.objectStoreName)
  }

  save(data: ClipboardData): void {
    const objectStore = this.getObjectStore('readwrite')
    objectStore.add(data)
    this.notifyDataChange(data, 'save')
  }

  async search(options: SearchOptions): Promise<ClipboardData[]> {
    const objectStore = this.getObjectStore('readonly')
    const data: ClipboardData[] = []
    const lowerKeyword = options.keyword.toLowerCase()
    return new Promise((resolve) => {
      objectStore.index('latestUseTime').openCursor(null, 'prev').onsuccess = (event: Event) => {
        const cursor: IDBCursorWithValue | null = (event.target as IDBRequest).result
        if (cursor) {
          const clipboardData = cursor.value as ClipboardData
          const { content, labels } = clipboardData

          if (
            !options.keyword
            || content.toLowerCase().includes(lowerKeyword)
            || labels.some(label => label.toLowerCase().includes(lowerKeyword))
          ) {
            data.push(clipboardData)
          }

          cursor.continue()
        }
        else {
          const startIndex = (options.page - 1) * options.size
          const endIndex = startIndex + options.size
          resolve(data.slice(startIndex, endIndex))
        }
      }
    })
  }

  async get(id: string): Promise<ClipboardData | undefined> {
    const objectStore = this.getObjectStore('readonly')
    return new Promise((resolve, reject) => {
      const request = objectStore.get(id)
      request.onsuccess = (event: Event) => {
        const clipboardData: ClipboardData = (event.target as IDBRequest).result
        if (clipboardData) {
          resolve(clipboardData)
        }
        else {
          resolve(undefined)
        }
      }

      request.onerror = () => {
        reject(new Error('Failed to get ClipboardData'))
      }
    })
  }

  update(data: ClipboardData): void {
    data.updateTime = new Date()
    const objectStore = this.getObjectStore('readwrite')
    const request = objectStore.put(data)

    request.onerror = () => {
      console.error('Failed to update ClipboardData')
    }
    this.notifyDataChange(data, 'update')
  }

  async clear(latestUsedBefore?: Date): Promise<ClipboardData[]> {
    const objectStore = this.getObjectStore('readwrite')
    const clearedData: ClipboardData[] = []

    return new Promise((resolve) => {
      objectStore.openCursor().onsuccess = (event: Event) => {
        const cursor: IDBCursorWithValue | null = (event.target as IDBRequest).result
        if (cursor) {
          const clipboardData = cursor.value as ClipboardData
          let shouldDelete = false
          if (!clipboardData.favorite) {
            if (latestUsedBefore) {
              if (dayjs(clipboardData.latestUseTime).isBefore(latestUsedBefore)) {
                shouldDelete = true
              }
            }
            else {
              shouldDelete = true
            }
          }

          if (shouldDelete) {
            clearedData.push(clipboardData)
            cursor.delete()
            this.notifyDataChange(clipboardData, 'delete')
          }

          cursor.continue()
        }
        else {
          resolve(clearedData)
        }
      }
    })
  }

  async delete(id: string): Promise<ClipboardData | undefined> {
    const objectStore = this.getObjectStore('readwrite')

    return new Promise((resolve) => {
      const request = objectStore.get(id)
      request.onsuccess = (event: Event) => {
        const clipboardData: ClipboardData = (event.target as IDBRequest).result
        if (clipboardData) {
          objectStore.delete(id)
          resolve(clipboardData)
          this.notifyDataChange(clipboardData, 'delete')
        }
        else {
          resolve(undefined)
        }
      }

      request.onerror = () => {
        resolve(undefined)
      }
    })
  }

  exists(content: string): Promise<boolean> {
    const objectStore = this.getObjectStore('readonly')
    return new Promise((resolve) => {
      objectStore.openCursor().onsuccess = (event: Event) => {
        const cursor: IDBCursorWithValue | null = (event.target as IDBRequest).result
        if (cursor) {
          const clipboardData = cursor.value as ClipboardData
          if (clipboardData.content === content) {
            resolve(true)
          }
          cursor.continue()
        }
        else {
          resolve(false)
        }
      }
    })
  }
}

export const clipboardDataRepository: IClipboardDataRepository = new ClipboardDataRepository()
