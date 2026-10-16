import React, { useState, useEffect } from 'react';
import {
  Zap,
  Tag,
  ShieldCheck,
  Headphones,
} from 'lucide-react';
import { ADMIN_WHATSAPP_SUPPORT } from '../data/products';
import {
  getCSConfig,
  EVENT_CS_CONTACTS_UPDATED,
  getWhatsAppUrl,
  ContactCSConfig,
} from '../utils/contactStorage';
import { PosterSlider } from './PosterSlider';

interface HeroProps {
  onScrollToProducts: () => void;
  onOpenTreasuryModal: () => void;
  onOpenAdGuardModal: () => void;
  onOpenGestunModal: () => void;
  onSelectProduct?: (productId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  onScrollToProducts,
  onOpenTreasuryModal,
  onOpenAdGuardModal,
  onOpenGestunModal,
  onSelectProduct,
}) => {
  const [csConfig, setCsConfig] = useState<ContactCSConfig>(() => getCSConfig());

  useEffect(() => {
    const handleUpdate = (e: any) => {
      setCsConfig(e.detail || getCSConfig());
    };
    window.addEventListener(EVENT_CS_CONTACTS_UPDATED, handleUpdate);
    return () => window.removeEventListener(EVENT_CS_CONTACTS_UPDATED, handleUpdate);
  }, []);

  return (
    <section className="relative overflow-hidden pt-6 pb-10 lg:pt-10 lg:pb-14">
      {/* Background radial blue glow & ambient cyber neon effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[36rem] bg-gradient-to-r from-blue-700/25 via-sky-500/20 to-indigo-700/20 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-8 left-12 w-48 h-48 bg-cyan-400/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/4 right-12 w-56 h-56 bg-blue-600/15 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Header Badge & Headline */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-8">
          {/* Solusi Digital Terlengkap Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0c1a36]/90 border border-[#00A3FF]/40 text-xs font-semibold text-[#38bdf8] mb-4 shadow-[0_0_18px_rgba(0,163,255,0.25)]">
            <Zap className="w-3.5 h-3.5 text-[#00A3FF] fill-[#00A3FF] animate-pulse" />
            <span>⚡ Solusi Digital Terlengkap dalam Satu Tempat</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.18] mb-3">
            Reinstore{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#38bdf8] via-[#00A3FF] to-blue-400 drop-shadow-[0_0_20px_rgba(56,189,248,0.4)]">
              Top Up, Pulsa, Token Listrik
            </span>{' '}
            <br className="hidden sm:inline" />
            <span className="text-white">& </span>
            <span className="text-[#38bdf8]">Layanan Digital Terpercaya</span>
          </h1>

          {/* Description */}
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl font-normal mb-5">
            Nikmati kemudahan transaksi cepat, aman dan harga terbaik untuk semua kebutuhan digital kamu.
            Dari top up game, pulsa & paket data, token listrik PLN hingga layanan premium Web Monitor Treasury & DNS AdGuard.
          </p>

          {/* 4 Feature Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 w-full max-w-3xl py-3 border-y border-slate-800/80">
            <div className="flex items-center gap-2 sm:gap-2.5 justify-center sm:justify-start">
              <div className="w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                <Zap className="w-4 h-4 fill-blue-400" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-white">Proses Cepat</span>
                <span className="text-[10px] text-slate-400">1-5 Menit Otomatis</span>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-2.5 justify-center sm:justify-start">
              <div className="w-8 h-8 rounded-lg bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0">
                <Tag className="w-4 h-4" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-white">Harga Terbaik</span>
                <span className="text-[10px] text-slate-400">& Terjangkau</span>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-2.5 justify-center sm:justify-start">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-white">100% Aman</span>
                <span className="text-[10px] text-slate-400">Transaksi Terjamin</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                const url = getWhatsAppUrl(csConfig.whatsappPrimary, csConfig.defaultGreetingText);
                window.open(url, '_blank');
              }}
              className="flex items-center gap-2 sm:gap-2.5 justify-center sm:justify-start hover:opacity-90 transition-opacity cursor-pointer group text-left"
              title="Hubungi Customer Support WhatsApp"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 group-hover:scale-105 transition-transform">
                <Headphones className="w-4 h-4" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-white flex items-center gap-1">
                  <span>24/7 Support</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </span>
                <span className="text-[10px] text-slate-400 font-mono group-hover:text-emerald-300 transition-colors">
                  {csConfig.whatsappPrimary}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* =========================================================================
            THE INTERACTIVE POSTER SLIDER (CAROUSEL SLIDES)
           ========================================================================= */}
        <PosterSlider
          onScrollToProducts={onScrollToProducts}
          onOpenTreasuryModal={onOpenTreasuryModal}
          onOpenAdGuardModal={onOpenAdGuardModal}
          onOpenGestunModal={onOpenGestunModal}
          onSelectProduct={onSelectProduct}
        />
      </div>
    </section>
  );
};
