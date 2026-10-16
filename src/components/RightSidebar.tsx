import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Coins,
  ArrowUpRight,
  CheckCircle2,
  Quote,
  Star,
  Gift,
  ArrowRight,
} from 'lucide-react';
import { TREASURY_TARGET_URL } from '../data/products';
import {
  getServiceStatusConfig,
  EVENT_SERVICE_STATUS_UPDATED,
  ServiceStatusConfig,
} from '../utils/serviceStatusStorage';

interface RightSidebarProps {
  onOpenTreasuryModal: () => void;
  onOpenPromoModal: () => void;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  onOpenTreasuryModal,
  onOpenPromoModal,
}) => {
  // Live Gold Price Simulation (Treasury real-time)
  const [goldBuyPrice, setGoldBuyPrice] = useState(2605887);
  const [goldSellPrice, setGoldSellPrice] = useState(2519905);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [statusConfig, setStatusConfig] = useState<ServiceStatusConfig>(() => getServiceStatusConfig());

  useEffect(() => {
    const handleStatusSync = (e: any) => {
      if (e?.detail) {
        setStatusConfig(e.detail);
      } else {
        setStatusConfig(getServiceStatusConfig());
      }
    };

    window.addEventListener(EVENT_SERVICE_STATUS_UPDATED, handleStatusSync);
    window.addEventListener('storage', handleStatusSync);
    return () => {
      window.removeEventListener(EVENT_SERVICE_STATUS_UPDATED, handleStatusSync);
      window.removeEventListener('storage', handleStatusSync);
    };
  }, []);

  const testimonials = [
    {
      name: 'Andi Pratama',
      role: 'Player MLBB & Pelanggan Setia',
      text: 'Proses cepat, harga paling murah dan pelayanannya ramah banget. Reinstore top banget!',
      stars: 5,
    },
    {
      name: 'Budi Santoso',
      role: 'Pengguna Gestun PayLater',
      text: 'Pencairan limit Shopee PayLater kilat gak sampai 5 menit dana langsung landing di SeaBank. Mantap!',
      stars: 5,
    },
    {
      name: 'Rian Kurniawan',
      role: 'Pengguna DNS AdGuard & Treasury',
      text: 'DNS AdGuard nya ampuh hilangkan blokir dan live monitoring Treasury akurat banget buat scalping!',
      stars: 5,
    },
  ];

  useEffect(() => {
    // Set realistic timestamp
    const now = new Date();
    setLastUpdate(now.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }));

    // Subtle realistic fluctuation for live feeling
    const interval = setInterval(() => {
      const delta = (Math.random() - 0.5) * 400;
      setGoldBuyPrice((prev) => Math.round(prev + delta));
      setGoldSellPrice((prev) => Math.round(prev + delta));

      const updatedNow = new Date();
      setLastUpdate(updatedNow.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }));
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  return (
    <aside className="w-full flex flex-col gap-5">
      {/* 1. Harga Treasury (Live) Card */}
      <div className="bg-[#091024]/90 border border-slate-800/90 rounded-2xl p-4.5 shadow-lg relative overflow-hidden group">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Coins className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                Harga Treasury <span className="text-amber-400 text-[10px]">(Live)</span>
              </h4>
            </div>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </div>

        <div className="grid grid-cols-2 gap-2 bg-[#0c152e] border border-slate-800/90 rounded-xl p-3 mb-2.5">
          <div>
            <div className="text-[10px] text-slate-400 font-medium">Beli</div>
            <div className="text-xs sm:text-sm font-black text-white mt-0.5">
              Rp {new Intl.NumberFormat('id-ID').format(goldBuyPrice)}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-medium">Jual</div>
            <div className="text-xs sm:text-sm font-black text-slate-200 mt-0.5">
              Rp {new Intl.NumberFormat('id-ID').format(goldSellPrice)}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] text-slate-400 mb-3 px-1">
          <div className="flex items-center gap-1 text-emerald-400 font-semibold">
            <span>Spread -3.30%</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
          <span className="text-[9px] text-slate-500 font-mono">
            Update {lastUpdate || 'Live'}
          </span>
        </div>

        <button
          onClick={onOpenTreasuryModal}
          className="w-full py-2.5 px-3 rounded-xl bg-[#0070F3] hover:bg-[#0060df] text-white font-bold text-xs shadow-[0_0_15px_rgba(0,112,243,0.3)] transition-all flex items-center justify-center gap-1.5 active:scale-98"
        >
          <span>Lihat Detail</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 2. Status Layanan Card (Controlled via Admin Panel) */}
      {statusConfig.showCard && (
        <div className="bg-[#091024]/90 border border-slate-800/90 rounded-2xl p-4.5 shadow-lg transition-all">
          <div className="flex items-center gap-2 mb-3">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                statusConfig.overallStatus === 'online'
                  ? 'bg-emerald-500 shadow-[0_0_8px_#22c55e] animate-pulse'
                  : statusConfig.overallStatus === 'maintenance'
                  ? 'bg-amber-400 shadow-[0_0_8px_#f59e0b] animate-pulse'
                  : statusConfig.overallStatus === 'issue'
                  ? 'bg-rose-500 shadow-[0_0_8px_#f43f5e] animate-pulse'
                  : 'bg-slate-500'
              }`}
            />
            <div>
              <h4 className="text-xs font-bold text-white">
                {statusConfig.overallTitle || 'Online'}
              </h4>
              <p className="text-[10px] text-slate-400">
                {statusConfig.overallSubtext || 'Semua layanan berjalan normal.'}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-2 border-t border-slate-800/80">
            {statusConfig.services.map((srv) => {
              const isServiceActive = srv.enabled && srv.status !== 'Nonaktif';
              const badgeStatus = !srv.enabled ? 'Nonaktif' : srv.status;

              let badgeClasses = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
              if (badgeStatus === 'Maintenance') {
                badgeClasses = 'text-amber-400 bg-amber-500/10 border-amber-500/20';
              } else if (badgeStatus === 'Gangguan') {
                badgeClasses = 'text-rose-400 bg-rose-500/10 border-rose-500/20';
              } else if (badgeStatus === 'Segera Hadir') {
                badgeClasses = 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
              } else if (badgeStatus === 'Nonaktif') {
                badgeClasses = 'text-slate-400 bg-slate-800/90 border-slate-700/60';
              }

              return (
                <div
                  key={srv.id}
                  className={`flex items-center justify-between text-xs py-1 transition ${
                    !isServiceActive ? 'opacity-55' : ''
                  }`}
                >
                  <span className="text-slate-300 font-medium text-[11px] flex items-center gap-1.5">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        badgeStatus === 'Aktif'
                          ? 'bg-emerald-400'
                          : badgeStatus === 'Maintenance'
                          ? 'bg-amber-400'
                          : badgeStatus === 'Gangguan'
                          ? 'bg-rose-400'
                          : badgeStatus === 'Segera Hadir'
                          ? 'bg-cyan-400'
                          : 'bg-slate-600'
                      }`}
                    />
                    {srv.name}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${badgeClasses}`}
                  >
                    {badgeStatus}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Testimoni Pelanggan Card */}
      <div className="bg-[#091024]/90 border border-slate-800/90 rounded-2xl p-4.5 shadow-lg relative">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Testimoni Pelanggan
          </h4>
          <Quote className="w-4 h-4 text-blue-500/40" />
        </div>

        <div className="min-h-[5.5rem] flex flex-col justify-between">
          <p className="text-xs text-slate-300 italic leading-relaxed">
            "{testimonials[testimonialIndex].text}"
          </p>
          <div className="mt-2.5">
            <span className="text-xs font-bold text-white block">
              – {testimonials[testimonialIndex].name}
            </span>
            <div className="flex items-center gap-1 mt-1 text-amber-400">
              {[...Array(testimonials[testimonialIndex].stars)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-amber-400" />
              ))}
            </div>
          </div>
        </div>

        {/* Carousel Dots */}
        <div className="flex items-center justify-center gap-1.5 mt-3 pt-2 border-t border-slate-800/80">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setTestimonialIndex(idx)}
              className={`h-1.5 rounded-full transition-all ${
                testimonialIndex === idx ? 'w-5 bg-[#00A3FF]' : 'w-1.5 bg-slate-700'
              }`}
            />
          ))}
        </div>
      </div>

      {/* 4. Promo Menarik Card */}
      <div className="bg-gradient-to-br from-[#0c1a3d] to-[#081024] border border-blue-500/30 rounded-2xl p-4.5 shadow-xl relative overflow-hidden group">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h4 className="text-xs font-black text-white">Jangan Lewatkan</h4>
            <h3 className="text-sm font-black text-[#00A3FF]">Promo Menarik!</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-[#00A3FF]">
            <Gift className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          </div>
        </div>

        <p className="text-xs text-slate-300 mb-3.5 leading-relaxed">
          Dapatkan harga spesial setiap hari khusus untuk pelanggan setia.
        </p>

        <button
          onClick={onOpenPromoModal}
          className="w-full py-2.5 px-3 rounded-xl bg-[#0070F3] hover:bg-[#0060df] text-white font-bold text-xs shadow-[0_0_15px_rgba(0,112,243,0.35)] transition-all flex items-center justify-center gap-1.5 active:scale-98"
        >
          <span>Lihat Promo</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
