import React, { useState, useEffect } from 'react';
import {
  MessageCircle,
  Instagram,
  Send,
  Video,
  Shield,
  Lock,
} from 'lucide-react';
import {
  ReinstoreLogo,
  BCALogo,
  SeaBankLogo,
  KromLogo,
  DanaLogo,
  OvoLogo,
  GoPayLogo,
  ShopeePayLogo,
  AlfamartLogo,
  IndomaretLogo,
  QRISLogo,
} from './icons/BrandLogos';
import { ADMIN_WHATSAPP_SUPPORT } from '../data/products';
import {
  getCSConfig,
  EVENT_CS_CONTACTS_UPDATED,
  getWhatsAppUrl,
  ContactCSConfig,
} from '../utils/contactStorage';

import { InfoModalTab } from './InfoPagesModal';

interface FooterProps {
  onOpenAdmin: () => void;
  onFilterCategory: (category: string) => void;
  onSelectProductById: (productId: string) => void;
  onOpenInfo: (tab: InfoModalTab) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenAdmin,
  onFilterCategory,
  onSelectProductById,
  onOpenInfo,
}) => {
  const [csConfig, setCsConfig] = useState<ContactCSConfig>(() => getCSConfig());

  useEffect(() => {
    const handleUpdate = (e: any) => {
      setCsConfig(e.detail || getCSConfig());
    };
    window.addEventListener(EVENT_CS_CONTACTS_UPDATED, handleUpdate);
    return () => window.removeEventListener(EVENT_CS_CONTACTS_UPDATED, handleUpdate);
  }, []);

  const handleOpenWA = () => {
    const url = getWhatsAppUrl(csConfig.whatsappPrimary, csConfig.defaultGreetingText);
    window.open(url, '_blank');
  };

  return (
    <footer className="w-full bg-[#04060f] border-t border-slate-900 mt-20 pt-14 pb-8 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-12">
          {/* Col 1: Brand Info (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-start space-y-4">
            <ReinstoreLogo size="md" />
            <p className="text-slate-400 text-xs sm:text-sm max-w-sm leading-relaxed">
              Platform top up game terpercaya, pulsa all operator, token listrik PLN,
              serta layanan digital premium seperti Web Monitor Treasury, DNS AdGuard,
              dan Gestun PayLater dengan sistem QRIS otomatis super cepat.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
                <Shield className="w-4 h-4" />
                <span>100% Legal, Terpercaya & Bergaransi</span>
              </div>
              <button
                type="button"
                onClick={() => onOpenInfo('tentang')}
                className="text-[11px] text-[#00A3FF] hover:text-white bg-blue-950/50 hover:bg-blue-900/60 border border-blue-800/60 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer"
              >
                Tentang Kami →
              </button>
            </div>
          </div>

          {/* Col 2: Produk (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Produk
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onFilterCategory('game')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Top Up Game
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onFilterCategory('pulsa')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Pulsa & Paket Data
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onFilterCategory('pln')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Token Listrik
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectProductById('treasury')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Web Monitor Treasury
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectProductById('dns-adguard')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  DNS AdGuard
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectProductById('gestun')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Gestun PayLater
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Bantuan (2 cols) - Clickable Info Pages */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Bantuan & Panduan
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onOpenInfo('tentang')}
                  className="hover:text-white text-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer font-medium"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  Tentang Kami
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenInfo('cara-order')}
                  className="hover:text-white text-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer font-medium"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  Cara Order
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenInfo('pembayaran')}
                  className="hover:text-white text-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer font-medium"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Pembayaran
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenInfo('faq')}
                  className="hover:text-white text-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer font-medium"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  FAQ (Tanya Jawab)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenInfo('terms')}
                  className="hover:text-white text-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer font-medium"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  Syarat & Ketentuan
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenInfo('privacy')}
                  className="hover:text-white text-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer font-medium"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                  Kebijakan Privasi
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Ikuti Kami (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Ikuti Kami
            </h4>
            <div className="flex items-center gap-2.5 mb-4">
              <button
                onClick={handleOpenWA}
                className="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-[#22c55e] text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                title="WhatsApp Support"
              >
                <MessageCircle className="w-4 h-4" />
              </button>
              <a
                href={`https://instagram.com/${csConfig.instagramUsername}`}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-pink-600 text-slate-300 hover:text-white flex items-center justify-center transition-all"
                title="Instagram Resmi"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={`https://t.me/${csConfig.telegramUsername}`}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-sky-500 text-slate-300 hover:text-white flex items-center justify-center transition-all"
                title="Telegram CS"
              >
                <Send className="w-4 h-4" />
              </a>
              <a
                href={`https://tiktok.com/@${csConfig.tiktokUsername.replace('@', '')}`}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-black border border-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-all"
                title="TikTok Resmi"
              >
                <Video className="w-4 h-4" />
              </a>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Hubungi layanan customer support via WhatsApp:{' '}
              <strong className="text-emerald-400 font-mono font-bold">{csConfig.whatsappPrimary}</strong>
              <span className="block text-[10px] text-slate-500 mt-0.5">
                Jam Layanan: {csConfig.operatingHours} ({csConfig.csStatusText})
              </span>
            </p>
          </div>
        </div>

        {/* Payment Partner Logos Strip */}
        <div className="py-6 border-t border-slate-900/80 mb-6">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 text-center sm:text-left">
            Metode Pembayaran Resmi & Terintegrasi
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 justify-center sm:justify-start">
            <div className="bg-[#0b1328] border border-slate-800 rounded-xl px-2.5 py-1.5 flex items-center justify-center">
              <BCALogo />
            </div>
            <div className="bg-[#0b1328] border border-slate-800 rounded-xl px-2.5 py-1.5 flex items-center justify-center">
              <SeaBankLogo />
            </div>
            <div className="bg-[#0b1328] border border-slate-800 rounded-xl px-2.5 py-1.5 flex items-center justify-center">
              <KromLogo />
            </div>
            <div className="bg-[#0b1328] border border-slate-800 rounded-xl px-2.5 py-1.5 flex items-center justify-center">
              <DanaLogo />
            </div>
            <div className="bg-[#0b1328] border border-slate-800 rounded-xl px-2.5 py-1.5 flex items-center justify-center">
              <GoPayLogo />
            </div>
            <div className="bg-[#0b1328] border border-slate-800 rounded-xl px-2.5 py-1.5 flex items-center justify-center">
              <OvoLogo />
            </div>
            <div className="bg-[#0b1328] border border-slate-800 rounded-xl px-2.5 py-1.5 flex items-center justify-center">
              <ShopeePayLogo />
            </div>
            <div className="bg-[#0b1328] border border-slate-800 rounded-xl px-2.5 py-1.5 flex items-center justify-center">
              <AlfamartLogo />
            </div>
            <div className="bg-[#0b1328] border border-slate-800 rounded-xl px-2.5 py-1.5 flex items-center justify-center">
              <IndomaretLogo />
            </div>
            <div className="bg-[#0b1328] border border-slate-800 rounded-xl px-3 py-1.5 flex items-center justify-center">
              <QRISLogo />
            </div>
          </div>
        </div>

        {/* Bottom Bar with Copyright */}
        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <div
            onClick={() => {
              // Discreet store owner access: 5 clicks on copyright opens private admin
              const key = '__rein_admin_clicks';
              const current = Number(sessionStorage.getItem(key) || '0') + 1;
              sessionStorage.setItem(key, String(current));
              if (current >= 5) {
                sessionStorage.removeItem(key);
                if (onOpenAdmin) onOpenAdmin();
              }
            }}
            className="cursor-default select-none"
            title="Reinstore Digital Service"
          >
            © 2026 Reinstore. All rights reserved. Solusi Digital, Hidup Lebih Mudah.
          </div>
          <div className="flex items-center gap-4">
            <span>Powered by Reinstore Core Engine</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
