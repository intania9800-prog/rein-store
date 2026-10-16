import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  Zap,
  CreditCard,
  Sparkles,
  HelpCircle,
  FileText,
  Lock,
  MessageCircle,
  ChevronDown,
  CheckCircle2,
  Phone,
  QrCode,
  LayoutGrid,
  UserCheck,
  Building2,
  ExternalLink,
  Info,
} from 'lucide-react';
import {
  ReinstoreLogo,
  QRISLogo,
  UniversalBankLogo,
  BCALogo,
  SeaBankLogo,
  KromLogo,
  DanaLogo,
  GoPayLogo,
  OvoLogo,
  ShopeePayLogo,
  AlfamartLogo,
  IndomaretLogo,
} from './icons/BrandLogos';
import {
  getReinstoreContent,
  ReinstoreContent,
  EVENT_CONTENT_UPDATED,
} from '../utils/contentStorage';
import {
  BankAccount,
  getBankAccounts,
  EVENT_BANK_ACCOUNTS_UPDATED,
} from '../utils/bankStorage';
import {
  getCSConfig,
  EVENT_CS_CONTACTS_UPDATED,
  getWhatsAppUrl,
  ContactCSConfig,
} from '../utils/contactStorage';
import { ADMIN_WHATSAPP_SUPPORT } from '../data/products';

export type InfoModalTab =
  | 'tentang'
  | 'cara-order'
  | 'pembayaran'
  | 'faq'
  | 'terms'
  | 'privacy';

interface InfoPagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: InfoModalTab;
  onOpenProductOrder?: (productId: string) => void;
}

