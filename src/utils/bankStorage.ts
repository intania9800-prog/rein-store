/**
 * Bank Accounts and Payment Methods Storage Utility
 * Manages official store bank accounts, e-wallets, account numbers, and holders.
 * Real-time synchronization across Admin Panel, Order Checkout, and Info Pages.
 */

export interface BankAccount {
  id: string;
  bankName: string;
  bankCode: string; // 'BCA' | 'SEABANK' | 'MANDIRI' | 'BRI' | 'BNI' | 'BSI' | 'KROM' | 'JAGO' | 'DANA' | 'GOPAY' | 'OVO' | 'SHOPEEPAY' | 'OTHER'
  accountNumber: string;
  accountName: string;
  category: 'bank' | 'ewallet' | 'retail';
  fee: number;
  isActive: boolean;
  badge?: string;
  notes?: string;
  isSpecialDNS?: boolean;
  order: number;
}

export const STORAGE_KEY_BANK_ACCOUNTS = 'reinstore_admin_bank_accounts_v1';
export const EVENT_BANK_ACCOUNTS_UPDATED = 'reinstore_bank_accounts_updated';

export const DEFAULT_BANK_ACCOUNTS: BankAccount[] = [
  {
    id: 'bca',
    bankName: 'Bank Central Asia (BCA)',
    bankCode: 'BCA',
    accountNumber: '8720386438',
    accountName: 'RENGGA ARMANDA SETIAWAN',
    category: 'bank',
    fee: 2500,
    isActive: true,
    badge: 'Transfer Cepat & Otomatis',
    notes: 'Bisa transfer dari m-BCA, KlikBCA, ATM BCA, atau antar-bank realtime.',
    order: 1,
  },
  {
    id: 'seabank',
    bankName: 'SeaBank Indonesia',
    bankCode: 'SEABANK',
    accountNumber: '901699374570',
    accountName: 'RENGGA ARMANDA SETIAWAN',
    category: 'bank',
    fee: 2500,
    isActive: true,
    badge: 'Bebas Biaya Antar Bank',
    notes: 'Transfer bebas biaya admin dari aplikasi SeaBank atau Shopee.',
    order: 2,
  },
  {
    id: 'mandiri',
    bankName: 'Bank Mandiri',
    bankCode: 'MANDIRI',
    accountNumber: '1370019283741',
    accountName: 'RENGGA ARMANDA SETIAWAN',
    category: 'bank',
    fee: 2500,
    isActive: false, // Default offline, bisa diaktifkan admin
    badge: 'Livin by Mandiri',
    notes: 'Transfer via aplikasi Livin by Mandiri atau ATM Mandiri.',
    order: 3,
  },
  {
    id: 'bri',
    bankName: 'Bank Rakyat Indonesia (BRI)',
    bankCode: 'BRI',
    accountNumber: '020601083921503',
    accountName: 'RENGGA ARMANDA SETIAWAN',
    category: 'bank',
    fee: 2500,
    isActive: false, // Default offline, bisa diaktifkan admin
    badge: 'BRImo',
    notes: 'Transfer via aplikasi BRImo atau mesin ATM BRI.',
    order: 4,
  },
  {
    id: 'bni',
    bankName: 'Bank Negara Indonesia (BNI)',
    bankCode: 'BNI',
    accountNumber: '1298471029',
    accountName: 'RENGGA ARMANDA SETIAWAN',
    category: 'bank',
    fee: 2500,
    isActive: false,
    badge: 'BNI Mobile Banking',
    notes: 'Transfer via aplikasi BNI Mobile Banking atau ATM BNI.',
    order: 5,
  },
  {
    id: 'bsi',
    bankName: 'Bank Syariah Indonesia (BSI)',
    bankCode: 'BSI',
    accountNumber: '7182930491',
    accountName: 'RENGGA ARMANDA SETIAWAN',
    category: 'bank',
    fee: 2500,
    isActive: false,
    badge: 'BSI Mobile',
    notes: 'Transfer syariah via BSI Mobile Banking.',
    order: 6,
  },
  {
    id: 'krom',
    bankName: 'KROM Bank (Khusus DNS AdGuard)',
    bankCode: 'KROM',
    accountNumber: '770071702112',
    accountName: 'guruh samudra',
    category: 'bank',
    fee: 2500,
    isActive: true,
    isSpecialDNS: true,
    badge: 'Akun Khusus DNS',
    notes: 'Rekening khusus pembayaran aktivasi layanan DNS AdGuard.',
    order: 7,
  },
  {
    id: 'dana',
    bankName: 'DANA E-Wallet',
    bankCode: 'DANA',
    accountNumber: '089638506274',
    accountName: 'RENGGA ARMANDA SETIAWAN',
    category: 'ewallet',
    fee: 2500,
    isActive: true,
    badge: 'Kirim Cepat',
    notes: 'Transfer sesama DANA atau via nomor HP terdaftar.',
    order: 8,
  },
  {
    id: 'gopay',
    bankName: 'GoPay / Gojek',
    bankCode: 'GOPAY',
    accountNumber: '089638506274',
    accountName: 'RENGGA ARMANDA SETIAWAN',
    category: 'ewallet',
    fee: 2500,
    isActive: true,
    badge: 'Transfer Instan',
    notes: 'Transfer sesama GoPay ke nomor HP penerima.',
    order: 9,
  },
  {
    id: 'ovo',
    bankName: 'OVO Cash',
    bankCode: 'OVO',
    accountNumber: '089638506274',
    accountName: 'RENGGA ARMANDA SETIAWAN',
    category: 'ewallet',
    fee: 2500,
    isActive: true,
    badge: 'OVO Premier',
    notes: 'Transfer sesama OVO ke nomor HP penerima.',
    order: 10,
  },
  {
    id: 'shopeepay',
    bankName: 'ShopeePay',
    bankCode: 'SHOPEEPAY',
    accountNumber: '085712024882',
    accountName: 'RENGGA ARMANDA SETIAWAN',
    category: 'ewallet',
    fee: 2500,
    isActive: true,
    badge: 'ShopeePay Plus',
    notes: 'Transfer sesama ShopeePay melalui menu Transfer ke Kontak.',
    order: 11,
  },
  {
    id: 'shopeepay-dns',
    bankName: 'ShopeePay (Khusus DNS AdGuard)',
    bankCode: 'SHOPEEPAY',
    accountNumber: '089654454210',
    accountName: 'guruh samudra',
    category: 'ewallet',
    fee: 2500,
    isActive: true,
    isSpecialDNS: true,
    badge: 'Akun Khusus DNS',
    notes: 'E-Wallet khusus aktivasi DNS AdGuard.',
    order: 12,
  },
];

