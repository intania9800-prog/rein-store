import React from 'react';
import { Search, User, LogOut, ShieldCheck } from 'lucide-react';
import { ReinstoreLogo } from './icons/BrandLogos';
import { User as UserType } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currentUser: UserType | null;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onLogout: () => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  currentUser,
  onOpenLogin,
  onOpenRegister,
  onLogout,
  onOpenAdmin,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#050814]/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div
          onClick={() => setActiveTab('beranda')}
          className="cursor-pointer transition-transform hover:scale-102"
        >
          <ReinstoreLogo size="md" />
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {[
            { id: 'beranda', label: 'Beranda' },
            { id: 'produk', label: 'Produk' },
            { id: 'riwayat', label: 'Riwayat' },
            { id: 'tentang', label: 'Tentang Kami' },
            { id: 'kontak', label: 'Kontak' },
          ].map((nav) => {
            const isActive = activeTab === nav.id;
            return (
              <button
                key={nav.id}
                onClick={() => setActiveTab(nav.id)}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all relative ${
                  isActive
                    ? 'text-[#00A3FF] bg-blue-950/40'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                {nav.label}
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#00A3FF] rounded-full shadow-[0_0_8px_#00A3FF]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Search & Auth Actions */}
        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="relative hidden sm:block w-48 md:w-64 lg:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari produk, game, atau layanan..."
              className="w-full bg-[#0a1024] border border-slate-800/90 text-xs text-slate-200 placeholder:text-slate-500 rounded-xl pl-9 pr-3.5 py-2 focus:outline-none focus:border-[#00A3FF] focus:ring-1 focus:ring-[#00A3FF] transition-all"
            />
          </div>

          {/* User state buttons */}
          {currentUser ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-[#0c1630] border border-blue-900/40 px-3 py-1.5 rounded-xl">
                <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-xs font-bold text-white leading-tight flex items-center gap-1">
                    {currentUser.name}
                    {currentUser.isVerified2FA && (
                      <span title="2FA Terverifikasi">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      </span>
                    )}
                  </span>
                  <span className="text-[10px] text-slate-400 leading-none">
                    {currentUser.role === 'admin' ? 'Administrator' : 'Member Aktif'}
                  </span>
                </div>
              </div>

              <button
                onClick={onLogout}
                title="Keluar Akun"
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800/60 rounded-xl transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenLogin}
                className="px-4 py-2 text-xs md:text-sm font-semibold text-slate-300 hover:text-white transition-colors"
              >
                Login
              </button>
              <button
                onClick={onOpenRegister}
                className="px-4 py-2 text-xs md:text-sm font-bold bg-[#0070F3] hover:bg-[#0060df] active:scale-95 text-white rounded-xl shadow-[0_0_15px_rgba(0,112,243,0.35)] transition-all"
              >
                Daftar
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
