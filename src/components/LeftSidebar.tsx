import React from 'react';
import {
  User,
  Gamepad2,
  Smartphone,
  Zap,
  TrendingUp,
  Shield,
  CreditCard,
  MessageCircle,
} from 'lucide-react';
import { ADMIN_WHATSAPP_SUPPORT } from '../data/products';
import {
  DanaLogo,
  OvoLogo,
  GoPayLogo,
  ShopeePayLogo,
  BCALogo,
  SeaBankLogo,
  AlfamartLogo,
  IndomaretLogo,
  QRISLogo,
} from './icons/BrandLogos';

interface LeftSidebarProps {
  onOpenRegister: () => void;
  onFilterCategory: (cat: string) => void;
  onSelectProduct: (productId: string) => void;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  onOpenRegister,
  onFilterCategory,
  onSelectProduct,
}) => {
  const handleOpenWhatsApp = () => {
    const cleanNumber = ADMIN_WHATSAPP_SUPPORT.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      'Halo Admin Reinstore, saya butuh bantuan mengenai transaksi atau layanan digital di Reinstore.'
    );
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
  };

  return (
    <aside className="w-full flex flex-col gap-5">
      {/* 1. Belum Punya Akun Card */}
      <div className="bg-[#091024]/90 border border-slate-800/90 rounded-2xl p-4.5 text-center shadow-lg relative overflow-hidden group">
        <div className="w-12 h-12 rounded-full bg-blue-600/20 border border-blue-500/40 text-[#00A3FF] flex items-center justify-center mx-auto mb-3 shadow-[0_0_15px_rgba(0,163,255,0.2)]">
          <User className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-bold text-white mb-1">Belum punya akun?</h4>
        <p className="text-xs text-slate-400 mb-4 leading-relaxed">
          Daftar sekarang dan nikmati kemudahan transaksi di Reinstore.
        </p>
        <button
          onClick={onOpenRegister}
          className="w-full py-2.5 px-4 rounded-xl bg-[#0070F3] hover:bg-[#0060df] text-white font-bold text-xs shadow-[0_0_15px_rgba(0,112,243,0.3)] transition-all active:scale-98"
        >
          Daftar Sekarang
        </button>
      </div>

      {/* 2. Produk Unggulan Card */}
      <div className="bg-[#091024]/90 border border-slate-800/90 rounded-2xl p-4.5 shadow-lg">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 px-1">
          Produk Unggulan
        </h4>
        <div className="flex flex-col gap-1.5">
          {[
            { id: 'game', label: 'Top Up Game', icon: Gamepad2, color: 'text-blue-400' },
            { id: 'pulsa', label: 'Pulsa & Paket Data', icon: Smartphone, color: 'text-sky-400' },
            { id: 'pln', label: 'Token Listrik', icon: Zap, color: 'text-emerald-400' },
            { id: 'treasury', label: 'Web Monitor Treasury', icon: TrendingUp, color: 'text-amber-400', isProduct: true },
            { id: 'dns-adguard', label: 'DNS AdGuard', icon: Shield, color: 'text-emerald-400', isProduct: true },
            { id: 'gestun', label: 'Gestun PayLater', icon: CreditCard, color: 'text-purple-400', isProduct: true },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.isProduct) {
                    onSelectProduct(item.id);
                  } else {
                    onFilterCategory(item.id);
                  }
                }}
                className="flex items-center gap-3 p-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all text-left group"
              >
                <div className={`p-1.5 rounded-lg bg-slate-800/60 ${item.color} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Metode Pembayaran Card */}
      <div className="bg-[#091024]/90 border border-slate-800/90 rounded-2xl p-4.5 shadow-lg">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 px-1">
          Metode Pembayaran
        </h4>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-[#0c152e] border border-slate-800 rounded-xl p-1.5 flex items-center justify-center">
            <BCALogo />
          </div>
          <div className="bg-[#0c152e] border border-slate-800 rounded-xl p-1.5 flex items-center justify-center">
            <SeaBankLogo />
          </div>
          <div className="bg-[#0c152e] border border-slate-800 rounded-xl p-1.5 flex items-center justify-center">
            <DanaLogo />
          </div>
          <div className="bg-[#0c152e] border border-slate-800 rounded-xl p-1.5 flex items-center justify-center">
            <GoPayLogo />
          </div>
          <div className="bg-[#0c152e] border border-slate-800 rounded-xl p-1.5 flex items-center justify-center">
            <OvoLogo />
          </div>
          <div className="bg-[#0c152e] border border-slate-800 rounded-xl p-1.5 flex items-center justify-center">
            <ShopeePayLogo />
          </div>
          <div className="bg-[#0c152e] border border-slate-800 rounded-xl p-1.5 flex items-center justify-center">
            <AlfamartLogo />
          </div>
          <div className="bg-[#0c152e] border border-slate-800 rounded-xl p-1.5 flex items-center justify-center">
            <IndomaretLogo />
          </div>
          <div className="col-span-2 bg-[#0c152e] border border-slate-800 rounded-xl p-2 flex items-center justify-center">
            <QRISLogo />
          </div>
        </div>
      </div>

      {/* 4. Hubungi Kami Card */}
      <div className="bg-[#091024]/90 border border-slate-800/90 rounded-2xl p-4.5 shadow-lg text-center">
        <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-2 shadow-[0_0_15px_rgba(34,197,94,0.2)]">
          <MessageCircle className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-bold text-white mb-0.5">Hubungi Kami</h4>
        <p className="text-xs text-slate-400 mb-3.5">
          Butuh bantuan? Chat admin sekarang!
        </p>
        <button
          onClick={handleOpenWhatsApp}
          className="w-full py-2.5 px-4 rounded-xl bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold text-xs shadow-[0_0_15px_rgba(34,197,94,0.35)] transition-all active:scale-98 flex items-center justify-center gap-2"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Chat via WhatsApp</span>
        </button>
      </div>
    </aside>
  );
};
