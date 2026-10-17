/**
 * Cross-Device Synchronization Manager (HP Mobile <-> PC / Laptop)
 * Automatically syncs store products, custom pricing, bank accounts, QRIS,
 * CS contacts, posters, and order history across all devices.
 */

import { EVENT_PRODUCTS_UPDATED, STORAGE_KEY_PRODUCTS } from './productStorage';
import { EVENT_QRIS_UPDATED, STORAGE_KEY_QRIS_CONFIG } from './qrisStorage';
import { EVENT_BANK_ACCOUNTS_UPDATED, STORAGE_KEY_BANK_ACCOUNTS } from './bankStorage';
import { EVENT_CS_CONTACTS_UPDATED, STORAGE_KEY_CS_CONFIG } from './contactStorage';
import { EVENT_SERVICE_STATUS_UPDATED, STORAGE_KEY_SERVICE_STATUS } from './serviceStatusStorage';
import { STORAGE_KEY_ADMIN_POSTERS, STORAGE_KEY_ADMIN_DURATION } from './posterStorage';
import { STORAGE_KEY_CONTENT, EVENT_CONTENT_UPDATED } from './contentStorage';

export const EVENT_SYNC_STATUS = 'reinstore_sync_status';

export interface SyncStatus {
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncedAt: number | null;
  serverVersion: number;
  error?: string | null;
}

let currentVersion = 0;
let lastSyncTimestamp: number | null = null;
let isSyncInProgress = false;
let pollingInterval: any = null;

export function getSyncStatus(): SyncStatus {
  return {
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    isSyncing: isSyncInProgress,
    lastSyncedAt: lastSyncTimestamp,
    serverVersion: currentVersion,
  };
}

function broadcastSyncStatus(extra?: Partial<SyncStatus>) {
  if (typeof window === 'undefined') return;
  const status = { ...getSyncStatus(), ...extra };
  window.dispatchEvent(new CustomEvent(EVENT_SYNC_STATUS, { detail: status }));
}

/**
 * Apply server data to localStorage and dispatch custom update events
 */
function applyServerData(payload: any) {
  if (!payload || typeof payload !== 'object') return;

  try {
    // 1. Products
    if (Array.isArray(payload.products) && payload.products.length > 0) {
      localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(payload.products));
      window.dispatchEvent(new CustomEvent(EVENT_PRODUCTS_UPDATED, { detail: payload.products }));
    }

    // 2. QRIS Config
    if (payload.qris && typeof payload.qris === 'object') {
      localStorage.setItem(STORAGE_KEY_QRIS_CONFIG, JSON.stringify(payload.qris));
      window.dispatchEvent(new CustomEvent(EVENT_QRIS_UPDATED, { detail: payload.qris }));
    }

    // 3. Bank Accounts
    if (Array.isArray(payload.banks) && payload.banks.length > 0) {
      localStorage.setItem(STORAGE_KEY_BANK_ACCOUNTS, JSON.stringify(payload.banks));
      window.dispatchEvent(new CustomEvent(EVENT_BANK_ACCOUNTS_UPDATED, { detail: payload.banks }));
    }

    // 4. CS Contacts
    if (payload.contacts && typeof payload.contacts === 'object') {
      localStorage.setItem(STORAGE_KEY_CS_CONFIG, JSON.stringify(payload.contacts));
      window.dispatchEvent(new CustomEvent(EVENT_CS_CONTACTS_UPDATED, { detail: payload.contacts }));
    }

    // 5. Service Statuses
    if (payload.serviceStatuses && typeof payload.serviceStatuses === 'object') {
      localStorage.setItem(STORAGE_KEY_SERVICE_STATUS, JSON.stringify(payload.serviceStatuses));
      window.dispatchEvent(new CustomEvent(EVENT_SERVICE_STATUS_UPDATED, { detail: payload.serviceStatuses }));
    }

    // 6. Posters
    if (Array.isArray(payload.posters)) {
      localStorage.setItem(STORAGE_KEY_ADMIN_POSTERS, JSON.stringify(payload.posters));
      window.dispatchEvent(new Event('reinstore_posters_updated'));
    }

    // 7. Poster Duration
    if (payload.posterDuration) {
      localStorage.setItem(STORAGE_KEY_ADMIN_DURATION, String(payload.posterDuration));
    }

    // 8. Info & Bantuan Content
    if (payload.content && typeof payload.content === 'object') {
      localStorage.setItem(STORAGE_KEY_CONTENT, JSON.stringify(payload.content));
      window.dispatchEvent(new CustomEvent(EVENT_CONTENT_UPDATED, { detail: payload.content }));
    }

    // 9. Orders
    if (Array.isArray(payload.orders) && payload.orders.length > 0) {
      localStorage.setItem('reinstore_orders', JSON.stringify(payload.orders));
      window.dispatchEvent(new CustomEvent('reinstore_orders_updated', { detail: payload.orders }));
    }

    if (payload.version) {
      currentVersion = Number(payload.version);
    }
    lastSyncTimestamp = Date.now();
    broadcastSyncStatus();
  } catch (err) {
    console.error('[SyncManager] Error applying server data:', err);
  }
}

/**
 * Fetch all shared state from server
 */
export async function fetchAllFromServer(): Promise<boolean> {
  if (isSyncInProgress) return false;
  isSyncInProgress = true;
  broadcastSyncStatus({ isSyncing: true });

  try {
    const res = await fetch('/api/sync/all', {
      headers: { 'Cache-Control': 'no-cache' },
    });

    if (res.ok) {
      const data = await res.json();
      applyServerData(data);
      isSyncInProgress = false;
      broadcastSyncStatus({ isSyncing: false });
      return true;
    }
  } catch {
    // Backend might be offline or still starting
  }

  isSyncInProgress = false;
  broadcastSyncStatus({ isSyncing: false });
  return false;
}

/**
 * Push an individual entity update to the server for instant synchronization
 */
export async function pushSyncUpdate(key: string, data: any): Promise<boolean> {
  try {
    const res = await fetch('/api/sync/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ key, data }),
    });

    if (res.ok) {
      const respData = await res.json();
      if (respData.version) {
        currentVersion = respData.version;
      }
      lastSyncTimestamp = Date.now();
      broadcastSyncStatus();
      return true;
    }
  } catch (err) {
    console.warn('[SyncManager] Failed to push update to server (offline fallback active):', err);
  }
  return false;
}

/**
 * Initialize background polling for cross-device synchronization (PC <-> HP)
 */
export function initCrossDeviceSync(): () => void {
  // 1. Initial fetch from server
  fetchAllFromServer();

  // 2. Poll server version every 3.5 seconds
  if (pollingInterval) clearInterval(pollingInterval);
  pollingInterval = setInterval(async () => {
    try {
      const res = await fetch('/api/sync/version');
      if (res.ok) {
        const { version } = await res.json();
        if (version && version > currentVersion) {
          await fetchAllFromServer();
        }
      }
    } catch {
      // Quiet fail if network intermittent
    }
  }, 3500);

  // 3. Listen to browser tab visibility changes
  const handleVisibility = () => {
    if (document.visibilityState === 'visible') {
      fetchAllFromServer();
    }
  };
  document.addEventListener('visibilitychange', handleVisibility);

  return () => {
    if (pollingInterval) clearInterval(pollingInterval);
    document.removeEventListener('visibilitychange', handleVisibility);
  };
}
