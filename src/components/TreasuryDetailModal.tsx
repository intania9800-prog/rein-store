import React from 'react';
import { X, ExternalLink, TrendingUp, ShieldCheck, Zap, ArrowRight } from 'lucide-react';
import { TREASURY_TARGET_URL } from '../data/products';

interface TreasuryDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBuyAccess: () => void;
}

export const TreasuryDetailModal: React.FC<TreasuryDetailModalProps> = ({
  isOpen,
  onClose,
  onBuyAccess,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#091024] border border-amber-500/30 rounded-3xl w-full max-w-lg p-6 shadow-2xl relative my-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-white">
              Web Monitor Harga Treasury
            </h3>
            <span className="text-xs text-amber-400 font-semibold">
              Live Real-Time Gold Spread & Price Tracking
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed mb-4">
          Pantau harga emas Treasury detik demi detik dengan spread terendah, grafik harga live,
          dan notifikasi peluang profit secara otomatis.
        </p>

        <div className="bg-[#0c152e] border border-slate-800 rounded-2xl p-4 space-y-2 mb-5 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Update otomatis setiap beberapa detik tanpa refresh</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Server stabil & akses via portal resmi https://price.tsrengga.my.id/</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <span className="font-bold text-amber-400">Harga Spesial Reinstore:</span>
            <span className="font-bold text-white">Hanya Rp 5.000 / Bulan</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={() => {
              onClose();
              onBuyAccess();
            }}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all active:scale-98"
          >
            <span>Beli Akses Rp 5.000</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <a
            href={TREASURY_TARGET_URL}
            target="_blank"
            rel="noreferrer"
            className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <span>Kunjungi Website</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
