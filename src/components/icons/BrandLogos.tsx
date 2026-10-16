import React from 'react';

// Reinstore Brand Logo
export const ReinstoreLogo: React.FC<{ className?: string; showText?: boolean; size?: 'sm' | 'md' | 'lg' }> = ({
  className = '',
  showText = true,
  size = 'md',
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className={`relative ${iconSizes[size]} shrink-0 flex items-center justify-center`}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_0_15px_rgba(0,163,255,0.5)]">
          <path
            d="M34 26H66C76 26 84 33 84 42C84 49.5 78 55.5 70 57.5L88 80H70L55 59H44V80H32V26H34ZM44 38V48H64C68 48 72 45.5 72 42C72 38.5 68 38 64 38H44Z"
            fill="white"
          />
          <polygon points="26,50 42,50 36,56 20,56" fill="#00A3FF" />
          <polygon points="22,62 44,62 38,68 16,68" fill="#00A3FF" />
        </svg>
      </div>
      {showText && (
        <div className="flex flex-col leading-none">
          <div className={`font-black tracking-tight ${textSizes[size]} flex items-center`}>
            <span className="text-white">rein</span>
            <span className="text-[#00A3FF]">store</span>
          </div>
          <span className="text-[10px] text-slate-400 font-medium tracking-wider mt-0.5">
            Top Up • Digital Services • More
          </span>
        </div>
      )}
    </div>
  );
};

// Mobile Legends: Bang Bang Official Logo
export const MLBBLogo: React.FC<{ className?: string }> = ({ className = 'w-12 h-12' }) => (
  <div className={`relative overflow-hidden rounded-2xl bg-[#091129] border border-blue-500/40 shadow-lg p-0.5 flex items-center justify-center ${className}`}>
    <img src="/images/mlbb.png" alt="Mobile Legends Bang Bang" className="w-full h-full object-contain rounded-xl" />
  </div>
);

// PUBG Mobile Official Logo
export const PUBGLogo: React.FC<{ className?: string }> = ({ className = 'w-12 h-12' }) => (
  <div className={`relative overflow-hidden rounded-2xl bg-[#0a0a0a] border border-amber-500/40 shadow-lg p-0.5 flex items-center justify-center ${className}`}>
    <img src="/images/pubg.png" alt="PUBG Mobile" className="w-full h-full object-contain rounded-xl" />
  </div>
);

// Free Fire Official Logo
export const FreeFireLogo: React.FC<{ className?: string }> = ({ className = 'w-12 h-12' }) => (
  <div className={`relative overflow-hidden rounded-2xl bg-[#140608] border border-orange-500/40 shadow-lg p-0.5 flex items-center justify-center ${className}`}>
    <img src="/images/freefire.png" alt="Free Fire" className="w-full h-full object-contain rounded-xl" />
  </div>
);

// Genshin Impact Official Logo
export const GenshinLogo: React.FC<{ className?: string }> = ({ className = 'w-12 h-12' }) => (
  <div className={`relative overflow-hidden rounded-2xl bg-[#091522] border border-teal-500/40 shadow-lg p-0.5 flex items-center justify-center ${className}`}>
    <img src="/images/genshin.png" alt="Genshin Impact" className="w-full h-full object-contain rounded-xl" />
  </div>
);

// Point Blank Official Logo
export const PointBlankLogo: React.FC<{ className?: string }> = ({ className = 'w-12 h-12' }) => (
  <div className={`relative overflow-hidden rounded-2xl bg-[#0d131a] border border-red-600/40 shadow-lg p-0.5 flex items-center justify-center ${className}`}>
    <img src="/images/pointblank.png" alt="Point Blank" className="w-full h-full object-contain rounded-xl" />
  </div>
);

// Telkomsel Official Logo
export const TelkomselLogo: React.FC<{ className?: string }> = ({ className = 'w-12 h-12' }) => (
  <div className={`relative overflow-hidden rounded-2xl bg-white p-1.5 flex items-center justify-center border border-red-500/30 shadow-md ${className}`}>
    <img src="/images/telkomsel.png" alt="Telkomsel" className="w-full h-full object-contain" />
  </div>
);

