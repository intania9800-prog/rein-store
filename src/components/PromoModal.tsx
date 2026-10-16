import React from 'react';
import { X, Gift, Sparkles, Check, ArrowRight } from 'lucide-react';

interface PromoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPromo: () => void;
}

export const PromoModal: React.FC<PromoModalProps> = ({
  isOpen,
  onClose,
  onSelectPromo,
}) => {
  if (!isOpen) return null;

  const promos = [
    {
      title: 'Diskon Spesial Gestun PayLater',
      code: 'GESTUNHEMAT',
      desc: 'Fee terendah mulai 4.5% pencairan kilat ke SeaBank & DANA tanpa ribet.',
      badge: 'Terlaris',
      color: 'border-purple-500/40 bg-purple-950/20 text-purple-300',
    },
    {
      title: 'Free Admin Semua Transaksi QRIS',
      code: 'FREEQRIS',
      desc: 'Semua top up game, pulsa, dan token listrik bebas biaya admin Rp 0 via QRIS.',
      badge: 'Free Admin',
      color: 'border-blue-500/40 bg-blue-950/20 text-[#00A3FF]',
    },
    {
      title: 'Akses Treasury Monitor Hanya 5k',
      code: 'GOLDFIVE',
      desc: 'Akses penuh 30 hari live dashboard harga emas Treasury hanya Rp 5.000/bln.',
      badge: 'Hot Deal',
      color: 'border-amber-500/40 bg-amber-950/20 text-amber-300',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#091024] border border-blue-500/30 rounded-3xl w-full max-w-lg p-6 shadow-2xl relative my-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/40 text-[#00A3FF] flex items-center justify-center">
            <Gift className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-white">
              Promo & Penawaran Spesial
            </h3>
            <span className="text-xs text-[#00A3FF] font-semibold">
              Katalog Promo Terbaru Reinstore 2026
            </span>
          </div>
        </div>

        <div className="space-y-3 mb-5">
          {promos.map((p, i) => (
            <div
              key={i}
              className={`p-3.5 rounded-2xl border ${p.color} flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-xs sm:text-sm font-bold text-white">{p.title}</h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700">
                  {p.badge}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mb-2">{p.desc}</p>
              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800">
                <span className="font-mono font-bold text-white bg-slate-900 px-2 py-0.5 rounded">
                  {p.code}
                </span>
                <span className="text-emerald-400 font-semibold text-[10px] flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  <span>Otomatis Terpasang</span>
                </span>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => {
            onClose();
            onSelectPromo();
          }}
          className="w-full py-3 px-4 rounded-xl bg-[#0070F3] hover:bg-[#0060df] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,112,243,0.35)] transition-all active:scale-98"
        >
          <span>Mulai Belanja Sekarang</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
