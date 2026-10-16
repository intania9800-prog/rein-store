import React from 'react';
import { Gamepad2, Smartphone, Zap, CreditCard, LayoutGrid } from 'lucide-react';
import { CategoryType } from '../types';

interface QuickCategoriesProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
}

export const QuickCategories: React.FC<QuickCategoriesProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const categories = [
    {
      id: 'game',
      name: 'Top Up Game',
      desc: 'Mobile Legends, PUBG, Free Fire, Genshin, dll',
      icon: Gamepad2,
      color: 'text-blue-400',
      bgColor: 'bg-blue-600/15 border-blue-500/25',
      activeColor: 'border-blue-500 bg-blue-900/30 shadow-[0_0_20px_rgba(59,130,246,0.3)]',
    },
    {
      id: 'pulsa',
      name: 'Pulsa & Paket Data',
      desc: 'Telkomsel, XL, Indosat, Tri, Smartfren, dll',
      icon: Smartphone,
      color: 'text-sky-400',
      bgColor: 'bg-sky-600/15 border-sky-500/25',
      activeColor: 'border-sky-500 bg-sky-900/30 shadow-[0_0_20px_rgba(14,165,233,0.3)]',
    },
    {
      id: 'pln',
      name: 'Token Listrik',
      desc: 'PLN Prabayar & Pascabayar',
      icon: Zap,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-600/15 border-emerald-500/25',
      activeColor: 'border-emerald-500 bg-emerald-900/30 shadow-[0_0_20px_rgba(16,185,129,0.3)]',
    },
    {
      id: 'tagihan',
      name: 'Bayar Tagihan',
      desc: 'BPJS, PDAM, e-Wallet, dll',
      icon: CreditCard,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-600/15 border-indigo-500/25',
      activeColor: 'border-indigo-500 bg-indigo-900/30 shadow-[0_0_20px_rgba(99,102,241,0.3)]',
    },
    {
      id: 'digital',
      name: 'Layanan Digital',
      desc: 'Web Monitor, DNS, Gestun, PayLater, dll',
      icon: LayoutGrid,
      color: 'text-purple-400',
      bgColor: 'bg-purple-600/15 border-purple-500/25',
      activeColor: 'border-purple-500 bg-purple-900/30 shadow-[0_0_20px_rgba(168,85,247,0.3)]',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 mb-10">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(isSelected ? 'all' : cat.id)}
              className={`p-3.5 rounded-2xl border transition-all text-left flex items-start gap-3 group ${
                isSelected
                  ? cat.activeColor
                  : 'bg-[#091024]/80 border-slate-800/80 hover:bg-[#0d1733] hover:border-slate-700'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${cat.bgColor} ${cat.color}`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-white group-hover:text-[#00A3FF] transition-colors truncate">
                  {cat.name}
                </span>
                <span className="text-[10px] text-slate-400 leading-snug line-clamp-2 mt-0.5">
                  {cat.desc}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
