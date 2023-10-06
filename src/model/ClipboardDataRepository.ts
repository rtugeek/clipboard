import type { ClipboardData } from '@/model/ClipboardData';
import dayjs from 'dayjs';

export interface IClipboardDataRepository {
  initDatabase(): Promise<void>;

  /**
   * save clipboard data
   * @param data
   */
  save(data: ClipboardData): void;

  /**
   * update clipboard data by id
   * @param data
   */
  update(data: ClipboardData): void;

  /**
   * read clipboard data
   * @param id
   */
  get(id: string): Promise<ClipboardData | undefined>;

  /**
   * clear all data, but remain favorite data
   * @return cleared data
   */
  clear(): Promise<ClipboardData[]>;

  /**
   * delete clipboard data by id
   * @param id
   */
  delete(id: string): Promise<ClipboardData | undefined>;

  /**
   * search clipboard data by keyword
   * 1.use labels and content as search source
   * 2.sort by createdAt desc(special case: always make favorite data at first)
   * @param keyword   search keyword, if keyword is empty, return all data
   * @param page      page number, start from 1
   * @param size      page size
   */
  search(keyword: string, page: number, size: number): Promise<ClipboardData[]>;

  /**
   * load clipboard data, and sort by createdAt desc(special case: always make favorite data at first)
   * @param page    page number, start from 1
   * @param size
   */
  load(page: number, size: number): Promise<ClipboardData[]>;
}

/**
 * this is a simple implementation of ClipboardDataRepository, using IndexedDB
 */
export class ClipboardDataRepository implements IClipboardDataRepository {
  private readonly dbName: string = 'clipboard_data_db';
  private readonly objectStoreName: string = 'clipboard_data';
  private db: IDBDatabase | null = null;

  constructor() {}

  async initDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;
        let objectStore = db.createObjectStore(this.objectStoreName, { keyPath: 'id' });
        objectStore.createIndex('createdAt', 'createdAt', { unique: false });
        objectStore.createIndex('updatedAt', 'updatedAt', { unique: false });
      };

      request.onsuccess = (event: Event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve();
      };

      request.onerror = () => {
        reject(new Error('Failed to open IndexedDB'));
      };
    });
  }

  private getObjectStore(mode: IDBTransactionMode): IDBObjectStore {
    if (!this.db) {
      throw new Error('IndexedDB not initialized.');
    }
    const transaction = this.db.transaction(this.objectStoreName, mode);
    return transaction.objectStore(this.objectStoreName);
  }

  save(data: ClipboardData): void {
    const objectStore = this.getObjectStore('readwrite');
    objectStore.add(data);
  }

  async search(keyword: string, page: number, size: number): Promise<ClipboardData[]> {
    const objectStore = this.getObjectStore('readonly');
    const data: ClipboardData[] = [];

    return new Promise((resolve) => {
      objectStore.openCursor().onsuccess = (event: Event) => {
        const cursor: IDBCursorWithValue | null = (event.target as IDBRequest).result;
        if (cursor) {
          const clipboardData = cursor.value as ClipboardData;
          const { content, labels } = clipboardData;

          if (!keyword || content.includes(keyword) || labels.some((label) => label.includes(keyword))) {
            data.push(clipboardData);
          }

          cursor.continue();
        } else {
          // Separate favorite and non-favorite items
          const favoriteItems = data.filter((item) => item.favorite);
          const nonFavoriteItems = data.filter((item) => !item.favorite);

          // Sort non-favorite items by createdAt (desc)
          nonFavoriteItems.sort((a, b) => dayjs(b.createdAt).diff(dayjs(a.createdAt)));

          // Concatenate favorite and non-favorite items, with favorites first
          const sortedData = [...favoriteItems, ...nonFavoriteItems];

          const startIndex = (page - 1) * size;
          const endIndex = startIndex + size;
          resolve(sortedData.slice(startIndex, endIndex));
        }
      };
    });
  }

  async load(page: number, size: number): Promise<ClipboardData[]> {
    const objectStore = this.getObjectStore('readonly');
    const data: ClipboardData[] = [];

    return new Promise((resolve) => {
      objectStore.index('createdAt').openCursor(null, 'prev').onsuccess = (event: Event) => {
        const cursor: IDBCursorWithValue | null = (event.target as IDBRequest).result;
        if (cursor) {
          const clipboardData = cursor.value as ClipboardData;
          data.push(clipboardData);
          cursor.continue();
        } else {
          // Separate favorite and non-favorite items
          const favoriteItems = data.filter((item) => item.favorite);
          const nonFavoriteItems = data.filter((item) => !item.favorite);

          // Sort non-favorite items by createdAt (desc)
          nonFavoriteItems.sort((a, b) => dayjs(b.createdAt).diff(dayjs(a.createdAt)));

          // Concatenate favorite and non-favorite items, with favorites first
          const sortedData = [...favoriteItems, ...nonFavoriteItems];

          const startIndex = (page - 1) * size;
          const endIndex = startIndex + size;
          resolve(sortedData.slice(startIndex, endIndex));
        }
      };
    });
  }

  async get(id: string): Promise<ClipboardData | undefined> {
    const objectStore = this.getObjectStore('readonly');
    return new Promise((resolve, reject) => {
      const request = objectStore.get(id);
      request.onsuccess = (event: Event) => {
        const clipboardData: ClipboardData = (event.target as IDBRequest).result;
        if (clipboardData) {
          resolve(clipboardData);
        } else {
          resolve(undefined);
        }
      };

      request.onerror = () => {
        reject(new Error('Failed to get ClipboardData'));
      };
    });
  }

  update(data: ClipboardData): void {
    data.updatedAt = dayjs().toISOString();
    const objectStore = this.getObjectStore('readwrite');
    const request = objectStore.put(data);

    request.onerror = () => {
      console.error('Failed to update ClipboardData');
    };
  }

  async clear(): Promise<ClipboardData[]> {
    const objectStore = this.getObjectStore('readwrite');
    const clearedData: ClipboardData[] = [];

    return new Promise((resolve) => {
      objectStore.openCursor().onsuccess = (event: Event) => {
        const cursor: IDBCursorWithValue | null = (event.target as IDBRequest).result;
        if (cursor) {
          const clipboardData = cursor.value as ClipboardData;
          if (!clipboardData.favorite) {
            clearedData.push(clipboardData);
            cursor.delete();
          }

          cursor.continue();
        } else {
          resolve(clearedData);
        }
      };
    });
  }

  async delete(id: string): Promise<ClipboardData | undefined> {
    const objectStore = this.getObjectStore('readwrite');

    return new Promise((resolve) => {
      const request = objectStore.get(id);
      request.onsuccess = (event: Event) => {
        const clipboardData: ClipboardData = (event.target as IDBRequest).result;
        if (clipboardData) {
          objectStore.delete(id);
          resolve(clipboardData);
        } else {
          resolve(undefined);
        }
      };

      request.onerror = () => {
        resolve(undefined);
      };
    });
  }
}

export const clipboardDataRepository: IClipboardDataRepository = new ClipboardDataRepository();