// XL Axiata Official Logo
export const XLLogo: React.FC<{ className?: string }> = ({ className = 'w-12 h-12' }) => (
  <div className={`relative overflow-hidden rounded-2xl bg-white p-1 flex items-center justify-center border border-blue-500/30 shadow-md ${className}`}>
    <img src="/images/xl.png" alt="XL Axiata" className="w-full h-full object-contain" />
  </div>
);

// Tri (3) Official Logo
export const TriLogo: React.FC<{ className?: string }> = ({ className = 'w-12 h-12' }) => (
  <div className={`relative overflow-hidden rounded-2xl bg-white p-1 flex items-center justify-center shadow-md border border-slate-200 ${className}`}>
    <img src="/images/tri.png" alt="Tri" className="w-full h-full object-contain" />
  </div>
);

// Indosat Ooredoo IM3 Official Logo
export const IndosatLogo: React.FC<{ className?: string }> = ({ className = 'w-12 h-12' }) => (
  <div className={`relative overflow-hidden rounded-2xl bg-white p-1 flex items-center justify-center shadow-md border border-slate-200 ${className}`}>
    <img src="/images/indosat.png" alt="Indosat IM3" className="w-full h-full object-contain" />
  </div>
);

// Token Listrik PLN Official Logo
export const PLNLogo: React.FC<{ className?: string }> = ({ className = 'w-12 h-12' }) => (
  <div className={`relative overflow-hidden rounded-2xl bg-white p-1 flex items-center justify-center border border-slate-200 shadow-xl ${className}`}>
    <img src="/images/pln.png" alt="PLN" className="w-full h-full object-contain" />
  </div>
);

// Treasury Official Logo
export const TreasuryLogo: React.FC<{ className?: string }> = ({ className = 'w-12 h-12' }) => (
  <div className={`relative overflow-hidden rounded-2xl bg-black p-0.5 flex items-center justify-center border border-amber-500/40 shadow-lg ${className}`}>
    <img src="/images/treasury.png" alt="Treasury" className="w-full h-full object-contain rounded-xl" />
  </div>
);

// AdGuard Official Logo
export const AdGuardLogo: React.FC<{ className?: string }> = ({ className = 'w-12 h-12' }) => (
  <div className={`relative overflow-hidden rounded-2xl bg-[#091512] p-1 flex items-center justify-center border border-emerald-500/40 shadow-lg ${className}`}>
    <img src="/images/adguard.png" alt="AdGuard" className="w-full h-full object-contain rounded-xl" />
  </div>
);

