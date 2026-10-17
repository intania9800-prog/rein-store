export interface QRISConfig {
  merchantName: string;
  nmid: string;
  acquirer: string;
  city: string;
  postalCode: string;
  expirationMinutes: number;
  mode: 'standard_national' | 'custom_image';
  customImageUrl: string | null;
  staticQrString?: string;
  whatsappConfirmationNumber: string;
}

export const DEFAULT_QRIS_CONFIG: QRISConfig = {
  merchantName: 'REINSTORE, ELEKTRONIK',
  nmid: 'ID1026614748022',
  acquirer: 'A01',
  city: 'JAKARTA',
  postalCode: '12340',
  expirationMinutes: 15,
  mode: 'standard_national',
  customImageUrl: null,
  whatsappConfirmationNumber: '+62 895-3655-44896',
};

export const STORAGE_KEY_QRIS_CONFIG = 'reinstore_qris_config_v1';
export const STORAGE_KEY_QRIS_IMAGE_IDB = 'reinstore_qris_image_blob';
export const EVENT_QRIS_UPDATED = 'reinstore_qris_updated';

const DB_NAME = 'ReinstoreQRISDB';
const STORE_NAME = 'qris_store';

function openQRISDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB not supported'));
    }
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

/**
 * Save custom QRIS image to IndexedDB to avoid localStorage quota limits and preserve full sharpness
 */
export async function saveQRISImageToStorage(dataUrl: string): Promise<void> {
  try {
    const db = await openQRISDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(dataUrl, STORAGE_KEY_QRIS_IMAGE_IDB);
    await new Promise((res, rej) => {
      tx.oncomplete = res;
      tx.onerror = rej;
    });
  } catch (err) {
    console.warn('Failed to save QRIS image in IndexedDB, fallback to localStorage:', err);
    try {
      localStorage.setItem(STORAGE_KEY_QRIS_IMAGE_IDB, dataUrl);
    } catch {
      // ignore
    }
  }
}

/**
 * Get custom QRIS image from IndexedDB
 */
export async function getQRISImageFromStorage(): Promise<string | null> {
  try {
    const db = await openQRISDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const req = tx.objectStore(STORE_NAME).get(STORAGE_KEY_QRIS_IMAGE_IDB);
    const result = await new Promise<string | null>((res, rej) => {
      req.onsuccess = () => res(req.result || null);
      req.onerror = () => rej(req.error);
    });
    if (result) return result;
  } catch {
    // fallback
  }

  try {
    return localStorage.getItem(STORAGE_KEY_QRIS_IMAGE_IDB);
  } catch {
    return null;
  }
}

/**
 * Delete custom QRIS image
 */
export async function clearQRISImageFromStorage(): Promise<void> {
  try {
    const db = await openQRISDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).delete(STORAGE_KEY_QRIS_IMAGE_IDB);
  } catch {
    // ignore
  }
  try {
    localStorage.removeItem(STORAGE_KEY_QRIS_IMAGE_IDB);
  } catch {
    // ignore
  }
}

/**
 * Synchronous read of QRIS config
 */
export function getQRISConfigSync(): QRISConfig {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_QRIS_CONFIG);
    if (saved) {
      return { ...DEFAULT_QRIS_CONFIG, ...JSON.parse(saved) };
    }
  } catch {
    // ignore
  }
  return DEFAULT_QRIS_CONFIG;
}

/**
 * Save QRIS config to localStorage
 */
export function saveQRISConfig(config: QRISConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY_QRIS_CONFIG, JSON.stringify(config));
    window.dispatchEvent(new CustomEvent('reinstore_qris_updated', { detail: config }));
    import('./syncManager').then(({ pushSyncUpdate }) => {
      pushSyncUpdate('qris', config);
    }).catch(() => {});
  } catch (e) {
    console.error('Failed to save QRIS config:', e);
  }
}

/**
 * Compute EMVCo CRC16 Checksum
 */
function computeEMVCoCRC16(payload: string): string {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i++) {
    const code = payload.charCodeAt(i);
    crc ^= code << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xffff;
      } else {
        crc = (crc << 1) & 0xffff;
      }
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

function tag(id: string, val: string): string {
  const len = val.length.toString().padStart(2, '0');
  return `${id}${len}${val}`;
}

/**
 * Builds standard Indonesian QRIS Payload (ASPI / Bank Indonesia standard)
 */
export function generateQRISPayload(
  config: QRISConfig,
  amount: number,
  invoiceNumber: string
): string {
  if (config.staticQrString && config.staticQrString.trim().length > 20) {
    return config.staticQrString.trim();
  }

  // Format amount to string without decimals for IDR
  const amtStr = Math.max(0, Math.floor(amount)).toString();

  // Subtags for Merchant Account Information (tag 26)
  const nmid = config.nmid || 'ID1026614748022';
  const sub26_00 = tag('00', 'ID.CO.QRIS.WWW');
  const sub26_01 = tag('01', nmid);
  const sub26_02 = tag('02', 'A01');
  const tag26 = tag('26', `${sub26_00}${sub26_01}${sub26_02}`);

  // Additional data tag 62 (Reference / invoice ID)
  const sub62_01 = tag('01', invoiceNumber.replace(/[^a-zA-Z0-9]/g, '').slice(-12));
  const sub62_05 = tag('05', 'REINSTORE');
  const tag62 = tag('62', `${sub62_01}${sub62_05}`);

  // Standard EMVCo tags
  const tag00 = tag('00', '01'); // Payload Format Indicator
  const tag01 = tag('01', '12'); // Dynamic QR (12) with specific amount
  const tag52 = tag('52', '5732'); // Merchant Category Code (Electronic / Digital Goods)
  const tag53 = tag('53', '360'); // Transaction Currency (IDR = 360)
  const tag54 = tag('54', amtStr); // Amount
  const tag58 = tag('58', 'ID'); // Country Code
  const cleanMerchantName = (config.merchantName || 'REINSTORE').slice(0, 25).toUpperCase();
  const tag59 = tag('59', cleanMerchantName); // Merchant Name
  const tag60 = tag('60', (config.city || 'JAKARTA').slice(0, 15).toUpperCase()); // City
  const tag61 = tag('61', (config.postalCode || '12340').slice(0, 10)); // Postal Code

  const rawWithoutCrc = `${tag00}${tag01}${tag26}${tag52}${tag53}${tag54}${tag58}${tag59}${tag60}${tag61}${tag62}6304`;
  const checksum = computeEMVCoCRC16(rawWithoutCrc);

  return `${rawWithoutCrc}${checksum}`;
}
