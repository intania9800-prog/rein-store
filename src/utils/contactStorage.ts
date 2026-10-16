/**
 * Customer Service Contact Settings Storage Utility
 * Manages official customer support channels: WhatsApp, Telegram, Instagram, TikTok, Email, and Operating Hours.
 * Provides real-time synchronization across Admin Panel, Navbar, Hero, Footer, and Invoices.
 */

import { getQRISConfigSync, saveQRISConfig } from './qrisStorage';
import { getReinstoreContent, saveReinstoreContent } from './contentStorage';

export interface ContactCSConfig {
  whatsappPrimary: string;
  whatsappDnsAdmin: string;
  whatsappPaymentConfirm: string;
  defaultGreetingText: string;
  telegramUsername: string;
  instagramUsername: string;
  tiktokUsername: string;
  emailSupport: string;
  operatingHours: string;
  csStatus: 'online' | 'busy' | 'offline';
  csStatusText: string;
}

export const STORAGE_KEY_CS_CONFIG = 'reinstore_cs_contacts_v1';
export const EVENT_CS_CONTACTS_UPDATED = 'reinstore_cs_contacts_updated';

export const DEFAULT_CS_CONFIG: ContactCSConfig = {
  whatsappPrimary: '+62 895-3655-44896',
  whatsappDnsAdmin: '+62 896-5445-4210',
  whatsappPaymentConfirm: '+62 895-3655-44896',
  defaultGreetingText: 'Halo Admin Reinstore, saya ingin bertanya tentang layanan digital dan pemesanan di Reinstore.',
  telegramUsername: 'reinstore_cs',
  instagramUsername: 'reinstore.official',
  tiktokUsername: 'reinstore.id',
  emailSupport: 'support@reinstore.com',
  operatingHours: '24 Jam Nonstop (Senin - Minggu)',
  csStatus: 'online',
  csStatusText: 'Online 24/7 - Siap Melayani',
};

/**
 * Clean phone number to digits only for wa.me URL
 */
export function formatPhoneNumberForWhatsApp(phone: string): string {
  let cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.slice(1);
  }
  return cleaned;
}

/**
 * Generate full WhatsApp click-to-chat URL
 */
export function getWhatsAppUrl(phone: string, text?: string): string {
  const number = formatPhoneNumberForWhatsApp(phone);
  if (!text) {
    return `https://wa.me/${number}`;
  }
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

/**
 * Retrieve CS contact configuration from localStorage
 */
export function getCSConfig(): ContactCSConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CS_CONFIG);
    if (!raw) {
      return DEFAULT_CS_CONFIG;
    }
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_CS_CONFIG,
      ...parsed,
    };
  } catch (err) {
    console.error('Failed to read CS contacts:', err);
    return DEFAULT_CS_CONFIG;
  }
}

/**
 * Save CS contact configuration and dispatch event
 */
export function saveCSConfig(config: ContactCSConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY_CS_CONFIG, JSON.stringify(config));
    window.dispatchEvent(new CustomEvent(EVENT_CS_CONTACTS_UPDATED, { detail: config }));

    // Sync to QRIS config confirmation number
    try {
      const qrisConfig = getQRISConfigSync();
      if (qrisConfig.whatsappConfirmationNumber !== config.whatsappPaymentConfirm) {
        saveQRISConfig({
          ...qrisConfig,
          whatsappConfirmationNumber: config.whatsappPaymentConfirm,
        });
      }
    } catch (e) {
      console.warn('Sync to QRIS config skipped:', e);
    }

    // Sync to Content Storage tentang contact WhatsApp
    try {
      const content = getReinstoreContent();
      if (content && content.tentang) {
        saveReinstoreContent({
          ...content,
          tentang: {
            ...content.tentang,
            contactWhatsApp: config.whatsappPrimary,
          },
        });
      }
    } catch (e) {
      console.warn('Sync to content storage skipped:', e);
    }
  } catch (err) {
    console.error('Failed to save CS contacts:', err);
  }
}

/**
 * Reset CS contacts to default
 */
export function resetCSConfig(): ContactCSConfig {
  saveCSConfig(DEFAULT_CS_CONFIG);
  return DEFAULT_CS_CONFIG;
}
