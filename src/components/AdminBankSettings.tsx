import React, { useState, useEffect } from 'react';
import {
  Building2,
  Landmark,
  CreditCard,
  Plus,
  Trash2,
  Edit2,
  Check,
  CheckCircle2,
  Power,
  RotateCcw,
  Save,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Info,
  Copy,
  Eye,
  AlertTriangle,
  Wallet,
  Smartphone,
  ShieldCheck,
  X,
} from 'lucide-react';
import {
  BankAccount,
  getBankAccounts,
  saveBankAccounts,
  resetBankAccounts,
  toggleBankAccountActive,
  updateBankAccount,
  addBankAccount,
  deleteBankAccount,
  moveBankAccount,
  EVENT_BANK_ACCOUNTS_UPDATED,
} from '../utils/bankStorage';
import { UniversalBankLogo } from './icons/BrandLogos';
import { getReinstoreContent, saveReinstoreContent } from '../utils/contentStorage';

const POPULAR_BANK_PRESETS = [
  { bankName: 'Bank Central Asia (BCA)', bankCode: 'BCA', category: 'bank' as const, fee: 2500, badge: 'Transfer Cepat' },
  { bankName: 'SeaBank Indonesia', bankCode: 'SEABANK', category: 'bank' as const, fee: 2500, badge: 'Bebas Admin Antar Bank' },
  { bankName: 'Bank Mandiri', bankCode: 'MANDIRI', category: 'bank' as const, fee: 2500, badge: 'Livin by Mandiri' },
  { bankName: 'Bank Rakyat Indonesia (BRI)', bankCode: 'BRI', category: 'bank' as const, fee: 2500, badge: 'BRImo' },
  { bankName: 'Bank Negara Indonesia (BNI)', bankCode: 'BNI', category: 'bank' as const, fee: 2500, badge: 'BNI Mobile' },
  { bankName: 'Bank Syariah Indonesia (BSI)', bankCode: 'BSI', category: 'bank' as const, fee: 2500, badge: 'BSI Mobile' },
  { bankName: 'Bank Krom', bankCode: 'KROM', category: 'bank' as const, fee: 2500, badge: 'Krom App' },
  { bankName: 'Bank Jago', bankCode: 'JAGO', category: 'bank' as const, fee: 2500, badge: 'Jago App' },
  { bankName: 'DANA E-Wallet', bankCode: 'DANA', category: 'ewallet' as const, fee: 2500, badge: 'Dompet Digital' },
  { bankName: 'GoPay / Gojek', bankCode: 'GOPAY', category: 'ewallet' as const, fee: 2500, badge: 'Dompet Digital' },
  { bankName: 'OVO Cash', bankCode: 'OVO', category: 'ewallet' as const, fee: 2500, badge: 'Dompet Digital' },
  { bankName: 'ShopeePay', bankCode: 'SHOPEEPAY', category: 'ewallet' as const, fee: 2500, badge: 'Dompet Digital' },
];