export const InfoPagesModal: React.FC<InfoPagesModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'tentang',
  onOpenProductOrder,
}) => {
  const [activeTab, setActiveTab] = useState<InfoModalTab>(initialTab);
  const [content, setContent] = useState<ReinstoreContent>(getReinstoreContent());
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');

  // Sync initial tab when opened
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  // Sync content and listen for admin updates
  useEffect(() => {
    setContent(getReinstoreContent());

    const handleUpdate = (e: any) => {
      if (e.detail) {
        setContent(e.detail);
      } else {
        setContent(getReinstoreContent());
      }
    };

    window.addEventListener(EVENT_CONTENT_UPDATED, handleUpdate);
    return () => window.removeEventListener(EVENT_CONTENT_UPDATED, handleUpdate);
  }, []);

  // Sync bank accounts and listen for admin updates
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(() => getBankAccounts());
  const [csConfig, setCsConfig] = useState<ContactCSConfig>(() => getCSConfig());
  const [copiedBankNo, setCopiedBankNo] = useState<string | null>(null);

  useEffect(() => {
    const handleBankUpdate = () => {
      setBankAccounts(getBankAccounts());
    };
    window.addEventListener(EVENT_BANK_ACCOUNTS_UPDATED, handleBankUpdate);
    return () => window.removeEventListener(EVENT_BANK_ACCOUNTS_UPDATED, handleBankUpdate);
  }, []);

  useEffect(() => {
    const handleCSUpdate = (e: any) => {
      setCsConfig(e.detail || getCSConfig());
    };
    window.addEventListener(EVENT_CS_CONTACTS_UPDATED, handleCSUpdate);
    return () => window.removeEventListener(EVENT_CS_CONTACTS_UPDATED, handleCSUpdate);
  }, []);

  if (!isOpen) return null;

  const handleOpenWhatsApp = () => {
    const message = `Halo Admin Reinstore, saya membaca halaman ${
      activeTab === 'tentang'
        ? 'Tentang Kami'
        : activeTab === 'cara-order'
        ? 'Cara Order'
        : activeTab === 'pembayaran'
        ? 'Pembayaran'
        : activeTab === 'faq'
        ? 'FAQ'
        : activeTab === 'terms'
        ? 'Syarat & Ketentuan'
        : 'Kebijakan Privasi'
    } dan butuh panduan lebih lanjut.`;
    const url = getWhatsAppUrl(csConfig.whatsappPrimary, message);
    window.open(url, '_blank');
  };

  const tabs: { id: InfoModalTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'tentang', label: 'Tentang Kami', icon: Building2 },
    { id: 'cara-order', label: 'Cara Order', icon: LayoutGrid },
    { id: 'pembayaran', label: 'Pembayaran', icon: CreditCard },
    { id: 'faq', label: 'FAQ (Tanya Jawab)', icon: HelpCircle },
    { id: 'terms', label: 'Syarat & Ketentuan', icon: FileText },
    { id: 'privacy', label: 'Kebijakan Privasi', icon: Lock },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div
        className="relative w-full max-w-4xl max-h-[92vh] bg-[#070c1e] border border-blue-900/40 rounded-3xl shadow-[0_0_50px_rgba(0,112,243,0.2)] flex flex-col overflow-hidden text-slate-200 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-4.5 border-b border-slate-800/80 bg-[#060a1a]/90 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-3">
            <ReinstoreLogo size="sm" />
            <div className="hidden sm:block h-5 w-[1px] bg-slate-700" />
            <span className="text-xs sm:text-sm font-bold text-slate-300">
              Pusat Informasi & Bantuan Resmi
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
            title="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Horizontal Navigation Tabs */}
        <div className="flex items-center gap-1.5 px-4 sm:px-6 py-2.5 bg-[#081026] border-b border-slate-800/80 overflow-x-auto no-scrollbar shrink-0">
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Scrollable Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          {/* TAB 1: TENTANG KAMI */}
          {activeTab === 'tentang' && (
            <div className="space-y-6 animate-fade-in">
              {/* Hero Banner */}
              <div className="bg-gradient-to-r from-blue-950/60 via-[#0a1838] to-[#07132e] border border-blue-500/30 rounded-2xl p-5 sm:p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 text-[11px] font-bold mb-3">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Profil Perusahaan & Komitmen
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {content.tentang.title}
                  </h2>
                  <p className="text-sm font-semibold text-[#00A3FF] mt-1">
                    {content.tentang.tagline}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed">
                    {content.tentang.description}
                  </p>
                </div>
              </div>

              {/* Visi & Misi */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#0b142e] border border-slate-800 rounded-2xl p-4.5">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    Visi Kami
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {content.tentang.vision}
                  </p>
                </div>

                <div className="bg-[#0b142e] border border-slate-800 rounded-2xl p-4.5">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-cyan-400" />
                    Misi Kami
                  </h3>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {content.tentang.mission.map((m, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                          ✓
                        </span>
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 4 Keunggulan Utama */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Mengapa Memilih Reinstore?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {content.tentang.features.map((feat, idx) => (
                    <div
                      key={idx}
                      className="bg-[#0a1228] border border-slate-800/90 hover:border-blue-500/40 rounded-2xl p-4 transition-all"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-xl bg-blue-500/15 border border-blue-500/30 text-[#00A3FF] flex items-center justify-center">
                          {idx === 0 && <Zap className="w-4 h-4" />}
                          {idx === 1 && <ShieldCheck className="w-4 h-4 text-emerald-400" />}
                          {idx === 2 && <CreditCard className="w-4 h-4 text-purple-400" />}
                          {idx === 3 && <Sparkles className="w-4 h-4 text-amber-400" />}
                        </div>
                        <h4 className="text-xs font-bold text-white">{feat.title}</h4>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed pl-11">
                        {feat.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Layanan Unggulan Chips */}
              <div className="bg-[#081026] border border-slate-800/80 rounded-2xl p-4">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2.5">
                  Portofolio Layanan Aktif:
                </span>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-3 py-1 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-300 font-semibold">
                    🎮 Top Up Game & Diamond
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-300 font-semibold">
                    📱 Pulsa & Paket Data All Operator
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-semibold">
                    ⚡ Token Listrik PLN Prabayar
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 font-semibold">
                    📈 Web Monitor Treasury (Live Gold)
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-teal-500/15 border border-teal-500/30 text-teal-300 font-semibold">
                    🛡️ DNS AdGuard Anti-Iklan
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-300 font-semibold">
                    💳 Gestun PayLater Terpercaya
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CARA ORDER */}
          {activeTab === 'cara-order' && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-slate-800 pb-3">
                <h2 className="text-lg sm:text-xl font-black text-white">
                  {content.caraOrder.title}
                </h2>
                <p className="text-xs sm:text-sm text-[#00A3FF] mt-0.5 font-semibold">
                  {content.caraOrder.tagline}
                </p>
              </div>

              {/* 6 Steps Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {content.caraOrder.steps.map((st) => (
                  <div
                    key={st.number}
                    className="bg-[#0b142e] border border-slate-800/90 rounded-2xl p-4.5 flex gap-4 hover:border-blue-500/40 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-[0_0_15px_rgba(37,99,235,0.3)]">
                      {st.number}
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-[#00A3FF] transition-colors">
                        {st.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {st.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tips Penting Box */}
              <div className="bg-[#0a1834] border border-blue-500/30 rounded-2xl p-4.5">
                <h3 className="text-xs font-bold text-white flex items-center gap-2 mb-2">
                  <Info className="w-4 h-4 text-cyan-400" />
                  Tips Agar Pesanan Cepat Selesai:
                </h3>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {content.caraOrder.tips.map((t, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-cyan-400 font-bold">•</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* TAB 3: PEMBAYARAN */}
          {activeTab === 'pembayaran' && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-slate-800 pb-3">
                <h2 className="text-lg sm:text-xl font-black text-white">
                  {content.pembayaran.title}
                </h2>
                <p className="text-xs sm:text-sm text-[#00A3FF] mt-0.5 font-semibold">
                  {content.pembayaran.tagline}
                </p>
              </div>

              {/* Highlight QRIS */}
              <div className="bg-gradient-to-br from-[#0c183a] to-[#071128] border border-blue-500/40 rounded-2xl p-5 relative overflow-hidden">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-2 max-w-xl">
                    <div className="flex items-center gap-2">
                      <div className="bg-white px-2.5 py-1 rounded-lg">
                        <QRISLogo />
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/40">
                        Biaya Admin Rp 0 (Gratis)
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white">
                      {content.pembayaran.qrisInfo.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {content.pembayaran.qrisInfo.desc}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80">
                  <span className="text-[11px] font-bold text-slate-400 block mb-2">
                    Dapat Discan Oleh Seluruh Aplikasi:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {content.pembayaran.qrisInfo.supportedWallets.map((w, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-[#081024] border border-slate-700/80 text-[11px] text-slate-200 font-semibold"
                      >
                        {w}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Rekening Transfer Bank */}
              <div className="bg-[#0b142e] border border-slate-800 rounded-2xl p-4.5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    {content.pembayaran.bankInfo.title}
                  </h3>
                  <span className="text-[10px] text-cyan-400 font-semibold">
                    Rekening Resmi Reinstore
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {(bankAccounts.filter((a) => a.isActive && a.category === 'bank').length > 0
                    ? bankAccounts.filter((a) => a.isActive && a.category === 'bank')
                    : (content.pembayaran.bankInfo.accounts.map((c, i) => ({
                        id: `default-${i}`,
                        bankName: c.bank,
                        bankCode: c.bank,
                        accountNumber: c.accountNo,
                        accountName: c.holder,
                        category: 'bank' as const,
                        fee: 2500,
                        isActive: true,
                        badge: undefined,
                        order: i,
                      })) as BankAccount[])
                  ).map((acc) => (
                    <div
                      key={acc.id}
                      className="bg-[#070d20] border border-slate-800 hover:border-cyan-500/40 rounded-xl p-3.5 space-y-1.5 transition-all"
                    >
                      <div className="h-6 flex items-center justify-between mb-1">
                        <UniversalBankLogo
                          bankCode={acc.bankCode}
                          bankName={acc.bankName}
                          id={acc.id}
                          className="h-5"
                        />
                        {acc.badge && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-300">
                            {acc.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] font-bold text-slate-300 truncate">{acc.bankName}</div>
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-mono font-black text-cyan-400 select-all tracking-wider">
                          {acc.accountNumber}
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(acc.accountNumber);
                            setCopiedBankNo(acc.accountNumber);
                            setTimeout(() => setCopiedBankNo(null), 2000);
                          }}
                          className="text-[10px] text-slate-400 hover:text-cyan-300 underline font-semibold ml-2 cursor-pointer"
                        >
                          {copiedBankNo === acc.accountNumber ? 'Tersalin!' : 'Salin'}
                        </button>
                      </div>
                      <div className="text-[10px] text-slate-400 font-semibold">
                        a/n <strong className="text-white uppercase">{acc.accountName}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gerai Ritel Minimarket & e-Wallet */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#0b142e] border border-slate-800 rounded-2xl p-4.5 space-y-2.5">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    {content.pembayaran.minimarketInfo.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="bg-[#070d20] border border-slate-800 rounded-lg px-2 py-1">
                      <AlfamartLogo />
                    </div>
                    <div className="bg-[#070d20] border border-slate-800 rounded-lg px-2 py-1">
                      <IndomaretLogo />
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {content.pembayaran.minimarketInfo.desc}
                  </p>
                </div>

                <div className="bg-[#0b142e] border border-slate-800 rounded-2xl p-4.5 space-y-2.5">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    e-Wallet Terintegrasi
                  </h3>
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="bg-[#070d20] border border-slate-800 rounded-lg px-2 py-1">
                      <DanaLogo />
                    </div>
                    <div className="bg-[#070d20] border border-slate-800 rounded-lg px-2 py-1">
                      <GoPayLogo />
                    </div>
                    <div className="bg-[#070d20] border border-slate-800 rounded-lg px-2 py-1">
                      <OvoLogo />
                    </div>
                    <div className="bg-[#070d20] border border-slate-800 rounded-lg px-2 py-1">
                      <ShopeePayLogo />
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Mendukung pembayaran langsung dari saldo dompet digital Anda melalui scan QRIS atau transfer saldo ke rekening penampung resmi.
                  </p>
                </div>
              </div>

              {/* Panduan Pembayaran 5 Langkah */}
              <div className="bg-[#081026] border border-slate-800 rounded-2xl p-4.5">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
                  Panduan Melakukan Pembayaran QRIS:
                </h3>
                <ol className="space-y-2 text-xs text-slate-300">
                  {content.pembayaran.paymentSteps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-blue-600/30 text-blue-400 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          )}

          {/* TAB 4: FAQ */}
          {activeTab === 'faq' && (
            <div className="space-y-5 animate-fade-in">
              <div className="border-b border-slate-800 pb-3">
                <h2 className="text-lg sm:text-xl font-black text-white">
                  {content.faq.title}
                </h2>
                <p className="text-xs sm:text-sm text-[#00A3FF] mt-0.5 font-semibold">
                  {content.faq.tagline}
                </p>
              </div>

              <div className="space-y-2.5">
                {content.faq.items.map((item) => {
                  const isOpenItem = openFaqId === item.id;
                  return (
                    <div
                      key={item.id}
                      className="bg-[#0b142e] border border-slate-800/90 rounded-2xl overflow-hidden transition-all"
                    >
                      <button
                        onClick={() => setOpenFaqId(isOpenItem ? null : item.id)}
                        className="w-full px-4.5 py-3.5 flex items-center justify-between text-left hover:bg-slate-800/30 transition-colors"
                      >
                        <div className="flex items-center gap-3 pr-2">
                          <span className="w-6 h-6 rounded-lg bg-blue-500/20 text-[#00A3FF] flex items-center justify-center text-xs font-bold shrink-0">
                            ?
                          </span>
                          <span className="text-xs sm:text-sm font-bold text-white">
                            {item.question}
                          </span>
                        </div>
                        <ChevronDown
                          className={`w-4 h-4 text-slate-400 transition-transform shrink-0 ${
                            isOpenItem ? 'rotate-180 text-blue-400' : ''
                          }`}
                        />
                      </button>

                      {isOpenItem && (
                        <div className="px-5 pb-4 pt-1 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 bg-[#070e24]">
                          {item.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 5: SYARAT & KETENTUAN */}
          {activeTab === 'terms' && (
            <div className="space-y-5 animate-fade-in">
              <div className="border-b border-slate-800 pb-3">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-lg sm:text-xl font-black text-white">
                    {content.terms.title}
                  </h2>
                  <span className="text-[10px] text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-full">
                    Pembaruan: {content.terms.lastUpdated}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#00A3FF] mt-0.5 font-semibold">
                  {content.terms.tagline}
                </p>
              </div>

              <div className="space-y-4">
                {content.terms.sections.map((sec, idx) => (
                  <div
                    key={idx}
                    className="bg-[#0b142e] border border-slate-800/90 rounded-2xl p-4.5 space-y-2"
                  >
                    <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                      <span className="text-blue-400">§</span>
                      {sec.heading}
                    </h3>
                    <div className="space-y-1.5 text-xs text-slate-300 leading-relaxed">
                      {sec.paragraphs.map((p, pIdx) => (
                        <p key={pIdx}>{p}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: KEBIJAKAN PRIVASI */}
          {activeTab === 'privacy' && (
            <div className="space-y-5 animate-fade-in">
              <div className="border-b border-slate-800 pb-3">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-lg sm:text-xl font-black text-white">
                    {content.privacy.title}
                  </h2>
                  <span className="text-[10px] text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-full">
                    Pembaruan: {content.privacy.lastUpdated}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#00A3FF] mt-0.5 font-semibold">
                  {content.privacy.tagline}
                </p>
              </div>

              <div className="space-y-4">
                {content.privacy.sections.map((sec, idx) => (
                  <div
                    key={idx}
                    className="bg-[#0b142e] border border-slate-800/90 rounded-2xl p-4.5 space-y-2"
                  >
                    <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-emerald-400" />
                      {sec.heading}
                    </h3>
                    <div className="space-y-1.5 text-xs text-slate-300 leading-relaxed">
                      {sec.paragraphs.map((p, pIdx) => (
                        <p key={pIdx}>{p}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Bar with Direct WhatsApp CS Contact */}
        <div className="p-4 sm:p-5 border-t border-slate-800/80 bg-[#060a1a] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Admin Support Siap Membantu 24 Jam Nonstop:</span>
            <strong className="text-white font-mono">{csConfig.whatsappPrimary}</strong>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleOpenWhatsApp}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat CS WhatsApp</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs transition-colors cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
