export type ServiceHealthStatus = 'online' | 'maintenance' | 'issue' | 'offline';

export type ServiceItemStatus = 'Aktif' | 'Maintenance' | 'Gangguan' | 'Segera Hadir' | 'Nonaktif';

export interface ServiceItem {
  id: string;
  name: string;
  status: ServiceItemStatus;
  enabled: boolean; // Direct On/Off toggle
  description?: string;
  updatedAt?: string;
}

export interface ServiceStatusConfig {
  showCard: boolean; // Master On/Off switch for the status card widget
  overallStatus: ServiceHealthStatus;
  overallTitle: string; // e.g. "Online"
  overallSubtext: string; // e.g. "Semua layanan berjalan normal."
  services: ServiceItem[];
  lastUpdated: string;
}

export const STORAGE_KEY_SERVICE_STATUS = 'reinstore_service_status_config';
export const EVENT_SERVICE_STATUS_UPDATED = 'reinstore_service_status_updated';

export const DEFAULT_SERVICE_STATUS_CONFIG: ServiceStatusConfig = {
  showCard: true,
  overallStatus: 'online',
  overallTitle: 'Online',
  overallSubtext: 'Semua layanan berjalan normal.',
  lastUpdated: new Date().toISOString(),
  services: [
    {
      id: 'srv-treasury',
      name: 'Web Monitor Treasury',
      status: 'Aktif',
      enabled: true,
      description: 'Live monitor harga emas real-time',
    },
    {
      id: 'srv-adguard',
      name: 'DNS AdGuard',
      status: 'Aktif',
      enabled: true,
      description: 'Proteksi privasi & pemblokir iklan',
    },
    {
      id: 'srv-gestun',
      name: 'Gestun PayLater',
      status: 'Aktif',
      enabled: true,
      description: 'Pencairan limit Shopee / Kredivo / Akulaku',
    },
    {
      id: 'srv-topup',
      name: 'Top Up & Pulsa',
      status: 'Aktif',
      enabled: true,
      description: 'Game top up & pulsa all-operator 24 jam',
    },
    {
      id: 'srv-pln',
      name: 'Token Listrik',
      status: 'Aktif',
      enabled: true,
      description: 'Token PLN Prabayar & Pascaprabayar instan',
    },
  ],
};

export const getServiceStatusConfig = (): ServiceStatusConfig => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SERVICE_STATUS);
    if (!raw) return DEFAULT_SERVICE_STATUS_CONFIG;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_SERVICE_STATUS_CONFIG,
      ...parsed,
      services: Array.isArray(parsed.services) ? parsed.services : DEFAULT_SERVICE_STATUS_CONFIG.services,
    };
  } catch (err) {
    console.error('Error reading service status config:', err);
    return DEFAULT_SERVICE_STATUS_CONFIG;
  }
};

export const saveServiceStatusConfig = (config: ServiceStatusConfig): boolean => {
  try {
    const updated = {
      ...config,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY_SERVICE_STATUS, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(EVENT_SERVICE_STATUS_UPDATED, { detail: updated }));
    import('./syncManager').then(({ pushSyncUpdate }) => {
      pushSyncUpdate('serviceStatuses', updated);
    }).catch(() => {});
    return true;
  } catch (err) {
    console.error('Error saving service status config:', err);
    return false;
  }
};

export const resetServiceStatusConfig = (): ServiceStatusConfig => {
  saveServiceStatusConfig(DEFAULT_SERVICE_STATUS_CONFIG);
  return DEFAULT_SERVICE_STATUS_CONFIG;
};