// Gestun PayLater Logo
export const GestunLogo: React.FC<{ className?: string }> = ({ className = 'w-12 h-12' }) => (
  <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-900 to-fuchsia-900 p-0.5 flex items-center justify-center border border-purple-500/40 shadow-lg ${className}`}>
    <img src="/images/gestun.svg" alt="Gestun PayLater" className="w-full h-full object-contain" />
  </div>
);

// Steam Official Logo
export const SteamLogo: React.FC<{ className?: string }> = ({ className = 'w-11 h-11' }) => (
  <div className={`relative overflow-hidden rounded-2xl bg-[#171a21] border border-blue-400/30 flex items-center justify-center shadow-md p-1.5 ${className}`}>
    <img src="/images/steam.png" alt="Steam" className="w-full h-full object-contain" />
  </div>
);

// Google Play Official Logo
export const GooglePlayLogo: React.FC<{ className?: string }> = ({ className = 'w-11 h-11' }) => (
  <div className={`relative overflow-hidden rounded-2xl bg-white border border-slate-300 flex items-center justify-center shadow-md p-1.5 ${className}`}>
    <img src="/images/googleplay.png" alt="Google Play" className="w-full h-full object-contain" />
  </div>
);

// QRIS Official Logo
export const QRISLogo: React.FC<{ className?: string }> = ({ className = 'h-6' }) => (
  <div className={`flex items-center gap-1 font-black ${className}`}>
    <div className="bg-[#ED1C24] text-white px-2 py-0.5 rounded text-xs tracking-wider font-mono">
      QRIS
    </div>
    <span className="text-[10px] text-slate-300 font-bold hidden sm:inline">GPN</span>
  </div>
);

// Bank BCA Logo
export const BCALogo: React.FC<{ className?: string }> = ({ className = 'h-6' }) => (
  <div className={`flex items-center justify-center bg-white px-2 py-0.5 rounded shadow-sm ${className}`}>
    <img src="/images/bca.png" alt="BCA" className="h-4 object-contain" />
  </div>
);

// SeaBank Logo
export const SeaBankLogo: React.FC<{ className?: string }> = ({ className = 'h-6' }) => (
  <div className={`flex items-center justify-center bg-white px-2 py-0.5 rounded shadow-sm ${className}`}>
    <img src="/images/seabank.png" alt="SeaBank" className="h-4 object-contain" />
  </div>
);

// KROM Bank Logo
export const KromLogo: React.FC<{ className?: string }> = ({ className = 'h-6' }) => (
  <div className={`flex items-center justify-center bg-white px-2 py-0.5 rounded shadow-sm ${className}`}>
    <img src="/images/krom.png" alt="KROM" className="h-4 object-contain" />
  </div>
);

// DANA Logo
export const DanaLogo: React.FC<{ className?: string }> = ({ className = 'h-6' }) => (
  <div className={`flex items-center justify-center bg-white px-2 py-0.5 rounded shadow-sm ${className}`}>
    <img src="/images/dana.png" alt="DANA" className="h-4 object-contain" />
  </div>
);

// OVO Logo
export const OvoLogo: React.FC<{ className?: string }> = ({ className = 'h-6' }) => (
  <div className={`flex items-center justify-center bg-white px-2 py-0.5 rounded shadow-sm ${className}`}>
    <img src="/images/ovo.png" alt="OVO" className="h-4 object-contain" />
  </div>
);

// GoPay Logo
export const GoPayLogo: React.FC<{ className?: string }> = ({ className = 'h-6' }) => (
  <div className={`flex items-center justify-center bg-white px-2 py-0.5 rounded shadow-sm ${className}`}>
    <img src="/images/gopay.png" alt="GoPay" className="h-4 object-contain" />
  </div>
);

// ShopeePay Logo
export const ShopeePayLogo: React.FC<{ className?: string }> = ({ className = 'h-6' }) => (
  <div className={`flex items-center justify-center bg-white px-2 py-0.5 rounded shadow-sm ${className}`}>
    <img src="/images/shopeepay.png" alt="ShopeePay" className="h-4 object-contain" />
  </div>
);

// Alfamart Logo
export const AlfamartLogo: React.FC<{ className?: string }> = ({ className = 'h-6' }) => (
  <div className={`flex items-center justify-center bg-white px-2 py-0.5 rounded border border-slate-200 ${className}`}>
    <img src="/images/alfamart.png" alt="Alfamart" className="h-4 object-contain" />
  </div>
);

// Indomaret Logo
export const IndomaretLogo: React.FC<{ className?: string }> = ({ className = 'h-6' }) => (
  <div className={`flex items-center justify-center bg-white px-2 py-0.5 rounded border border-slate-200 ${className}`}>
    <img src="/images/indomaret.png" alt="Indomaret" className="h-4 object-contain" />
  </div>
);

// Bank Mandiri Logo
export const MandiriLogo: React.FC<{ className?: string }> = ({ className = 'h-6' }) => (
  <div className={`flex items-center justify-center bg-[#003d79] text-white font-black px-2 py-0.5 rounded tracking-tighter text-xs shadow-sm ${className}`}>
    <span className="font-extrabold text-[11px] text-white">mandirı</span>
    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 ml-0.5 inline-block" />
  </div>
);

// Bank BRI Logo
export const BRILogo: React.FC<{ className?: string }> = ({ className = 'h-6' }) => (
  <div className={`flex items-center justify-center bg-[#00529C] text-white font-black px-2.5 py-0.5 rounded tracking-wide text-xs shadow-sm ${className}`}>
    <span className="font-black text-xs text-white">BRI</span>
  </div>
);

// Bank BNI Logo
export const BNILogo: React.FC<{ className?: string }> = ({ className = 'h-6' }) => (
  <div className={`flex items-center justify-center bg-[#005E6A] text-white font-black px-2 py-0.5 rounded tracking-wider text-xs shadow-sm ${className}`}>
    <span className="text-white font-black text-xs">BNI</span>
    <span className="text-[#F15A24] font-black text-xs ml-0.5">46</span>
  </div>
);

// Bank BSI Logo
export const BSILogo: React.FC<{ className?: string }> = ({ className = 'h-6' }) => (
  <div className={`flex items-center justify-center bg-[#00A39D] text-white font-black px-2 py-0.5 rounded tracking-wider text-xs shadow-sm ${className}`}>
    <span className="text-white font-black text-xs">BSI</span>
  </div>
);

// Bank Jago Logo
export const JagoLogo: React.FC<{ className?: string }> = ({ className = 'h-6' }) => (
  <div className={`flex items-center justify-center bg-[#4A154B] text-[#F39C12] font-black px-2 py-0.5 rounded tracking-normal text-xs shadow-sm ${className}`}>
    <span className="text-[#F39C12] font-extrabold text-xs">jago</span>
  </div>
);

// Universal Logo Renderer for any bank or e-wallet
export const UniversalBankLogo: React.FC<{ bankCode?: string; bankName?: string; id?: string; className?: string }> = ({
  bankCode = '',
  bankName = '',
  id = '',
  className = 'h-6',
}) => {
  const code = (bankCode || id || bankName).toUpperCase();

  if (code.includes('BCA')) return <BCALogo className={className} />;
  if (code.includes('SEABANK') || code.includes('SEA')) return <SeaBankLogo className={className} />;
  if (code.includes('KROM')) return <KromLogo className={className} />;
  if (code.includes('MANDIRI')) return <MandiriLogo className={className} />;
  if (code.includes('BRI')) return <BRILogo className={className} />;
  if (code.includes('BNI')) return <BNILogo className={className} />;
  if (code.includes('BSI') || code.includes('SYARIAH')) return <BSILogo className={className} />;
  if (code.includes('JAGO')) return <JagoLogo className={className} />;
  if (code.includes('DANA')) return <DanaLogo className={className} />;
  if (code.includes('OVO')) return <OvoLogo className={className} />;
  if (code.includes('GOPAY') || code.includes('GOJEK')) return <GoPayLogo className={className} />;
  if (code.includes('SHOPEE')) return <ShopeePayLogo className={className} />;
  if (code.includes('ALFA')) return <AlfamartLogo className={className} />;
  if (code.includes('INDO')) return <IndomaretLogo className={className} />;
  if (code.includes('QRIS')) return <QRISLogo className={className} />;

  // Default fallback badge
  return (
    <div className={`flex items-center justify-center bg-slate-800 border border-slate-700 text-cyan-400 font-bold px-2 py-0.5 rounded text-[11px] shadow-sm uppercase ${className}`}>
      {bankCode || bankName.slice(0, 4) || 'BANK'}
    </div>
  );
};

// Universal Product Brand Icon helper
export const ProductBrandIcon: React.FC<{ type: string; className?: string }> = ({
  type,
  className = 'w-6 h-6',
}) => {
  switch (type) {
    case 'mlbb':
      return <MLBBLogo className={className} />;
    case 'freefire':
      return <FreeFireLogo className={className} />;
    case 'pubg':
      return <PUBGLogo className={className} />;
    case 'genshin':
      return <GenshinLogo className={className} />;
    case 'pointblank':
      return <PointBlankLogo className={className} />;
    case 'telkomsel':
      return <TelkomselLogo className={className} />;
    case 'pln':
      return <PLNLogo className={className} />;
    case 'treasury':
      return <TreasuryLogo className={className} />;
    case 'adguard':
      return <AdGuardLogo className={className} />;
    case 'gestun':
      return <GestunLogo className={className} />;
    case 'xl':
      return <XLLogo className={className} />;
    case 'indosat':
      return <IndosatLogo className={className} />;
    case 'tri':
      return <TriLogo className={className} />;
    default:
      return (
        <div className={`rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xs text-slate-300 font-bold uppercase ${className}`}>
          {type?.slice(0, 3) || 'PRD'}
        </div>
      );
  }
};