export const AdminBankSettings: React.FC = () => {
  const [accounts, setAccounts] = useState<BankAccount[]>(() => getBankAccounts());
  const [filterCategory, setFilterCategory] = useState<'all' | 'bank' | 'ewallet' | 'special'>('all');
  const [successToast, setSuccessToast] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Edit / Add modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<BankAccount | null>(null);

  // Form State
  const [formBankName, setFormBankName] = useState('');
  const [formBankCode, setFormBankCode] = useState('BCA');
  const [formAccountNumber, setFormAccountNumber] = useState('');
  const [formAccountName, setFormAccountName] = useState('');
  const [formCategory, setFormCategory] = useState<'bank' | 'ewallet' | 'retail'>('bank');
  const [formFee, setFormFee] = useState<number>(2500);
  const [formBadge, setFormBadge] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formIsActive, setFormIsActive] = useState(true);
  const [formIsSpecialDNS, setFormIsSpecialDNS] = useState(false);

  // Load and listen to updates
  useEffect(() => {
    const handleUpdate = () => {
      setAccounts(getBankAccounts());
    };
    window.addEventListener(EVENT_BANK_ACCOUNTS_UPDATED, handleUpdate);
    return () => window.removeEventListener(EVENT_BANK_ACCOUNTS_UPDATED, handleUpdate);
  }, []);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 3500);
  };

  // Sync with contentStorage payment guide so everything aligns
  const syncToContentStorage = (updatedAccounts: BankAccount[]) => {
    try {
      const content = getReinstoreContent();
      if (content && content.pembayaran && content.pembayaran.bankInfo) {
        const activeBankOnly = updatedAccounts
          .filter((a) => a.category === 'bank' && a.isActive)
          .map((a) => ({
            bank: a.bankName,
            accountNo: a.accountNumber,
            holder: a.accountName,
          }));

        if (activeBankOnly.length > 0) {
          const updatedContent = {
            ...content,
            pembayaran: {
              ...content.pembayaran,
              bankInfo: {
                ...content.pembayaran.bankInfo,
                accounts: activeBankOnly,
              },
            },
          };
          saveReinstoreContent(updatedContent);
        }
      }
    } catch (e) {
      console.warn('Sync to content storage skipped:', e);
    }
  };

  const handleToggle = (id: string, name: string) => {
    const updated = toggleBankAccountActive(id);
    setAccounts(updated);
    syncToContentStorage(updated);
    const target = updated.find((a) => a.id === id);
    showToast(
      target?.isActive
        ? `🟢 ${name} diaktifkan (ON) dan akan muncul saat checkout`
        : `⚪ ${name} dinonaktifkan (OFF) dan disembunyikan dari kasir`
    );
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus rekening "${name}"?`)) {
      const updated = deleteBankAccount(id);
      setAccounts(updated);
      syncToContentStorage(updated);
      showToast(`🗑️ Rekening "${name}" berhasil dihapus`);
    }
  };

  const handleMove = (id: string, direction: 'up' | 'down') => {
    const updated = moveBankAccount(id, direction);
    setAccounts(updated);
    syncToContentStorage(updated);
  };

  const handleReset = () => {
    if (confirm('Kembalikan seluruh daftar rekening bank ke setelan default toko (BCA, SeaBank, Mandiri, BRI, dll)?')) {
      const updated = resetBankAccounts();
      setAccounts(updated);
      syncToContentStorage(updated);
      showToast('🔄 Seluruh data rekening berhasil dikembalikan ke standar');
    }
  };

  const handleCopyTest = (accNum: string, id: string) => {
    navigator.clipboard.writeText(accNum);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Open modal for new account
  const openAddModal = (preset?: typeof POPULAR_BANK_PRESETS[0]) => {
    setEditingAccount(null);
    setFormBankName(preset?.bankName || '');
    setFormBankCode(preset?.bankCode || 'BCA');
    setFormAccountNumber('');
    setFormAccountName('RENGGA ARMANDA SETIAWAN');
    setFormCategory(preset?.category || 'bank');
    setFormFee(preset?.fee ?? 2500);
    setFormBadge(preset?.badge || '');
    setFormNotes(preset?.category === 'ewallet' ? 'Transfer via nomor HP penerima' : 'Transfer via mobile banking atau ATM');
    setFormIsActive(true);
    setFormIsSpecialDNS(false);
    setIsModalOpen(true);
  };

  // Open modal to edit existing account
  const openEditModal = (acc: BankAccount) => {
    setEditingAccount(acc);
    setFormBankName(acc.bankName);
    setFormBankCode(acc.bankCode);
    setFormAccountNumber(acc.accountNumber);
    setFormAccountName(acc.accountName);
    setFormCategory(acc.category);
    setFormFee(acc.fee);
    setFormBadge(acc.badge || '');
    setFormNotes(acc.notes || '');
    setFormIsActive(acc.isActive);
    setFormIsSpecialDNS(Boolean(acc.isSpecialDNS));
    setIsModalOpen(true);
  };

  // Save Add or Edit
  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formBankName.trim() || !formAccountNumber.trim() || !formAccountName.trim()) {
      alert('Nama Bank, Nomor Rekening, dan Nama Pemilik Rekening (a.n.) wajib diisi!');
      return;
    }

    if (editingAccount) {
      // Edit
      const updated = updateBankAccount(editingAccount.id, {
        bankName: formBankName.trim(),
        bankCode: formBankCode.trim().toUpperCase(),
        accountNumber: formAccountNumber.trim(),
        accountName: formAccountName.trim().toUpperCase(),
        category: formCategory,
        fee: Number(formFee) || 0,
        badge: formBadge.trim(),
        notes: formNotes.trim(),
        isActive: formIsActive,
        isSpecialDNS: formIsSpecialDNS,
      });
      setAccounts(updated);
      syncToContentStorage(updated);
      showToast(`✅ Data rekening "${formBankName}" berhasil disimpan!`);
    } else {
      // Add
      const updated = addBankAccount({
        bankName: formBankName.trim(),
        bankCode: formBankCode.trim().toUpperCase(),
        accountNumber: formAccountNumber.trim(),
        accountName: formAccountName.trim().toUpperCase(),
        category: formCategory,
        fee: Number(formFee) || 0,
        badge: formBadge.trim(),
        notes: formNotes.trim(),
        isActive: formIsActive,
        isSpecialDNS: formIsSpecialDNS,
      });
      setAccounts(updated);
      syncToContentStorage(updated);
      showToast(`🎉 Rekening baru "${formBankName}" berhasil ditambahkan!`);
    }

    setIsModalOpen(false);
  };

  // Filter accounts
  const filteredAccounts = accounts.filter((acc) => {
    if (filterCategory === 'bank') return acc.category === 'bank' && !acc.isSpecialDNS;
    if (filterCategory === 'ewallet') return acc.category === 'ewallet' && !acc.isSpecialDNS;
    if (filterCategory === 'special') return Boolean(acc.isSpecialDNS);
    return true;
  });

  const activeCount = accounts.filter((a) => a.isActive).length;
  const inactiveCount = accounts.filter((a) => !a.isActive).length;

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {successToast && (
        <div className="bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 px-4 py-3 rounded-2xl flex items-center justify-between text-xs font-semibold shadow-lg animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successToast}</span>
          </div>
          <button
            onClick={() => setSuccessToast('')}
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Header Card */}
      <div className="bg-[#091024] border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <Landmark className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-lg font-black text-white">
                  Kelola Data Rekening Bank & E-Wallet
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold uppercase tracking-wider">
                  Live Sinkron Kasir
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                Ubah nomor rekening, nama pemilik rekening (a.n.), dan aktif/nonaktifkan bank yang dapat dipilih pembeli saat melakukan pembayaran manual saat checkout.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => openAddModal()}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Rekening Baru</span>
            </button>
            <button
              onClick={handleReset}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Reset ke daftar rekening standar"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Standar</span>
            </button>
          </div>
        </div>

        {/* Counter Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
          <div className="bg-[#0c152e] border border-slate-800 rounded-2xl p-3">
            <div className="text-[10px] text-slate-400 uppercase font-bold">Total Rekening / Akun</div>
            <div className="text-xl font-black text-white mt-0.5">{accounts.length} Akun</div>
          </div>
          <div className="bg-[#0c152e] border border-emerald-500/20 rounded-2xl p-3">
            <div className="text-[10px] text-emerald-400 uppercase font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Status Aktif (ON)
            </div>
            <div className="text-xl font-black text-emerald-300 mt-0.5">{activeCount} Tampil di Kasir</div>
          </div>
          <div className="bg-[#0c152e] border border-slate-800 rounded-2xl p-3">
            <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-500" />
              Status Nonaktif (OFF)
            </div>
            <div className="text-xl font-black text-slate-400 mt-0.5">{inactiveCount} Disembunyikan</div>
          </div>
          <div className="bg-[#0c152e] border border-blue-500/20 rounded-2xl p-3">
            <div className="text-[10px] text-blue-400 uppercase font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              Keamanan Rekening
            </div>
            <div className="text-xs font-bold text-slate-300 mt-1">Enkripsi Data Aman</div>
          </div>
        </div>

        {/* Quick Add Presets */}
        <div className="mt-5 pt-4 border-t border-slate-800/80">
          <span className="text-[11px] text-slate-400 font-bold block mb-2">
            ⚡ Tambah Cepat Bank Populer Indonesia:
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {POPULAR_BANK_PRESETS.map((preset) => {
              const alreadyExists = accounts.some(
                (a) => a.bankCode === preset.bankCode && a.category === preset.category
              );
              return (
                <button
                  key={preset.bankCode + preset.category}
                  onClick={() => openAddModal(preset)}
                  className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    alreadyExists
                      ? 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-white'
                      : 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20'
                  }`}
                >
                  <Plus className="w-3 h-3 text-cyan-400" />
                  <span>{preset.bankCode}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 bg-[#091024] p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterCategory === 'all'
                ? 'bg-cyan-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Semua Akun ({accounts.length})
          </button>
          <button
            onClick={() => setFilterCategory('bank')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterCategory === 'bank'
                ? 'bg-cyan-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Bank Transfer ({accounts.filter((a) => a.category === 'bank' && !a.isSpecialDNS).length})
          </button>
          <button
            onClick={() => setFilterCategory('ewallet')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterCategory === 'ewallet'
                ? 'bg-cyan-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            E-Wallet ({accounts.filter((a) => a.category === 'ewallet' && !a.isSpecialDNS).length})
          </button>
          <button
            onClick={() => setFilterCategory('special')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterCategory === 'special'
                ? 'bg-cyan-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Akun Khusus DNS ({accounts.filter((a) => a.isSpecialDNS).length})
          </button>
        </div>

        <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-cyan-400" />
          <span>Gunakan saklar <strong>ON / OFF</strong> untuk menampilkan atau menyembunyikan bank</span>
        </div>
      </div>

      {/* Account Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAccounts.map((acc, index) => {
          const isCopied = copiedId === acc.id;
          return (
            <div
              key={acc.id}
              className={`bg-[#091024] border rounded-3xl p-5 shadow-lg transition-all relative overflow-hidden flex flex-col justify-between ${
                acc.isActive
                  ? 'border-slate-800 hover:border-cyan-500/50'
                  : 'border-slate-800/60 opacity-65 bg-[#070c1a]'
              }`}
            >
              {/* Card Top: Logo, Badges, and ON/OFF Switch */}
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="shrink-0">
                      <UniversalBankLogo
                        bankCode={acc.bankCode}
                        bankName={acc.bankName}
                        id={acc.id}
                        className="h-7"
                      />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-white flex items-center gap-2">
                        <span>{acc.bankName}</span>
                        {acc.isSpecialDNS && (
                          <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                            Khusus DNS
                          </span>
                        )}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">
                          Kode: <strong className="text-slate-200">{acc.bankCode}</strong>
                        </span>
                        {acc.badge && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                            {acc.badge}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Master ON / OFF Toggle Switch */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider ${
                        acc.isActive ? 'text-emerald-400' : 'text-slate-500'
                      }`}
                    >
                      {acc.isActive ? 'ON' : 'OFF'}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleToggle(acc.id, acc.bankName)}
                      className={`w-12 h-6.5 rounded-full p-0.5 transition-colors relative cursor-pointer ${
                        acc.isActive ? 'bg-emerald-500' : 'bg-slate-700'
                      }`}
                      title={acc.isActive ? 'Klik untuk mematikan (OFF)' : 'Klik untuk mengaktifkan (ON)'}
                    >
                      <div
                        className={`w-5.5 h-5.5 rounded-full bg-white shadow-md transform transition-transform ${
                          acc.isActive ? 'translate-x-5.5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Account Details Box (Atm / Card style) */}
                <div className="bg-[#060c1c] border border-slate-800 rounded-2xl p-4 my-3 relative overflow-hidden">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase font-bold mb-1">
                    <span>
                      {acc.category === 'ewallet' ? 'Nomor HP E-Wallet / Akun:' : 'Nomor Rekening:'}
                    </span>
                    <span className="text-cyan-400 font-mono">
                      Biaya Admin: {acc.fee === 0 ? 'Gratis' : `Rp ${new Intl.NumberFormat('id-ID').format(acc.fee)}`}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2 mt-1">
                    <div className="text-lg sm:text-xl font-mono font-black text-white tracking-wider select-all">
                      {acc.accountNumber}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyTest(acc.accountNumber, acc.id)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold flex items-center gap-1 transition-colors shrink-0 cursor-pointer"
                      title="Salin nomor rekening untuk uji coba"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Salin</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-400 text-[11px]">
                      Atas Nama (a.n.):
                    </span>
                    <strong className="text-cyan-300 font-bold uppercase tracking-wide">
                      {acc.accountName}
                    </strong>
                  </div>

                  {acc.notes && (
                    <p className="text-[10px] text-slate-400 mt-2 bg-slate-900/50 p-2 rounded-lg border border-slate-800/60 leading-relaxed">
                      💡 {acc.notes}
                    </p>
                  )}
                </div>
              </div>

              {/* Card Footer: Edit, Reorder, Delete */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 text-xs">
                {/* Reorder Buttons */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleMove(acc.id, 'up')}
                    disabled={index === 0}
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 cursor-pointer"
                    title="Pindahkan ke atas"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleMove(acc.id, 'down')}
                    disabled={index === filteredAccounts.length - 1}
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 cursor-pointer"
                    title="Pindahkan ke bawah"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] text-slate-500 font-mono ml-1">
                    Urutan #{acc.order}
                  </span>
                </div>

                {/* Edit & Delete */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(acc)}
                    className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Ubah Data</span>
                  </button>
                  <button
                    onClick={() => handleDelete(acc.id, acc.bankName)}
                    className="p-1.5 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                    title="Hapus Rekening"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredAccounts.length === 0 && (
        <div className="bg-[#091024] border border-slate-800 rounded-3xl p-10 text-center text-slate-400">
          <Landmark className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-300">Tidak ada rekening di kategori ini.</p>
          <button
            onClick={() => openAddModal()}
            className="mt-3 px-4 py-2 rounded-xl bg-cyan-500 text-white text-xs font-bold inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Rekening Baru</span>
          </button>
        </div>
      )}

      {/* Modal: Tambah / Ubah Data Bank */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#091024] border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl relative overflow-hidden my-auto animate-in zoom-in-95">
            {/* Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-[#0c152e]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Landmark className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">
                    {editingAccount ? 'Ubah Data Rekening Bank' : 'Tambah Rekening Bank Baru'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Data ini langsung muncul saat pembeli checkout
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveModal} className="p-5 space-y-4">
              {/* Bank Preset Selection for Easy Fill */}
              {!editingAccount && (
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Pilih Template Bank Cepat:
                  </label>
                  <select
                    value={formBankCode}
                    onChange={(e) => {
                      const selected = POPULAR_BANK_PRESETS.find((p) => p.bankCode === e.target.value);
                      if (selected) {
                        setFormBankCode(selected.bankCode);
                        setFormBankName(selected.bankName);
                        setFormCategory(selected.category);
                        setFormBadge(selected.badge);
                      }
                    }}
                    className="w-full bg-[#0c152e] border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:border-cyan-400 focus:outline-none"
                  >
                    {POPULAR_BANK_PRESETS.map((p) => (
                      <option key={p.bankCode} value={p.bankCode}>
                        {p.bankName} ({p.bankCode})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Bank Name */}
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  Nama Bank / E-Wallet <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formBankName}
                  onChange={(e) => setFormBankName(e.target.value)}
                  placeholder="Contoh: Bank Central Asia (BCA)"
                  className="w-full bg-[#0c152e] border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:border-cyan-400 focus:outline-none"
                  required
                />
              </div>

              {/* Code & Category */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Kode Singkat Bank
                  </label>
                  <input
                    type="text"
                    value={formBankCode}
                    onChange={(e) => setFormBankCode(e.target.value.toUpperCase())}
                    placeholder="Contoh: BCA, BRI, MANDIRI"
                    className="w-full bg-[#0c152e] border border-slate-700 text-white uppercase font-mono font-bold rounded-xl px-3 py-2 text-xs focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Kategori Jalur
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full bg-[#0c152e] border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="bank">Transfer Bank</option>
                    <option value="ewallet">E-Wallet (DANA, GoPay, OVO, ShopeePay)</option>
                    <option value="retail">Gerai Ritel</option>
                  </select>
                </div>
              </div>

              {/* Account Number */}
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  Nomor Rekening / No. HP E-Wallet <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formAccountNumber}
                  onChange={(e) => setFormAccountNumber(e.target.value)}
                  placeholder="Contoh: 8720386438 atau 08123456789"
                  className="w-full bg-[#0c152e] border border-cyan-500/50 text-cyan-300 font-mono font-bold text-sm rounded-xl px-3.5 py-2.5 focus:border-cyan-400 focus:outline-none shadow-[0_0_12px_rgba(6,182,212,0.15)]"
                  required
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Nomor ini yang akan disalin oleh pembeli untuk transfer.
                </span>
              </div>

              {/* Account Name */}
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  Atas Nama Pemilik Rekening (a.n.) <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formAccountName}
                  onChange={(e) => setFormAccountName(e.target.value.toUpperCase())}
                  placeholder="Contoh: RENGGA ARMANDA SETIAWAN"
                  className="w-full bg-[#0c152e] border border-slate-700 text-white uppercase font-bold rounded-xl px-3 py-2 text-xs focus:border-cyan-400 focus:outline-none"
                  required
                />
              </div>

              {/* Fee & Badge */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Biaya Admin (Rp)
                  </label>
                  <input
                    type="number"
                    value={formFee}
                    onChange={(e) => setFormFee(Number(e.target.value))}
                    placeholder="2500"
                    className="w-full bg-[#0c152e] border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Badge / Tagline Singkat
                  </label>
                  <input
                    type="text"
                    value={formBadge}
                    onChange={(e) => setFormBadge(e.target.value)}
                    placeholder="Contoh: Transfer Otomatis"
                    className="w-full bg-[#0c152e] border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  Catatan Transfer Tambahan (Opsional)
                </label>
                <input
                  type="text"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Contoh: Transfer via m-BCA atau ATM"
                  className="w-full bg-[#0c152e] border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:border-cyan-400 focus:outline-none"
                />
              </div>

              {/* Toggles */}
              <div className="p-3 bg-[#0c152e] rounded-xl border border-slate-800 space-y-2.5">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-xs font-bold text-slate-200">
                    Aktifkan Langsung di Kasir (ON / OFF)
                  </span>
                  <input
                    type="checkbox"
                    checked={formIsActive}
                    onChange={(e) => setFormIsActive(e.target.checked)}
                    className="w-4 h-4 accent-cyan-500 rounded"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-xs font-bold text-slate-200">
                    Khusus Produk DNS AdGuard
                  </span>
                  <input
                    type="checkbox"
                    checked={formIsSpecialDNS}
                    onChange={(e) => setFormIsSpecialDNS(e.target.checked)}
                    className="w-4 h-4 accent-cyan-500 rounded"
                  />
                </label>
              </div>

              {/* Live Preview Box inside Modal */}
              <div className="p-3 rounded-xl bg-[#060c1c] border border-cyan-500/30 text-xs">
                <span className="text-[10px] uppercase font-bold text-cyan-400 block mb-1">
                  Pratinjau Tampilan di Kasir Pembeli:
                </span>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white text-xs">{formBankName || 'Nama Bank'}</div>
                    <div className="font-mono text-cyan-300 font-bold text-sm mt-0.5">
                      {formAccountNumber || '0000000000'}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      a.n. <strong className="text-slate-200">{formAccountName || 'NAMA PEMILIK'}</strong>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                      {formIsActive ? '🟢 AKTIF' : '⚪ NONAKTIF'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{editingAccount ? 'Simpan Perubahan' : 'Tambahkan Rekening'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