/**
 * Get all configured bank accounts from localStorage
 */
export function getBankAccounts(): BankAccount[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_BANK_ACCOUNTS);
    if (!raw) {
      return DEFAULT_BANK_ACCOUNTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.sort((a, b) => a.order - b.order);
    }
    return DEFAULT_BANK_ACCOUNTS;
  } catch (err) {
    console.error('Failed to read bank accounts:', err);
    return DEFAULT_BANK_ACCOUNTS;
  }
}

/**
 * Save bank accounts to localStorage and notify all listeners
 */
export function saveBankAccounts(accounts: BankAccount[]): void {
  try {
    const sorted = [...accounts].sort((a, b) => a.order - b.order);
    localStorage.setItem(STORAGE_KEY_BANK_ACCOUNTS, JSON.stringify(sorted));
    window.dispatchEvent(new CustomEvent(EVENT_BANK_ACCOUNTS_UPDATED, { detail: sorted }));
  } catch (err) {
    console.error('Failed to save bank accounts:', err);
  }
}

/**
 * Reset bank accounts to system default
 */
export function resetBankAccounts(): BankAccount[] {
  saveBankAccounts(DEFAULT_BANK_ACCOUNTS);
  return DEFAULT_BANK_ACCOUNTS;
}

/**
 * Toggle Active / Inactive (ON / OFF) status of a bank account
 */
export function toggleBankAccountActive(id: string): BankAccount[] {
  const current = getBankAccounts();
  const updated = current.map((acc) =>
    acc.id === id ? { ...acc, isActive: !acc.isActive } : acc
  );
  saveBankAccounts(updated);
  return updated;
}

/**
 * Update an existing bank account's details
 */
export function updateBankAccount(id: string, updates: Partial<BankAccount>): BankAccount[] {
  const current = getBankAccounts();
  const updated = current.map((acc) =>
    acc.id === id ? { ...acc, ...updates } : acc
  );
  saveBankAccounts(updated);
  return updated;
}

/**
 * Add a new bank account or payment method
 */
export function addBankAccount(
  data: Omit<BankAccount, 'id' | 'order'> & { id?: string }
): BankAccount[] {
  const current = getBankAccounts();
  const newId =
    data.id && !current.some((c) => c.id === data.id)
      ? data.id
      : `bank-${Date.now()}`;
  
  const newAccount: BankAccount = {
    ...data,
    id: newId,
    order: current.length + 1,
  };

  const updated = [...current, newAccount];
  saveBankAccounts(updated);
  return updated;
}

/**
 * Delete a bank account
 */
export function deleteBankAccount(id: string): BankAccount[] {
  const current = getBankAccounts();
  const updated = current
    .filter((acc) => acc.id !== id)
    .map((acc, index) => ({ ...acc, order: index + 1 }));
  saveBankAccounts(updated);
  return updated;
}

/**
 * Reorder accounts
 */
export function moveBankAccount(id: string, direction: 'up' | 'down'): BankAccount[] {
  const list = [...getBankAccounts()];
  const index = list.findIndex((a) => a.id === id);
  if (index < 0) return list;

  if (direction === 'up' && index > 0) {
    const temp = list[index];
    list[index] = list[index - 1];
    list[index - 1] = temp;
  } else if (direction === 'down' && index < list.length - 1) {
    const temp = list[index];
    list[index] = list[index + 1];
    list[index + 1] = temp;
  }

  const updated = list.map((item, idx) => ({ ...item, order: idx + 1 }));
  saveBankAccounts(updated);
  return updated;
}
