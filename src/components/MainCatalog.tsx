import React from 'react';
import {
  Gamepad2,
  Smartphone,
  Zap,
  LayoutGrid,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Product } from '../types';
import {
  MLBBLogo,
  FreeFireLogo,
  PUBGLogo,
  GenshinLogo,
  PointBlankLogo,
  TelkomselLogo,
  PLNLogo,
  TreasuryLogo,
  AdGuardLogo,
  GestunLogo,
  XLLogo,
  IndosatLogo,
  ProductBrandIcon,
} from './icons/BrandLogos';

interface MainCatalogProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onFilterCategory: (category: string) => void;
}

export const MainCatalog: React.FC<MainCatalogProps> = ({
  products,
  onSelectProduct,
  onFilterCategory,
}) => {
  // Render Logo based on iconType or customLogoUrl
  const renderProductLogo = (product: Product) => {
    return (
      <ProductBrandIcon
        type={product.iconType}
        customLogoUrl={product.customLogoUrl}
        className="w-14 h-14"
      />
    );
  };

  return (
    <div className="flex-1 flex flex-col gap-10">
      {/* 1. Kategori Produk Section */}
      <section>
        <div className="mb-4">
          <h2 className="text-xl font-black text-white tracking-tight">Kategori Produk</h2>
          <p className="text-xs text-slate-400">Pilih kategori layanan yang kamu butuhkan</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Card 1: Top Up Game */}
          <div className="bg-gradient-to-b from-[#1c121e] to-[#0e0e1e] border border-orange-500/20 rounded-2xl p-4 flex flex-col justify-between shadow-lg group hover:border-orange-500/40 transition-all">
            <div>
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-white mb-3 shadow-[0_0_15px_rgba(249,115,22,0.3)]">
                <Gamepad2 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Top Up Game</h3>
              <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                Mobile Legends, Free Fire, PUBG, Genshin, dll
              </p>
            </div>
            <button
              onClick={() => onFilterCategory('game')}
              className="mt-4 w-full py-2 px-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-98 transition-all"
            >
              <span>Lihat Semua</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2: Pulsa & Paket Data */}
          <div className="bg-gradient-to-b from-[#0e172e] to-[#080d1f] border border-blue-500/20 rounded-2xl p-4 flex flex-col justify-between shadow-lg group hover:border-blue-500/40 transition-all">
            <div>
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white mb-3 shadow-[0_0_15px_rgba(2,132,199,0.3)]">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Pulsa & Paket Data</h3>
              <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                Telkomsel, XL, Indosat, Tri, Smartfren, dll
              </p>
            </div>
            <button
              onClick={() => onFilterCategory('pulsa')}
              className="mt-4 w-full py-2 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-98 transition-all"
            >
              <span>Lihat Semua</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 3: Token Listrik */}
          <div className="bg-gradient-to-b from-[#0a1f18] to-[#06120e] border border-emerald-500/20 rounded-2xl p-4 flex flex-col justify-between shadow-lg group hover:border-emerald-500/40 transition-all">
            <div>
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white mb-3 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Token Listrik</h3>
              <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                PLN Prabayar & Pascabayar
              </p>
            </div>
            <button
              onClick={() => onFilterCategory('pln')}
              className="mt-4 w-full py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-98 transition-all"
            >
              <span>Lihat Semua</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 4: Layanan Digital */}
          <div className="bg-gradient-to-b from-[#190e2e] to-[#0c0817] border border-purple-500/20 rounded-2xl p-4 flex flex-col justify-between shadow-lg group hover:border-purple-500/40 transition-all">
            <div>
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-fuchsia-400 flex items-center justify-center text-white mb-3 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                <LayoutGrid className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Layanan Digital</h3>
              <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                Web Monitor, DNS, Gestun, PayLater
              </p>
            </div>
            <button
              onClick={() => onFilterCategory('digital')}
              className="mt-4 w-full py-2 px-3 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-98 transition-all"
            >
              <span>Lihat Semua</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 2. Produk Terpopuler Section */}
      <section id="produk-terpopuler">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#00A3FF]" />
              <span>Produk Terpopuler</span>
            </h2>
            <p className="text-xs text-slate-400">
              Layanan pilihan dengan kualitas terbaik dan harga bersaing.
            </p>
          </div>
          <button
            onClick={() => onFilterCategory('all')}
            className="text-xs font-bold text-[#00A3FF] hover:text-blue-400 flex items-center gap-1 transition-colors"
          >
            <span>Lihat Semua</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 12 Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3.5">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-[#091024]/90 border border-slate-800/90 hover:border-blue-500/50 rounded-2xl p-3.5 flex flex-col justify-between shadow-lg hover:shadow-[0_0_20px_rgba(0,163,255,0.15)] transition-all group"
            >
              <div>
                {/* Logo & Badge */}
                <div className="flex items-start justify-between mb-3">
                  <div className="shrink-0 transition-transform group-hover:scale-105">
                    {renderProductLogo(product)}
                  </div>
                  {product.badge && (
                    <span className="text-[9px] font-bold text-[#00A3FF] bg-blue-950/60 border border-blue-500/30 px-2 py-0.5 rounded-full">
                      {product.badge}
                    </span>
                  )}
                </div>

                {/* Name & SubCategory */}
                <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-[#00A3FF] transition-colors truncate">
                  {product.name}
                </h3>
                <p className="text-[10px] text-slate-400 truncate mt-0.5">
                  {product.subCategory || product.category}
                </p>

                {/* Price Display */}
                <div className="mt-2.5 pt-2 border-t border-slate-800/80">
                  <span className="text-[10px] text-slate-400 font-medium">Mulai dari</span>
                  <div className="text-xs sm:text-sm font-black text-white tracking-tight">
                    {product.priceRange}
                  </div>
                </div>
              </div>

              {/* Beli Sekarang CTA button */}
              <button
                onClick={() => onSelectProduct(product)}
                className="mt-3.5 w-full py-2 px-3 rounded-xl bg-[#0070F3] hover:bg-[#0060df] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(0,112,243,0.3)] transition-all active:scale-98"
              >
                <span>Beli Sekarang</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
