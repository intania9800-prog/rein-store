import { SlidePoster } from '../types';

export const STORAGE_KEY_ADMIN_POSTERS = 'reinstore_admin_posters_v2';
export const STORAGE_KEY_ADMIN_DURATION = 'reinstore_admin_slide_duration_v1';

const DB_NAME = 'ReinstorePosterDB';
const DB_VERSION = 2; // Incremented to version 2 for master list schema
const STORE_NAME = 'posters_store';
const MASTER_KEY = '__poster_master_list__';

// Helper to open IndexedDB
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB not supported'));
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Get posters with high-resolution support from IndexedDB with localStorage fallback.
 */
export async function getPostersFromStorage(): Promise<SlidePoster[]> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);

    // 1. Try reading the ordered master list
    const masterReq = store.get(MASTER_KEY);
    const masterRecord = await new Promise<{ id: string; items: SlidePoster[] } | undefined>(
      (resolve, reject) => {
        masterReq.onsuccess = () => resolve(masterReq.result);
        masterReq.onerror = () => reject(masterReq.error);
      }
    );

    if (masterRecord && Array.isArray(masterRecord.items)) {
      return masterRecord.items;
    }

    // 2. Fallback to reading all items from v1 if master record not yet created
    const allReq = store.getAll();
    const allItems = await new Promise<any[]>((resolve, reject) => {
      allReq.onsuccess = () => resolve(allReq.result || []);
      allReq.onerror = () => reject(allReq.error);
    });

    const individualPosters = allItems.filter(
      (item) => item && item.id && item.id !== MASTER_KEY && item.imageUrl
    ) as SlidePoster[];

    if (individualPosters.length > 0) {
      return individualPosters;
    }
  } catch (err) {
    console.warn('IndexedDB read fallback to localStorage:', err);
  }

  // 3. Fallback to localStorage
  try {
    const local = localStorage.getItem(STORAGE_KEY_ADMIN_POSTERS);
    if (local) {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch {
    // ignore
  }

  return [];
}

/**
 * Synchronous read from localStorage for instant initial render.
 */
export function getPostersSync(): SlidePoster[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_ADMIN_POSTERS);
    if (saved) {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    }
    return [];
  } catch {
    return [];
  }
}

/**
 * Save posters to both IndexedDB (can store large high-res lossless images without 5MB quota)
 * and localStorage for immediate sync.
 */
export async function savePostersToStorage(posters: SlidePoster[]): Promise<void> {
  const safePosters = Array.isArray(posters) ? posters : [];

  // 1. Save to IndexedDB with transaction completion
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      
      // Clear store to purge any old/deleted individual posters
      store.clear();

      // Put the master record preserving exact order & array state
      store.put({
        id: MASTER_KEY,
        items: safePosters,
        updatedAt: Date.now(),
      });

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('Failed to save to IndexedDB:', err);
  }

  // 2. Save to localStorage for instant sync
  try {
    localStorage.setItem(STORAGE_KEY_ADMIN_POSTERS, JSON.stringify(safePosters));
  } catch (err) {
    console.warn('localStorage quota exceeded, saving lightweight metadata:', err);
    try {
      const lightweight = safePosters.map((p) => ({
        ...p,
        imageUrl: p.imageUrl.startsWith('data:') && p.imageUrl.length > 250000 ? '' : p.imageUrl,
      }));
      localStorage.setItem(STORAGE_KEY_ADMIN_POSTERS, JSON.stringify(lightweight));
    } catch {
      // ignore
    }
  }

  // Dispatch events so active slider refreshes immediately
  try {
    window.dispatchEvent(new CustomEvent('reinstore_posters_updated', { detail: safePosters }));
    window.dispatchEvent(new Event('reinstore_posters_updated'));
    import('./syncManager').then(({ pushSyncUpdate }) => {
      pushSyncUpdate('posters', safePosters);
    }).catch(() => {});
  } catch {
    // ignore
  }
}
